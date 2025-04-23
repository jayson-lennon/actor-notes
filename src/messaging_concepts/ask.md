# Ask (a.k.a. Request-Response)

The `ask` pattern is a way to achieve a request-response interaction between actors where the sending actor explicitly expects a reply. Unlike the basic `tell` where the sender fires and forgets, `ask` provides a mechanism for the sender to wait for a result corresponding to its specific request. This can be modeled as a `Future` and used with `async/await`.

Using `ask` is much closer to sequential programming. Code within the actor executes line-by-line and waits for responses each time.

## Problems with Ask

While `ask` seems convenient, its use introduces significant complications that often violate core actor principles and lead to hard-to-debug issues. Almost all stem from the fact that the actor's processing flow is now waiting on an external event (the response arriving to complete the Future) rather than solely processing its incoming message queue.

1. **Occupies the Actor's Execution Context**

    Until the Future completes (or times out) and the response is received, the actor cannot process *other* messages that arrive in its mailbox.

2. **Cannot Gracefully Shutdown**

    Because the actor is busy waiting on the `ask` Future, it may not be able to process a shutdown message received in its mailbox in a timely manner. It might be stuck waiting for a reply that never comes or waiting for a timeout.

3. **Cannot Process Control Messages**

    Similar to shutdown, critical control messages (like state queries, configuration updates, or explicit stop/cancel requests relevant to the actor's current task) might be delayed or missed because the actor is occupied with waiting for the `ask` response.

4. **Memory Leaks and Resource Exhaustion**

    If a response message is genuinely lost or the target actor fails without sending a reply, the `Future` returned by `ask` will never complete. Without explicitly setting a timeout on *every* `ask` call, the actor's logic waiting on that Future will effectively hang indefinitely, consuming memory and     preventing the actor from processing further messages. Managing timeouts reliably for every request adds complexity.

5. **Message Loss**

    Actor mailboxes uses bounded queues in order to prevent resource exhaustion. If an actor is stuck waiting on a Future, then the mailbox will fill up and messages will start to get dropped.

For these reasons it's recommended that actor systems be designed around `tell` (fire and forget messaging) instead of `ask`.
