# Correlation IDs

In distributed systems and asynchronous messaging architectures, operations often span multiple messages, actors, or services. Tracking the flow of a single logical transaction or request through this series of interactions can be challenging. This is where **Correlation IDs** become invaluable.

A **Correlation ID** is a unique identifier assigned to the *initial message* or event of a specific transaction or workflow. This same ID is then included in *all subsequent messages* or events that are part of that same logical flow.

Correlation IDs are **not typically used for general system-level messages** (like supervision signals, acknowledgements handled by the framework, or broadcast system events) or for tracking the overall health of the messaging infrastructure itself. They are specifically for tracing the path and state of a **specific business process or workflow** that spans multiple actors or services.

Think of it as monitoring an *individual product* as it moves through different stations on an assembly line (the workflow), rather than monitoring the health or overall throughput of the assembly line machinery itself. Some examples of where you *would* use Correlation IDs in a workflow include:

- Tracking an individual order as it moves from `Order Placed` -> `Payment Processed` -> `Inventory Reserved` -> `Shipped`.
- Following a user's request through several microservices or actor interactions to fulfill that request.
- Monitoring the steps involved in processing a single incoming data record through a processing pipeline.

By limiting Correlation IDs to business workflows, they provide highly relevant context for debugging and understanding the journey of individual requests, without cluttering system-level communication.

## Purpose and Usage

When Actor A sends a message that triggers a series of actions involving Actors B, C, and potentially others, Actor A generates a unique Correlation ID and includes it in the message sent to Actor B. When Actor B processes this message and sends a new message to Actor C, it copies the Correlation ID from the message it received and includes it in the message sent to C. This continues throughout the entire chain.

## Benefits

1. **Tracing and Debugging:** By searching logs or message queues for a specific Correlation ID, developers and operators can easily follow the exact path a request took, identify which actors processed it, and pinpoint where failures or delays occurred. This is particularly crucial in complex systems with many interconnected components.
2. **Request/Response Matching:** In the Pub/Sub request/response pattern, the Correlation ID allows the requester to match the incoming response to the specific request it sent, especially if multiple requests might be outstanding simultaneously. The requester includes a Correlation ID in its initial request, and the responder includes the same ID in the response.
3. **Auditing and Monitoring:** Correlation IDs provide a mechanism to audit the execution path of specific transactions for compliance or performance analysis.
4. **Context Propagation:** Beyond just tracing, Correlation IDs can help propagate context across service boundaries without requiring components to understand the full state of the transaction.

## Implementation

Implementing Correlation IDs is fairly simple and typically involves:

- Generating a unique ID (e.g., a `UUID`) when a new transaction starts.
- Adding a dedicated field (e.g., `correlation_id`) to message structures.
- Ensuring that any actor or component processing a message and initiating subsequent messages *copies* the Correlation ID from the incoming message to the outgoing message.
