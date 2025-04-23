# Message Passing

While message passing is fundamentally different from direct function calls, it's helpful to understand the conceptual similarity. In imperative programming, you have a function that takes arguments, performs some operation, and returns a value.  In an actor system:

- **The Actor:** Represents the "function" – encapsulating logic and state.
- **The Message:** Acts as both the argument *and* the trigger for execution. It tells the actor what to do.
- **The Response (Optional):** The actor's actions, potentially including sending new messages to other actors, can be considered a form of "response" – communicating results or initiating further processing.

However, the crucial difference is that message passing is *asynchronous* and *never* blocks.  The sender doesn’t wait for a direct return value; it continues its own work while the actor processes the message. This decoupling is key to concurrency and resilience. Actors control the flow of information by deciding which messages to process, when to send new messages, and how to update their internal state based on those messages. They act as gatekeepers, ensuring that data flows through the system in a controlled and predictable manner.

The actor's message handler should handle incoming messages promptly without getting stuck in blocking operations. If extensive computations or delays are inevitable, these tasks should be executed asynchronously using background threads or tasks managed by the actor.

Keeping the message handling function fast in order to process messages immediately (or near-immediate) allows for control messages to be processed by the actor while it's working. This enables interesting capabilities, such as:

- **Self-monitoring**

    Actors can schedule periodic messages to themselves to perform self-monitoring checks like offloading work to other actors if their queue becomes too large.

- **Temporary Suspension**

    An outside source can order an actor to suspend operation, but maintain their message queue. For example, maybe a quota was hit and we need to stop processing, but we still want to resume work later after the quota is reset or increased.

- **Message Rejection**

    Perhaps some messages are no longer relevant, so the actor can be told to drop their pending jobs.

- **Graceful Shutdown**

    Shutdown messages can be sent to the actor which order it to stop. The actor can then perform various cleanup operations before quitting. This may include:

  - dropping remaining messages
  - finishing remaining messages
  - creating a snapshot so work can be resumed later

This design allows actors to be highly responsive and flexible in handling various scenarios.
