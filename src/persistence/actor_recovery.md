# Actor Startup and Ready State

Note that larger actor frameworks will provide some form of a `persistence` module. This should provide all of the functionality needed to restore actors to their original state. However, if you do not have access to a persistent-capable framework, then this page details how recovery works.

---

When an actor is created or restarted, it goes through an initialization phase before it is fully capable of processing regular messages from its mailbox. This phase is crucial for establishing the actor's initial state. For actors that use persistence, this startup phase involves state recovery.

An actor can be thought of as transitioning through distinct **internal states**:

* **Initializing / Recovering**

    The actor has been created but is actively loading its past state from a journal or other persistent store. It is not yet ready to handle its primary     operational messages.

* **Ready**

    The actor has successfully loaded its historical state and is now capable of processing all types of incoming messages according to its main business logic.

## The Startup Process: Entering the Initializing State

When a persistent actor instance is spawned by the system, its `on_start` logic begins. At this point, the actor enters the **Initializing** state. The actor's first task is typically to initiate the recovery process.

This involves:

1. Starting out in an `Initializing` state.
2. Sending a specific message to a known "Journal Reader" actor or service, requesting its historical data (events) based on its unique identity.
3. Potentially sending a similar request to a "Snapshot Store" service if snapshots are used, asking for the latest snapshot.

The actor now waits for these recovery messages to arrive in its mailbox.

## Handling Messages During Recovery: Stashing

Any message sent to the actor's `ActorRef` will be placed in its mailbox, but this needs to be handled carefully.

Since the actor cannot correctly process regular operational messages until its state is recovered, its `handler` logic must check its current state. If the actor is `Initializing` and receives a message that is *not* part of the recovery process (i.e., not a response from the Journal Reader or Snapshot Store), it must **stash** the message.

Stashing involves:

* Checking if the actor's current state is `Initializing`.
* If yes, storing the incoming message in a temporary internal collection, like a `VecDeque` (a double-ended queue), often called the "stash".
* Returning from the `handler` function without processing the message's content against the actor's business logic.

Messages related to recovery (like `SnapshotLoaded(state, seq_num)` or `JournalEntry(event, seq_num)`) are *not* stashed; they are processed immediately by the `receive` function's `Initializing` state logic to rebuild the actor's state.

## Replaying History and Transitioning to Ready

As the actor receives recovery messages from the Journal Reader/Snapshot Store:

1. It applies the loaded snapshot state (if any).
2. It applies each journaled event in sequence number order, mutating its internal state just as it would for a new incoming command/event.

Once the actor has received and applied all historical data (e.g., indicated by a final message from the Journal Reader like `RecoveryComplete(last_seq_num)`), it knows its state is fully reconstructed. At this moment, the actor performs a critical state transition:

* It changes its state from `Initializing` to `Ready`.

## Processing Stashed Messages and New Messages

Upon transitioning to the `Ready` state, the actor's priority changes:

1. It first processes all messages currently held in its internal "stash". It iterates through the stash and passes each stashed message back to its `receive` function, this time processing it using the `Ready` state logic. This ensures messages received during recovery are handled in the order they arrived (relative to each other).
2. After the stash is empty, the actor proceeds to process any new messages that subsequently arrive in its mailbox, using its `Ready` state logic.
