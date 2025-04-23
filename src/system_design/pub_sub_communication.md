# Pub/Sub Communication

Publish/Subscribe (Pub/Sub) is a messaging pattern where senders (publishers) do not send messages directly to specific receivers (subscribers). Instead, publishers categorize messages into topics or channels without knowing which subscribers, if any, will receive them. Subscribers express interest in one or more topics and receive all messages published to the topics they are subscribed to.

In an actor system context, actors can act as publishers, subscribers, or both. An actor publishes a message to a specific topic managed by a dedicated Pub/Sub service or mediator actor within or external to the system. Other actors subscribe to this topic via the same service.

### Pub/Sub and Event-Driven Design

This pattern aligns closely with **event-driven design**. Publishers emit "events" (messages) describing something that has happened (e.g., `UserCreated`, `OrderPlaced`, `ItemUpdated`). Subscribers, acting upon these events, react to changes in the system state without needing to know the source of the event. This creates a loosely coupled system where components interact primarily by reacting to a stream of events.

### Trade-offs: Overhead vs. Management

A key characteristic of Pub/Sub is that all messages for a given topic _must_ pass through the Pub/Sub service or mediator. This introduces a layer of indirection and potential overhead. The service needs to receive the message, determine which subscribers are interested, and relay the message to each of them. This adds latency compared to a direct actor-to-actor message send, and consumes resources in the Pub/Sub infrastructure itself.

However, this overhead comes with significant benefits, primarily in alleviating the management of direct communication channels. With Pub/Sub:

- Publishers do not need `ActorRef`s for specific subscribers. They only need to know the Pub/Sub service and the topic.
- The system becomes more resilient to the failure of individual subscriber instances. If a subscriber actor dies, the publisher is unaffected, and other subscribers continue to receive messages. The responsibility of ensuring a subscriber receives messages (potentially after a restart) often shifts to the Pub/Sub infrastructure or the subscriber's supervisor/registration mechanism.
- Subscribers can join or leave topics dynamically without affecting publishers or other subscribers.
- Adding new functionality to the system becomes trivial: Create a new actor, subscribe to a specific topic, and it's now integrated

Compared to direct `ActorRef` communication where managing dead letters and finding replacement actor instances is a concern for the sender, Pub/Sub shifts the complexity. The challenge moves from managing many point-to-point connections to ensuring the reliability and scalability of the central Pub/Sub service and how actors register/deregister their subscriptions.

