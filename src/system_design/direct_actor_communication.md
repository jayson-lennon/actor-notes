# Direct Actor Communication

Direct actor communication relies on one actor holding a reference (`ActorRef`) to a specific instance of another actor. Messages are sent directly from the sender actor's `ActorRef` to the receiver actor's `ActorRef`. This approach is straightforward and provides a clear path for point-to-point interactions.

However, a significant challenge arises when the target actor instance terminates. Because the `ActorRef` points to a specific instance, if that instance dies (due to an exception, planned shutdown, or other reason), the `ActorRef` becomes a "dead letter" reference. Any subsequent messages sent to this dead `ActorRef` will typically be routed to a system-defined dead letter mailbox, never reaching the intended recipient. The communication channel between the two specific instances is effectively broken.

## Handling Channel Failure

Strategies for dealing with this broken channel include:

1. **Death Watch**

    The sending actor can "watch" the receiving actor. When the receiving actor terminates, the sender receives a `Terminated` message. This signals the sender that the `ActorRef` is now stale and should no longer be used. The "watch" capability can be achieved by linking actors together in a supervision tree in order to be notified when the actor dies.

2. **Message Delivery Failure**

    While not guaranteed in all actor systems, some systems might provide feedback (e.g., via acknowledgements or specific error messages) if a message cannot be delivered to a live instance. This would result in an error when attempting to send a message to the dead actor.

3. **Protocol-Level Acknowledgements**

    Design the communication protocol such that the receiver explicitly acknowledges processing messages. If an acknowledgement isn't received within a timeout, the sender can infer failure, potentially due to a dead receiver.

## Design Considerations

Given that a direct `ActorRef` connection to a specific instance can fail, architectural designs using this pattern should account for potential disruptions. Here are some strategies that can be used to manage recovery.

### Finding a Replacement

If the target actor was part of a supervised hierarchy and is restarted, the sender needs a *new* `ActorRef` for the replacement instance. This often requires a mechanism outside the direct reference, such as:

- Querying a parent supervisor or registry for the new `ActorRef`.
- Using a naming service where actors register themselves by a logical ID.

In both of these scenarios, there *will* be a time delay between the time the dead actor is restarted and the propagation of it's new `ActorRef` to a registry or naming service. This facilitates the need for the sending actor to use exponential backoff on retries because it may receive the same (dead) `ActorRef` from a registry while the dead actor restarts.

### Idempotency

While not directly addressing `ActorRef`, it's still important to design messages and receiver logic to be [idempotent](https://en.wikipedia.org/wiki/Idempotence) where possible. This allows the sender to safely retry sending a message (potentially to a newly acquired `ActorRef` for a replacement actor) without causing unintended side effects if the original message was partially processed before the crash.

### Fault Tolerance Boundaries

Clearly define which parts of the system rely on direct actor communication and implement robust error handling and recovery strategies at those boundaries.

Put flaky connections and unstable crash-prone actors behind a "router" actor. Communication can then be reliably made to the router actor, which then relays the message to the unstable ones. The router actor can include the retry and queuing mechanisms which will allow senders to send messages without worrying about error handling.
