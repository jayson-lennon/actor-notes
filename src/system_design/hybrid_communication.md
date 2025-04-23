# Hybrid Communication

A common and effective strategy in larger actor systems, especially those adhering to Domain-Driven Design principles, is to employ a hybrid communication model. This approach uses Publish/Subscribe for communication *between* distinct Bounded Contexts, and direct `ActorRef` messaging for communication *within* a Bounded Context.

A [**Bounded Context**](https://martinfowler.com/bliki/BoundedContext.html) can be thought of as a logical boundary encompassing a set of related actors, data, and business logic that operates around a specific part of the domain (e.g., Order Management, Inventory, Shipping).

### Inter-Context Communication via Pub/Sub

When functionality in one bounded context needs to interact with or be notified of events in another context, Pub/Sub is utilized. For example:

- An `Order Management` context publishes an `OrderPlaced` event to a topic.
- An `Inventory` context subscribes to the `OrderPlaced` topic to decrement stock levels.
- A `Shipping` context also subscribes to the `OrderPlaced` topic to initiate the shipping process.

**Rationale:** Pub/Sub provides loose coupling between contexts. The `Order Management` context doesn't need to know *who* is interested in an `OrderPlaced` event, only that it happened. This allows contexts to evolve independently. New contexts can subscribe to existing events without modifying the publisher. It abstracts away the location and specific instances of actors in other contexts. Failures in one subscriber context do not directly impact the publisher or other subscribers.

### Intra-Context Communication via Direct ActorRef

Within a single bounded context, actors often have close relationships and need to interact directly and efficiently. For example:

- Within the `Order Management` context, an `OrderAggregate` actor might communicate directly with `OrderItem` actors or a `PaymentProcessor` actor *within the same context*.

**Rationale:** Direct `ActorRef` communication within a context is typically faster and more performant than routing through a Pub/Sub layer. Actors within the same context are often managed together (e.g., by the same supervisor), and their interactions are tightly coupled by the context's specific business logic. The overhead and indirection of Pub/Sub are unnecessary and counterproductive for these direct, focused interactions. While direct `ActorRef`s require managing references and handling potential instance failures, this complexity is contained *within* the boundary of the context. The context's internal supervision and management strategies can handle failures of its internal actors.


### Benefits of the Hybrid Approach

This hybrid model leverages the strengths of both patterns:

*   **Loose Coupling Between Contexts:** Facilitates independent development, deployment, and scaling of different parts of the system. Changes within one context are less likely to break others, provided the published event contracts remain stable.
*   **Efficient Interaction Within Contexts:** Enables high-performance, direct communication for tightly related actors and operations within a specific domain area.
*   **Containment of Complexity:** The complexity of managing direct `ActorRef` lifecycles and failures is contained within the context boundary, while the complexity of managing subscriptions and message relay is centralized in the Pub/Sub layer.
*   **Clear Boundaries:** Reinforces the separation defined by the bounded contexts, making the system architecture easier to understand and maintain.

### Implementation Concerns

Note that actors _within_ the context _do not_ communicate with any actors outside their context. All messages outside the context must be routed through a gateway actor which acts as the only entry and exit point for messages into and out of the context. This gateway actor also plays a role as an [anti-corruption layer](https://deviq.com/domain-driven-design/anti-corruption-layer), translating messages at the context boundary. This allows the context to evolve over time without having an impact on the rest of the system.

