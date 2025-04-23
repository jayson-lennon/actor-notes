# Journal

The **Journal** is a fundamental concept in actor systems designed for durability, fault tolerance, and recovery, especially those implementing event sourcing. It acts as a persistent, ordered log of the significant state changes or events that an actor has processed.

## What is a Journal?

At its core, a Journal is an immutable, append-only sequence of events or commands associated with a specific actor instance. Instead of saving the actor's current state directly, the actor logs the *facts* (events) or *decisions* (commands leading to events) that alter its state.

## Purpose and Use Cases

Journals are primarily used for:

- **Durability:** Ensuring that an actor's history and the consequences of its actions are not lost if the actor or the entire system crashes.
- **Recovery:** Allowing an actor to reliably rebuild its state by replaying the sequence of events from its journal after a failure or planned restart.
- **Consistency:** Providing a single, authoritative source of truth for an actor's history, enabling deterministic state reconstruction.
- **Auditing:** The journal provides a complete history of an actor's life and state changes, valuable for debugging, compliance, and analysis.
- **Event Sourcing:** Journals are the cornerstone of event-sourced systems, where the application state is determined solely by applying a sequence of events.

## The Immutable Event Log

The central idea is that events are facts: they represent something that *has already happened*. Once an event is recorded in the journal, it is typically considered immutable and should never be changed or deleted (though some systems might allow compaction or snapshotting to manage size). The actor's current state is merely a projection or fold over this sequence of past events.

## Actor-Specific Journals

Journal implementations are inherently **actor-specific**, or more accurately, tied to the *type* or *behavior* of an actor rather than being a generic, one-size-fits-all log.

- The events stored in a `UserAccount` actor's journal (`AccountCreated`, `AddressChanged`, `PasswordReset`) are specific to the concept of a user account.
- The events stored in an `Order` actor's journal (`OrderPlaced`, `ItemAdded`, `PaymentProcessed`) are specific to an order.

This actor-specific nature reinforces **encapsulation**. The interpretation and application of events in a `UserAccount` journal are the sole responsibility of the `UserAccount` actor logic. No other actor should directly read or try to interpret the raw events from another actor's journal; they should interact via messages (Commands or Queries) or react to published events from the actor they are interested in.

## Journals vs. Snapshots

While the journal logs incremental changes (events), rebuilding state by replaying every event from the beginning can become time-consuming for long-lived actors with large journals. To mitigate this, **snapshots** can be used.

- A **Snapshot** captures the actor's full internal state at a specific point in time (i.e., after applying a certain number of events).
- Think of the **Journal** as the transaction history (the list of all deposits and withdrawals) and a **Snapshot** as the account balance at a specific date.

## The Recovery Process

When an actor needs to recover its state (due to a crash, migration, or intentional restart):

1. **Load Latest Snapshot (Optional):** The recovery process first checks for the most recent snapshot for this actor instance. If found, it loads this snapshot, restoring the state to that point.
2. **Replay Journaled Events:** The process then reads the events from the journal that occurred *after* the snapshot was taken (or from the beginning if no snapshot was loaded).
3. **Apply Events:** Each of these events is applied sequentially to the loaded state. This brings the actor's state up-to-date.
4. **Resume Processing:** Once all relevant journal entries have been replayed, the actor is considered recovered and can resume processing new incoming messages from its mailbox.

This deterministic replay ensures the actor's state is consistent and accurate based on its recorded history.

## Journal Implementations

The underlying storage for journals varies:

- Databases (SQL, NoSQL)
- File systems
- Specialized distributed log systems (like Apache Kafka, EventStoreDB)

The choice depends on requirements for throughput, latency, consistency guarantees, scalability, and operational complexity. Actor frameworks often provide pluggable journal backends.

## Journal Sequence Numbers

A critical aspect of the Journal's functionality, especially for ensuring reliable recovery and consistency, is the use of **Sequence Numbers**.

For each persistent actor instance, the events or commands written to its Journal are assigned a strictly **increasing, contiguous sequence number**. This number uniquely identifies the position of an entry within *that specific actor's* journal log. Typically, the sequence starts from 1 for the first entry written by a given actor instance.

### How Sequence Numbers are Used

1. **Ordering and Determinism**

    Sequence numbers enforce the order in which events occurred. During recovery, the actor system reads entries from the journal in strict order of increasing sequence numbers. This guarantees that applying the same sequence of events in the same order will always result in the same final state, making recovery deterministic.

2. **Tracking Progress**

    An actor knows how far along it is in processing its history by the sequence number of the last event it successfully processed and persisted. The highest sequence number for an actor's journal represents its most up-to-date persisted state change.

3. **Coordination with Snapshots**

    Sequence numbers are the bridge between Journals and Snapshots. When a Snapshot of an actor's state is saved, it is always associated with the **sequence number of the last journal entry that was applied to reach that state**. This sequence number is stored alongside the snapshot.

4. **Defining Recovery Range**

    During recovery with a snapshot, the system loads the snapshot and notes its associated sequence number (let's call it `S`). It then tells the Journal store to retrieve all events for this actor starting *from sequence number `S + 1`*. This ensures that only the events that occurred *after* the snapshot was taken are replayed on top of the snapshot state, avoiding redundant processing and potential inconsistencies.

5. **Detecting Gaps**

    While ideally the journal store ensures contiguous sequence numbers, the numbers provide a way for the system to potentially detect if entries are missing or out of order (though the storage backend should handle this reliability).

It's important to remember that these sequence numbers are **local to a specific actor instance's journal**. They do not represent a global ordering of events across the entire system or across different actors. Each persistent actor manages its own independent sequence of journal numbers.

## Design Principles

When designing actors that use journals:

- **Identify Core Events:** Focus on the business-meaningful events that represent durable facts.
- **Events are Immutable:** Design event structures to be facts in the past tense.
- **State is Computed:** Ensure the actor's current state is a projection of its journaled events.
- **Actor-Specific:** Keep journal event formats and interpretation private to the actor type.
- **Consider Snapshots:** Plan for snapshotting if replay time becomes a concern.
