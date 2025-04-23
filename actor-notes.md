# Actor Systems

Let's think of an "actor system" not just as a technology, but as a *model* for structuring software. It’s a paradigm shift away from traditional imperative or sequential programming, offering a fundamentally different way to design and build applications – one that excels in handling concurrency, complexity, and resilience.

Instead of viewing your application as a series of steps executed linearly, an actor system envisions it as a collection of independent, self-contained entities interacting through messages. Think of it like many small independent programs communicating with each other. Its primary benefits include:

- **Improved Extensibility**: Each actor can be developed, tested, and scaled independently, making it easier to integrate new features without affecting existing ones.
- **Enhanced Maintainability**: The clear separation of concerns and the straightforward message-passing interfaces within an actor system make the codebase easier to understand and maintain.
- **Enhanced simplicity**: Each actor operates as an independent unit, allowing you to focus solely on the messages it sends and receives, thereby simplifying the coding process.
- And of course **easier concurrent programming**: By breaking down applications into manageable, isolated components, actor systems simplify the implementation and management of concurrent operations.

By embracing this model, you can build more robust and adaptable software systems that are better equipped to handle complex operations and future growth.

**What is an Actor System? (The Architectural View)**

At its core, an actor system consists of:

- **Actors:** These are the fundamental building blocks. Think of them as lightweight, isolated computational units. Each actor has:
  - **State:**  Private data that only it can directly access and modify. This eliminates a huge source of concurrency problems (more on this later).
  - **Behavior:** A set of rules defining how it reacts to incoming messages. It's essentially the logic for processing those messages, potentially updating its state and sending new messages to other actors.
  - **Mailbox:**  A queue where incoming messages are stored. Actors process these messages one at a time (serially), ensuring order within their own context.
- **Messages:** The only way actors communicate with each other. They're simple data structures – no shared memory, no direct function calls. This is *crucial*.
- **The System:**  The environment that manages the actors, schedules them for execution, and handles message routing.

**Why Choose an Actor Model? Advantages Over Imperative/Sequential Approaches**

Traditional imperative programming often struggles with concurrency. You end up wrestling with locks, mutexes, semaphores – tools designed to *prevent* problems arising from shared mutable state.  These tools are complex, error-prone (deadlocks!), and can significantly hinder performance due to contention. The actor model sidesteps this entire problem class.

Here's how the actor model shines compared to sequential or even traditional concurrent programming:

- **Elimination of Shared Mutable State:** This is *the* key benefit. Because actors have private state and communicate only through messages, you completely avoid race conditions and deadlocks that plague shared-memory concurrency.  This dramatically simplifies reasoning about your code – you can understand the behavior of a single actor in isolation.
- **Natural Concurrency:** Many tasks we think of as sequential are actually inherently concurrent. Consider:
  - **CLI tooling**: Command-line interfaces (CLIs) typically operate on files. You can enhance even basic tools by modeling each file as an actor, thus incorporating concurrency seamlessly.
  - **Image Processing Pipeline:**  Different stages (loading, filtering, compression) can be represented as actors, each working independently on a portion of the image data.
  - **Game Logic:** AI agents, physics simulations, rendering – all could be handled by separate actors, allowing for parallel execution and responsiveness.
  - **Web Server Handling Requests:** Each request could be handled by an independent actor, allowing for parallel processing without complex threading management.
  - **Financial Trading System:** Order processing, risk management, market data analysis - each can be an actor reacting to events in real-time.
- **Resilience & Fault Tolerance:** Actors are designed to fail gracefully. If one actor crashes, it doesn't bring down the entire system.  Supervision strategies (built into many actor systems) allow parent actors to monitor their children and restart them if they fail, ensuring continued operation. This is incredibly difficult to achieve reliably in traditional architectures.
- **Modularity & Scalability:** Actors promote modularity – each actor encapsulates a specific responsibility. This makes code easier to understand, test, and maintain.  The inherent message-passing nature also lends itself well to scaling; actors can be distributed across multiple machines with relative ease.
- **Reactive Programming**: Actor systems embody reactive programming by inherently responding asynchronously to events without the need for polling.

**What Can You Do That’s Hard/Impossible Otherwise?**

The actor model enables patterns that are incredibly challenging or impractical in other paradigms:

- **Complex State Machines:**  Managing intricate state transitions becomes much cleaner when each state is represented by an actor, reacting to messages representing events. Imagine a complex workflow engine – each step could be an actor, simplifying the logic and making it easier to debug.
- **Decentralized Coordination:** In systems where you don't want a central authority dictating behavior (e.g., distributed sensor networks), actors can coordinate their actions through message passing without relying on a single point of failure or bottleneck.
- **Adaptive Systems:** Actors can dynamically adjust their behavior based on incoming messages and the state of other actors, creating systems that learn and adapt over time.  Think of an autonomous vehicle – each component (perception, planning, control) could be an actor reacting to sensor data and coordinating with others.
- **Workflows:** Actor systems excel at managing long-running workflows with by allowing actors to suspend their work temporarily and resume later, maintaining state and ensuring seamless execution over extended periods (even days).
- **Event Journals:** Actors can log actions and message exchanges to event journals, providing a comprehensive audit trail of system activities. This allows you to see exactly what the state of an actor was at any given moment in time.

## Maintaining & Evolving Actor Systems: Adding Functionality with Actors & Controlling Information Flow

The actor model shines when it comes to maintainability and architectural flexibility. The core principle – building systems from independent, message-passing actors – directly contributes to a more manageable and adaptable codebase.

**Adding Functionality: Just Add More Actors!**

In traditional architectures, adding new features often involves modifying existing codebases, potentially introducing regressions or unintended side effects. With the actor model, this process is significantly cleaner.  New functionality frequently translates into *adding new actors*.

Think of it like building with Lego bricks instead of sculpting a single block of clay. Want to add a new feature? Create an actor that encapsulates that feature's logic and connect it to existing actors via messages. This has several key benefits:

- **Isolation:** The new functionality is isolated within its own actor, minimizing the risk of impacting other parts of the system.  No need to fear widespread code changes or complex refactoring.
- **Clear Boundaries:** Actors clearly define boundaries of responsibility. Adding a feature means defining what that actor *does*, and how it interacts with others – leading to better-defined interfaces and reduced coupling.
- **Testability:** Individual actors are much easier to test in isolation, as you can focus solely on their behavior without needing to mock or simulate complex interactions.

**Example:** Imagine a shopping cart system. Initially, you have actors for `Cart`, `ProductCatalog`, and `PaymentProcessor`. Now, you want to add a "Recommendation Engine." Instead of modifying the existing actors, you create a new `RecommendationEngine` actor that receives messages about items in the cart and sends back recommendations. This keeps the core logic clean and focused. The shopping cart and related functionality still run just as before (including their performance characteristics), but now there is new functionality that can provide recommendations.

**Actors as Information Gatekeepers: Message Passing & The Function Call Analogy**

While message passing is fundamentally different from direct function calls, it's helpful to understand the conceptual similarity. In imperative programming, you have a function that takes arguments, performs some operation, and returns a value.  In an actor system:

- **The Actor:** Represents the "function" – encapsulating logic and state.
- **The Message:** Acts as both the argument *and* the trigger for execution. It tells the actor what to do.
- **The Response (Optional):** The actor's actions, potentially including sending new messages to other actors, can be considered a form of "response" – communicating results or initiating further processing.

However, the crucial difference is that message passing is *asynchronous* and *never* blocks.  The sender doesn’t wait for a direct return value; it continues its own work while the actor processes the message. This decoupling is key to concurrency and resilience. Actors control the flow of information by deciding which messages to process, when to send new messages, and how to update their internal state based on those messages. They act as gatekeepers, ensuring that data flows through the system in a controlled and predictable manner.

Importantly, the actor mainloop must process messages immediately. If there is a large amount of computation or wait time, then a background task or thread must be used. Messages in the mailbox should *not* be treated as a blocking queue, but instead should be taken from the mailbox immediately. The actor can then process the messages based on priority or necessity, which enables:

- **Sending Work to Another Actor**: Actors can delegate tasks to other actors by sending messages, distributing workloads efficiently and leveraging parallelism.
- **Suspending Work**: An actor may be told to temporarily suspend work. Maybe there is a problem with the input and verificatino is needed before proceeding, or maybe some resource limit was reached and we don't want exceed that limit.
- **Dropping Work**: In cases where resources are constrained or the message is no longer relevant, actors can drop messages without processing them, avoiding unnecessary computations and maintaining system performance.
- **Shutting Down**: Actors can gracefully shut down by handling specific control messages, ensuring that all messages are processed or dropped before termination to maintain data integrity.

This approach allows for a highly efficient and responsive actor system, where actors can adapt their behavior dynamically in response to varying workloads and system conditions.

## Actor System Fundamentals

### Actor

An actor is the core unit of computation in the actor model. It encapsulates state, behavior, and communication.

#### How it works

- Receives messages asynchronously via its mailbox
- On message receipt, an actor can:
  - Update its internal state
  - Send messages to other actors (including itself)
  - Spawn new child actors

#### Why it matters

- Safely encapsulates mutable state — state changes only via messages
- Handles messages serially — avoids race conditions without locks
- Scales easily — actors are independent and location-transparent

### Mailbox

A mailbox is a queue that stores incoming messages for an actor until it is ready to handle them.

#### How it works

- Messages are queued in the order they arrive (FIFO)
- The actor processes one message at a time from its mailbox

#### Why it matters

- Decouples message receipt from message processing
- Buffers incoming load, helping manage spikes in traffic
- Can be monitored to detect backpressure or overloaded actors

### Message Passing

Actors communicate exclusively through asynchronous message passing—this is the backbone of coordination in actor systems.

#### How it works

- Messages are sent to an actor’s reference or via a message bus
- No shared memory; actors interact only through messages
- Messages are typically immutable to avoid race conditions

#### Why it matters

- Enables loose coupling — if you can send a message, you can collaborate
- Supports concurrency — actors process their own mailbox in isolation
- Scales across threads or machines — messages are lightweight and location-transparent

### Hierarchies

Hierarchies define parent-child relationships between actors, forming a supervision tree.

#### How it works

- Parent actors can spawn child actors and supervise their behavior
- Failures propagate upwards, allowing parents to restart or stop children
- Parents are responsible for managing the lifecycle of their children (start/stop/restart)

#### Why it matters

- Enables fault tolerance — failures can be isolated and managed at the parent level
- Simplifies actor lifecycle management
- Organizes related behavior into a clean, hierarchical structure

### Supervision

Supervision is a fault-tolerance mechanism where parent actors monitor and control child actor behavior upon failure. This helps maintain system stability by handling failures in a structured manner.

#### How it works

- Parent actors (supervisors) monitor the health of their child actors
- When a child actor fails, the supervisor has several options for how to handle the failure:
  - **Restart** the child actor to recover from failure
  - **Resume** the child actor from the point of failure (if possible)
  - **Stop** the child actor entirely
  - **Escalate** the failure to its own supervisor or another part of the system
- Supervisors can choose actions based on the failure type and predefined strategies

#### Why it matters

- **Fault tolerance**

    Supervisors allow the system to handle failures without crashing entire components

- **Isolation**

    A supervisor keeps failing logic contained to smaller parts of the system (child actors), reducing system-wide impact

- **Resilience**

    They ensure the system can recover quickly and continue functioning even after partial failures

- Essential for building **robust and scalable systems** that can handle unpredictable failures gracefully

### Actor Reference / Address

An **Actor Reference** (or address) is a handle used to communicate with an actor. It provides **indirect access**, allowing you to send messages without direct access to the actor's internal state or behavior.

#### How it works

- **Unique identity**

    Each actor has a unique reference within the system. This reference acts as its public-facing identifier.

- **Message routing**

    When you send a message, you're not sending it "to the actor" directly, but to its reference. The actor system ensures the message is routed to the correct actor — even if it's on another thread or machine.

- **Immutable and shareable**

    References are safe to share and pass around. They don't expose state or behavior and can be handed off freely between actors, services, or external systems.

- **Abstracts location**

    Actor references are location-transparent — they look the same whether they point to a local actor or one running on a remote node. The system handles the communication details.

- **Lifespan awareness**

    Some actor systems provide reference lifecycle tracking. If an actor dies, sending a message to its reference may result in a dead letter, timeout, or error depending on the implementation.

#### Why it matters

- **Loose coupling**

    References decouple actors. You don’t need to know *what* an actor is or *where* it lives — just that you can send it a message.

- **Encapsulation**

    An actor reference doesn't let you access internal state. This keeps actors isolated and prevents accidental interference.

- **Scalability & distribution**

    Because references are location-transparent and safe to move across boundaries, systems can scale easily across threads, processes, or machines.

- **Flexibility in design**

    Actor references can be passed to child actors, logged, used as keys in routing systems, or injected into workflows. This makes system wiring dynamic and highly configurable.

## Messaging Concepts in Actor Systems

Messaging is the foundation of communication in actor-based architectures. Instead of invoking methods or sharing memory, actors interact solely by sending and receiving messages. These concepts enable concurrency, distribution, and fault isolation by decoupling components through asynchronous, message-driven design.

### Immutable Messages

Messages are typically immutable to ensure thread safety and correctness.

#### Why it matters

- Avoids side effects from concurrent access
- Encourages clear, functional message design
- Easier to debug and test

### Message Broker

A **Message broker** is an architectural component that enables communication between different actors or services by publishing and subscribing to messages over a shared channel or broker.

#### How it works

- **Shared channel**

    Actors and services send (publish) and receive (subscribe to) messages via a central bus or broker.

- **Topic or type-based routing**

    Messages are typically labeled with a topic, subject, or type. Subscribers express interest in specific patterns or categories.

- **Sender-receiver decoupling**

    Senders do not need to know who will receive the message. Receivers react to relevant messages based on filters or subscriptions.

- **One-to-many delivery**

    A single message can be delivered to multiple subscribers — useful for events like "user signed in".

- **Cross-system messaging**

    A message bus can be used to bridge multiple actor systems or services running in different environments.

#### Why it matters

- **Loose coupling and flexibility**

    Enables components to evolve independently. New subscribers can be added without changing the sender.

- **Promotes event-driven architecture**

    Helps build reactive systems where behavior is driven by incoming events or state changes.

- **Extensibility**

    Makes it easy to add new consumers (e.g., logging, monitoring, or metrics) without disrupting the main logic.

- **Observability and control**

    Bus-based systems can be monitored and traced more easily, since all messages flow through a central or managed path.

- **Scalability**

    Messages can be buffered, throttled, or routed intelligently to match system load and capacity.

#### Example topic patterns

Here is an example table of topic patterns and whether they will match a given topic. Note that the topic pattern syntax will vary between bus implementations.

- `*` — matches **zero or more** segments
- `?` — matches **one** segment
- Segments are typically separated by dots (`.`) or slashes (`/`)

| **Topic**               | **Pattern**           | **Matches?** | **Reason**                                 |
|-------------------------|------------------------|--------------|--------------------------------------------|
| `user.created.email`    | `user.?`               | ❌           | `?` matches only one segment, not two      |
| `user.created.email`    | `user.? .?`            | ✅           | `?` matches `created`, second `?` matches `email` |
| `user.created.email`    | `user.*`               | ✅           | `*` matches `created.email`                |
| `user.created.email`    | `*.email`              | ✅           | `*` matches `user.created`                 |
| `user.created.email`    | `?.created.email`      | ✅           | `?` matches `user`                         |
| `user.created.email`    | `?.?.?`                | ✅           | Each `?` matches one segment               |
| `user.created.email`    | `?.?.?.?`              | ❌           | Pattern expects 4 segments, topic has 3    |
| `order.123.status`      | `order.?.status`       | ✅           | `?` matches `123`                          |
| `order.123.status`      | `order.*.status`       | ✅           | `*` matches `123`                          |
| `order.123.status`      | `*.status`             | ✅           | `*` matches `order.123`                    |
| `order.123.status`      | `order.status`         | ❌           | Pattern has only 2 segments                |
| `auth.login.success`    | `auth.*`               | ✅           | `*` matches `login.success`                |
| `auth.login.success`    | `auth.?.success`       | ✅           | `?` matches `login`                        |
| `auth.login.success`    | `*.success`            | ✅           | `*` matches `auth.login`                   |
| `auth.login.success`    | `*`                    | ✅           | `*` matches any number of segments         |
| `auth.login.success`    | `?.?`                  | ❌           | Only matches 2 segments                    |

#### Topic subscriptions

To set up a communication channel where actors can make a "request" and receive a "response", follow these steps:

1. The "responder" actor subscribes to the broken with a topic pattern like `topic/query/my_thing`.

    This causes the broker to send all messages with this topic to the actor that responds to it. This can be a short-lived actor or long-lived actor (like a journal)

2. The "requesting" actor subscribes to a custom topic unique to itself and specifically for the desired message type.

    This ensures that they only receive messages destined for them.

3. The "requesting" actor sends out a message that the "responder" understands using the topic `topic/query/my_thing` with a `reply_to` topic of the unique one previously generated
This tells the broker that the message is destined for all subscribers of a particular topic. Since our "reponder" actor is receiving messages on the topic, the message gets routed to it.

4. The "responder" actor gets the messages, processes it, generates a response, and then sends it on the `reply_to` topic present in the original message

    The "responder" has no knowledge of the "requesting" actor. All they know is it's listening on the `reply_to` topic, so that's where they tell the broker to send it.

5. The "requesting" actor, since it's listening to its unique topic for a specific message type, gets the message from the broker

This system can be used with router to router communication. A router contains
many child actors and communicates directly with those actors. Whenever a child
actor needs to request data, it forward to the router and then the router
forwards to the broker. At no time is there any direct link between the router
and any other actors outside the domain. So the router has connections to
children and the message broker, but nothing else. This fully decouples all
actors across domains when putting a router in front of actor types.

### tell / send / cast

`tell` (also called `cast` or `send`) is the standard method for sending a message to another actor. It’s an **asynchronous**, **fire-and-forget** operation — the sender does not wait for a response.

#### How it works

- **One-way communication**

    The sender issues a message to the recipient’s `ActorRef` (address), with no expectation of a reply.

- **Non-blocking**

    After sending, the actor continues processing the next message in its mailbox without waiting.

- **Mailbox delivery**

    The message is enqueued in the recipient actor’s mailbox for later processing, in arrival order.

- **Fire-and-forget**

    The sender loses control over the message once it is sent — it cannot guarantee delivery or outcome.

#### Why it matters

- **Enables full concurrency**

    Because actors never block on responses, `tell` allows actors to scale and run in parallel without bottlenecks.

- **Encourages decoupled design**

    Since the sender doesn’t depend on the result, actors remain loosely coupled and easier to reason about independently.

- **Simplifies failure handling**

    If an actor crashes after receiving a message, the sender isn't directly affected. Supervision and error boundaries can handle recovery separately.

### ask (a.k.a. request-response)

`ask` is used when an actor expects a response. Unlike `tell`, the actor waits for a reply, usually in the form of a `Future`, `Promise`, or task.

**Note**: while using `ask` makes it easier to transition from sequential/imperative code, it is considered an anti-pattern. See the [problems](#problems-with-ask) subsection for details.

#### How it works

- **Initiates a request**

    The actor sends a message to another actor.

- **Waits for response**

    The sending actor *blocks* while waiting for a response.

#### Problems with ask

There are enough problems with `ask` to say that it shouldn't be used in an actor system. Almost all of these stem from the actor being unable to check it's mailbox while waiting for a response:

- Cannot gracefully shutdown (unable to receive a shutdown message)
- Not able to issue a "stop" or "cancel" message (unable to receive these messages)
- Memory leaks via actors that never complete because they wait indefinitely for a reply. There is no guarantee that messages arrive in an actor system.
- Cannot perform recovery or self-healing if more than 1 `ask` is in a single code block. This is because the state of the actor changes between the `ask` calls, but this state change exists only in the context of the code block (not the actor's state fields).

### Command vs Event (Separation of Intent and Fact)

**Command/Event Separation** is a principle that distinguishes between two message types:

- **Commands**

    Commands are *imperative*: they tell the system to do something. They are usually sent to a specific actor and expect a result or effect. Note that actors are *not required* to actually do anything nor respond to commands. Here are some examples:

    | Command                | Description                            |
    |------------------------|----------------------------------------|
    | CreateUser             | Request to create a new user           |
    | DeleteAccount          | Request to delete a user account       |
    | UpdateProfile          | Modify user profile information        |
    | ProcessPayment         | Initiate a payment transaction         |
    | PlaceOrder             | Submit an order for processing         |
    | AssignTask             | Assign a task to an actor              |
    | SendEmail              | Trigger an email to be sent            |
    | ScheduleReminder       | Schedule a reminder for future action |
    | ApproveRequest         | Approve a pending request              |
    | RetryJob               | Retry a failed background job          |

- **Events**

    Events are *declarative*: they describe something that has happened. Events are usually published on a message bus and may be observed by many subscribers. Here are some examples:

    | Event                  | Description                            |
    |------------------------|----------------------------------------|
    | UserCreated            | A new user has been successfully created |
    | AccountDeleted         | A user account has been removed        |
    | ProfileUpdated         | A user profile was updated             |
    | PaymentProcessed       | A payment was completed successfully   |
    | OrderPlaced            | An order was submitted                 |
    | TaskAssigned           | A task was assigned to someone         |
    | EmailSent              | An email was successfully delivered    |
    | ReminderTriggered      | A reminder has fired                   |
    | RequestApproved        | A request has been approved            |
    | JobRetried             | A job retry was initiated              |

### Correlation ID

A unique identifier attached to messages to trace their journey through an actor system. Helps trace request flows and debug the system. A correlation ID is generated when an *initial* message is created in response to something happening from *outside* the system.

For example, a user clicks the "submit" button on a form. A message is generated (like `SubmitClicked`) and given a correlation ID. All subsequent messages generated from the initial `SubmitClicked` message are given the same correlation ID. This allows debugging and tracing what happens in response to the initial `SubmitClicked` message. A trace would look similar to this:

```text
SubmitClicked
  -> FormValidated
    -> SaveForm
      -> FormSaved
        -> SubmissionAccepted
```

Since all those messages have the same correlation ID, monitoring tools are able to "link" together a sequence of events/messages.

#### TODO: edit

In essence, think of correlation IDs as providing a "thread" to follow a specific request or task as it moves through different parts of your system. For a long-lived manager like your coordinator, the "threads" of interest are the individual jobs it orchestrates, not the coordinator's own continuous existence.

Analogy:

Think of a factory. The factory itself (your coordinator) has a long lifespan. Individual products (your jobs) go through the assembly line within the factory. Each product has a unique serial number (your correlation ID) that allows you to track its progress through different stages of production. The factory's creation doesn't get the same serial number as each individual product it produces.

Rule of Thumb:

- Expect a Result/Tracked Workflow: When you issue an intent and are expecting a response or need to track the progression of a workflow triggered by that intent, include a Correlation ID. This ID allows you to link the initial intent with subsequent messages, events, and the final outcome.

- "Fire and Forget" Intents: When you issue an intent for something you just want to happen without needing a direct response or detailed tracking of its consequences, you can omit the Correlation ID.

## Event-Driven Architecture

Event-driven architecture (EDA) is a design paradigm where system components communicate by emitting and reacting to events. Instead of direct calls or tightly coupled workflows, actors publish events when something happens (e.g., `UserRegistered`), and others subscribe to act upon them. This decouples producers and consumers, enabling flexible, scalable, and reactive systems that are easier to extend and evolve over time.

How it works:

- Actors emit **events** when something meaningful happens (e.g., `OrderPlaced`)
- Other actors **subscribe to events** and react accordingly
- Events are immutable facts that describe something that has occurred

### Subscriber

An actor which has subscribed to receiving messages from another actor.

- Actors that support subscriptions will track subscribers so they can send events to them
- Can be implemented universally through a message bus

## Actor Patterns

### Router

Distributes incoming messages across a pool of actors using a strategy (e.g., round-robin, consistent hash, random).

#### When to use it

- Load balancing between workers
- Parallel processing of independent tasks
- Scaling services horizontally

### Pool

A group of interchangeable actors performing the same task. Used to process many similar tasks in parallel.

#### When to use it

- A pool of image resizers or thumbnail generators
- Handling many user requests concurrently
- Managing concurrent database queries

### Circuit Breaker

Protects the system from repeated failures when calling unreliable services. After a threshold of failures, it stops sending requests for a cooldown period.

#### When to use it

- Handling flaky external APIs
- Preventing cascading failures in a distributed system
- Avoiding retries that would worsen overload

### Dead Letter Monitor

Catches messages that couldn't be delivered (e.g., recipient no longer exists). Useful for debugging or system health tracking.

#### When to use it

- Logging undeliverable messages
- Detecting actor lifecycle issues
- Monitoring system integrity

### Saga / Routing Slip

A pattern for handling distributed transactions without a centralized controller. Each task in the Saga has a "compensation" action to undo its effects if needed.

#### When to use it

- Coordinating multi-service workflows like booking flights, hotels, and cars
- Performing long-running, rollback-safe operations
- E-commerce checkout processes involving multiple services

#### Key points

- Routing slip: contains the list of steps (as a queue) and completed steps (as a stack).
- Each actor completes its task and forwards the slip.
- On failure, the slip is sent back through the stack to execute compensations.
- Compensation aims for logical recovery, not perfect reversal.
- Can be monitored via a dedicated FSM, but flow is driven by the slip.

### Gatekeeper

Allows processing only when a set of conditions has been met.

#### When to use it

- Waiting for user to finish 2FA and accept TOS
- Enabling operations only when dependent systems are healthy
- Preventing early execution in workflows

#### Key Points

- Tracks multiple preconditions
- Holds or rejects messages until ready
- Can enforce business constraints dynamically

### Waiting Room

Buffers or caches partial data until all required information is available.

#### When to use it

- Holding cart items until checkout
- Waiting for multiple pieces of a user request (e.g., summary and sentiment)
- Staging area for incomplete data

#### Key Points

- Can expire stale data
- Useful for asynchronous data arrival
- Prevents premature processing

### FSM (Finite State Machine)

Models logic as transitions between well-defined states.

#### When to use it

- Representing a job lifecycle: Idle → Running → Complete
- Modeling user session flows
- Handling complex protocol sequences

#### Key Points

- Each state handles a specific subset of messages
- Easy to debug and reason about
- Pattern matching often used for implementation

### Event Collector / Event Aggregator

Collects partial data from multiple sources and emits a single aggregated message.

#### When to use it

- Merging logs/events across microservices
- Collecting metrics from distributed components
- Reconstructing workflows from fragments

#### Key Points

- Handles fragmented input
- Emits only when criteria are met
- Useful for cross-service observability

### Temporal Trigger / Expiry Actor

Performs an action if a condition isn't met in time.

#### When to use it

- Canceling unpaid orders after 15 minutes
- Retrying operations on timeout
- Dropping incomplete messages

#### Key Points

- Starts a timer on first input
- May retry, abort, or escalate on expiry
- Prevents indefinite waits in systems

### Workflow Coordinator

Coordinates steps in a workflow without doing the work itself. Keeps enough state to decide what should happen next.

#### When to use it

- Managing state machines across services
- Tracking progress of complex tasks
- Spawning and monitoring task workers

#### Key Points

- Owns orchestration logic, not business logic
- Journals non-derivable state to prevent desync
- Differs from Saga: no compensation needed

#### Deep Dive: Workflow Coordinators - The Orchestrators of Complex Processes

In distributed systems, complex tasks often require multiple services or components to collaborate in a specific sequence. A **Workflow Coordinator** acts as the central nervous system for these processes, orchestrating steps without actually performing the work itself. It's responsible for maintaining context and deciding what should happen next based on the current state of the workflow.

##### What Does a Workflow Coordinator Do?

- **Orchestration, Not Execution**

    The coordinator's primary role is to *direct* the flow – it doesn't execute the individual tasks themselves. It delegates those responsibilities to specialized "task workers" or services.

- **State Management**

    A workflow coordinator maintains a record of the workflow's progress. This state includes both derived information (calculated from other data) and, crucially, *journaled* state (explained below).

- **Decision Making**

    Based on the current state, the coordinator determines the next action to take – whether it's invoking another task worker, waiting for a response, or handling an error.

- **Task Worker Management**

    The coordinator is often responsible for spawning and monitoring task workers. This includes tracking their status (running, completed, failed) and potentially retrying tasks if they fail.

##### When and Why Use Workflow Coordinators?

- **Managing State Machines Across Services**

    This is the most common scenario. Workflows often represent complex state machines that span multiple services, each responsible for a specific part of the overall process.

- **Tracking Progress of Complex Tasks**

    When a task involves numerous sub-steps or dependencies, a coordinator provides visibility and control over its progress.

- **Spawning and Monitoring Task Workers**

    The coordinator can handle the lifecycle management of task workers, ensuring that they are available when needed and handling failures gracefully.

- **Long-Running Processes**

    Workflows often involve long-running processes that need to be resilient to interruptions or service outages. Coordinators provide a mechanism for resuming workflows from where they left off.

- **Auditing & Debugging**

    The coordinator's state provides a valuable audit trail, making it easier to track down issues and understand the flow of execution.

##### Implementation Details

```rust
struct WorkflowCoordinator {
    expected_steps: Vec<String>,
    completed_steps: Vec<String>,
    is_done: bool,
}

impl WorkflowCoordinator {
    fn handle_message<F>(&mut self, msg: CoordinatorMsg)
    where
        F: FnMut(WorkerMsg),
    {
        match msg {
            CoordinatorMsg::StartWorkflow => {
                // Send work for all expected steps
                for step in &self.expected_steps {
                    // emit worker message on bus
                }
            }

            CoordinatorMsg::StepCompleted(name) => {
                // Track completed steps
                if !self.completed_steps.contains(&name) {
                    self.completed_steps.push(name);
                    self.check_if_done();
                }
            }

            CoordinatorMsg::StepFailed(name) => {
                // If a step fails, mark it and stop workflow
                self.is_done = false;
                println!("❌ Step failed: {}", name);
            }

            CoordinatorMsg::CheckStatus => {
                // Output current status
                println!(
                    "Completed: {:?}, Done: {}",
                    self.completed_steps, self.is_done
                );
            }

            CoordinatorMsg::Reset => {
                // Reset the workflow
                self.completed_steps.clear();
                self.is_done = false;
                println!("🔄 Workflow reset.");
            }
        }
    }

    fn check_if_done(&mut self) {
        // Check if all expected steps are completed
        self.is_done = self
            .expected_steps
            .iter()
            .all(|step| self.completed_steps.contains(step));

        if self.is_done {
            println!("🎉 Workflow is DONE!");
        }
    }
}
```

##### How Workflow Coordinators Differ From Sagas

- **Sagas**

    Sagas are used to manage distributed transactions where each step involves updating data in different services. If one step fails, the saga executes *compensating transactions* to undo the changes made by previous steps, ensuring eventual consistency.

- **Workflow Coordinators**

    Workflows often involve processes that don't require strict transactional guarantees. While error handling is important, compensating transactions are typically not necessary. The coordinator focuses on orchestrating the flow and managing state, but doesn’t actively rollback operations.

### Supervisor

Manages the lifecycle of child actors. Applies fault tolerance strategies like restart, resume, or escalate.

#### When to use it

- Restarting crashed actors
- Isolating failures to a subtree
- Managing actor hierarchies

#### Key Points

- Core to actor fault-tolerance model
- Supervision strategy defines recovery behavior
- Can be customized per child
- Used strictly for *failure of an actor*, NOT an error in business rules
  - An actor crashing is a failure. A user providing bad input is not

#### Deep Dive: Actor Supervisors - The Guardians of Your System

At its core, a supervisor’s primary responsibility is to react to failures within its hierarchy of child actors.

- **Lifecycle Management**

    A supervisor creates, starts, stops, and potentially restarts child actors.  It maintains a knowledge of which actors are under its control.

- **Failure Detection**

    Supervisors receive `DeathWatchNotifications` (or similar mechanisms depending on the actor system implementation) when a child actor terminates unexpectedly – meaning it crashes or throws an unhandled exception. This notification *doesn't* include the error itself initially; just that the actor is gone. The supervisor then needs to decide how to respond.

- **Supervision Strategies**

  The heart of fault tolerance lies in the **supervision strategy**. This defines *how* the supervisor reacts to a child’s failure. Common strategies include:

  - **`Restart`:** The supervisor restarts the failed actor.  This is often combined with a retry delay to avoid rapid restart loops (see "Backoff Strategies" below).
  - **`Resume`:** The supervisor ignores the failure and allows the actor to remain stopped. This might be appropriate if the error was transient or if restarting would cause further problems.
  - **`Stop`:**  The supervisor stops the failed actor permanently, effectively removing it from the system.  This is useful for actors whose failures are irrecoverable or represent a critical system state corruption.
  - **`Escalate`:** The supervisor forwards the failure notification to its parent supervisor. This allows higher-level supervisors to handle the error, potentially triggering broader system recovery actions.

##### When and Why Use Supervisors?

- **Restarting Crashed Actors**

    This is the most common scenario. It allows your application to recover from transient errors without manual intervention.

- **Isolating Failures (Fault Containment)**

    A supervisor can prevent a failure in one child actor from cascading and bringing down the entire system. By restarting or stopping a failing child, you limit the scope of the problem. This is *critical* for maintaining overall system stability.

- **Managing Actor Hierarchies**

    Supervisors naturally enforce structure within your actor system. They provide a clear lineage and responsibility model.  This makes debugging and reasoning about complex systems much easier.

- **Resource Management**

    While not their primary function, supervisors can be used to limit the number of child actors created, preventing resource exhaustion (e.g., too many database connections).

##### Backoff Strategies

Simply restarting an actor repeatedly after a failure can lead to a "restart loop," where the actor keeps crashing and being restarted, consuming resources and potentially exacerbating the problem.  To prevent this, **backoff strategies** are essential. These strategies introduce increasing delays between restart attempts:

- **Exponential Backoff:** The delay increases exponentially (e.g., 1 second, 2 seconds, 4 seconds, 8 seconds...).
- **Fixed Delay:** A constant delay is used between restarts.  Less common than exponential backoff.

##### What Supervisors *Aren't* For: Business Logic Errors

**Supervisors are not for handling errors in business logic.**  If an actor crashes because of invalid user input or a flawed calculation, that's *not* a failure to be handled by the supervisor. It's a bug in the actor's code that needs to be fixed. The supervisor is only concerned with *unexpected* failures – those that indicate a problem outside the actor’s control (e.g., resource exhaustion, network issues). Trying to use supervisors for business logic errors will lead to incorrect behavior and mask underlying problems.

### Journal

A durable store for an actor’s persistent state, especially useful in event-sourced systems.

#### When to use it

- Long-lived actors with important state (self-healing)
- Event sourcing
- Crash recovery

#### Key Points

- Stores only **non-derivable state** of an actor
  - You want a *single source of truth* and avoid duplication
- Storing derivable state can desynchronize the actor from the rest of the system
  - Query any derivable state from other actors instead
- Journal implementations are **actor-specific**, not generic
  - Example: `JournalFoo` can be used with `ActorFoo1` and `ActorFoo2`, but not with `ActorBar`

#### Deep Dive

The **Journal** plays a foundational role in actor-based systems that care about **durability, consistency, and recovery** — especially in event-sourced or distributed setups.

At its core, the journal captures the *intent* of an actor’s behavior — its decisions, commands, or events — rather than raw mutable state. This makes recovery deterministic: given the same inputs (journaled events), the actor can always reconstruct its internal state.

##### Journals vs. Snapshots

Journals typically log **incremental changes** or events. Over time, a system might use **snapshots** to capture the full actor state at a point in time to speed up recovery. Think of journals as the transaction history, and snapshots as the account balance.

##### Recovery Workflow

When an actor restarts (crash, migration, etc.), it can:

1. Load the latest snapshot (if available)
2. Replay journaled events from that point forward
This ensures the actor ends up in a valid, up-to-date state, without requiring external coordination.

##### Journals in Practice

- Journals may be backed by databases, file systems, or log systems like Apache Kafka.
- Choosing the right backend depends on performance, consistency, and durability guarantees.
- Actor systems often allow pluggable journal backends to adapt to infrastructure needs.

##### Actor Isolation

Because journals are actor-specific, they reinforce the **encapsulation** principle: no other actor should interpret or rely on another actor’s journal format. This ensures the internal logic remains self-contained and resilient to changes elsewhere in the system.

##### Design Tip

When designing a journaled actor, focus on the **events that matter long-term**, not the transient details. Ask:

- "If this actor died and came back, what does it *need* to know to behave the same?"
- "Can this be derived from other actors or queried externally instead?"

### Event Bus

Broadcasts messages to interested actors without direct coupling.

#### When to use it

- Publish-subscribe patterns
- Emitting domain events
- Triggering workflows in response to changes

#### Key Points

- Decouples producers from consumers
- Can be local or distributed
- Helps with observability and extensibility

#### Deep Dive

An **Event Bus** is a central pattern for **decoupled communication** in actor systems. Rather than sending messages directly to specific actors, a producer emits events to the bus and any subscribed actors receive them automatically. This promotes a reactive, extensible architecture without tight coupling between components.

##### Core Use Cases

- **Domain Events**

    Represent state changes or significant actions (`OrderPlaced`, `UserLoggedIn`) that other actors might care about.

- **Workflow Triggers**

    The event bus enables workflow triggers which can chain actions across subsystems. Here is an example that handles a "welcome new user" workflow:
    1. emit a `UserRegistered` *event* when a user registers
    2. an actor listening to `UserRegistered` emits a `SendWelcomeEmail` *command*
    3. an actor listening to `SendWelcomeEmail` emits a `WelcomeEmailSent` *event*

- **System Observability**

    Analytics, auditing, or monitoring actors can listen in without impacting business logic.

##### Decoupling Benefits

- **Producers don’t need to know who’s listening**, or even if anyone is.
- Subscribers can evolve independently — added, removed, or swapped out.
- Enables **asynchronous, many-to-many communication**.

##### Local vs Distributed Buses

- A **local event bus** stays within a single actor system or process. It's fast and simple, but limited in scope.
- A **distributed event bus** (e.g., built on top of Kafka, NATS, or Redis Streams) supports horizontal scalability and cross-node communication but adds complexity around delivery guarantees, serialization, and ordering.

##### Delivery Semantics

Delivery guarantees vary depending on implementation:

- **At most once** (default in many systems): fire-and-forget, no retries
- **At least once**: retries possible, may need deduplication
- **Exactly once**: hard to achieve, usually overkill unless strongly required

##### Design Considerations

###### Avoid overusing the event bus for things that should be modeled as direct messages

The event bus is best suited for **inter-subsystem messaging**. **Supervisors or routers** should communicate directly with their child actors, and optionally emit or forward relevant messages to the bus.

For example, consider a `WorkerPool` actor responsible for maintaining five active workers. The individual workers **should not** publish to or listen on the bus directly. Instead:

- The `WorkerPool` subscribes to the bus and forwards relevant messages to its workers.
- If workers produce responses or events that need to be public, the `WorkerPool` can choose to emit them.

This structure gives the `WorkerPool` full control over **how work is distributed**, and how **responses are handled or transformed** before leaving the subsystem.

If you allow workers to interact with the event bus directly, you lose that layer of control, which makes the system harder to reason about, debug, or evolve over time.

###### Event Storms & Fan-Out Overloads

One of the hidden dangers of using an event bus is the tendency for **event fan-out** to grow uncontrollably - especially in systems where it’s easy to subscribe to events. You may start with a single producer and a couple of consumers, but over time, as more features or services are added, that single event may be triggering **dozens of reactions** across the system. This can lead to:

- **Performance issues**: Each event causes a cascade of work, potentially overwhelming the system.
- **Unpredictable side effects**: A seemingly harmless event triggers behavior you didn't expect, in parts of the system you forgot were listening.
- **Tight temporal coupling**: Even though producers and consumers are decoupled *logically*, the system becomes **sensitive to timing**, ordering, or volume of events.

**Mitigation strategies**:

- Use **dedicated event types** instead of reusing generic ones.
- **Audit and document** subscriptions so you know who listens to what.
- Limit the scope of high-frequency events, or debounce/throttle them.
- Consider introducing **intermediary actors** that batch, filter, or gate event propagation.

###### Prefer Semantic, Intent-Based Events

Good events are **meaningful**, not just **mechanical**.

For example, an event like `db.table.changed` tells you that *something* happened at the database layer but it doesn't convey *why* it happened or what the domain-level significance is. It forces consumers to reverse-engineer intent from implementation details.

In contrast, an event like `UserProfileUpdated` or `PaymentMethodRemoved` expresses **intent** and what action was taken from the perspective of the business logic.

**Why it matters**:

- Semantic events are **easier to understand, reuse, and evolve** over time.
- Intent-based naming decouples the event system from internal implementation (like schema changes or storage mechanics).
- Downstream actors can react in **higher-level, more meaningful ways**, instead of trying to infer purpose from low-level triggers.

**Tip**: When naming an event, ask yourself:

> “Would someone unfamiliar with the internals of this system understand what this event means — and when it should happen?”

If not, it might be too technical or leaky.

### Actor Registry

A system for tracking and looking up active actors by name or ID.

#### When to use it

- Sending messages to a specific actor
- Discovering service actors dynamically
- Routing based on user/session ID

#### Key Points

- Can be centralized or distributed
- Useful for sharded systems
- Often needed with persistent actors

## Advanced Topics / Techniques

### Startup Hydration

Startup hydration is the process of initializing an actor system with pre-existing state during startup, rather than starting all actors from a clean slate. This allows for persistence, recovery from failures, and faster initial responsiveness by avoiding repeated computation or data loading. It's particularly valuable in systems requiring complex initialization or dealing with large datasets.

Hydration can come from querying a journal and applying the returned state, or through multiple queries of various actors. How hydration occurs will be up to you and the requirements of the system.

#### When to use it

- **Persistence is Required**

    The system needs to remember state across restarts (e.g., game servers, financial trading platforms).

- **Slow Initialization**

    Actors require significant time to initialize (e.g., loading models, connecting to external services). Hydration avoids this repeated overhead.

- **Fast Startup Time is Critical**

    Users expect the system to be responsive immediately upon startup. Starting from a known state improves perceived performance.

- **Complex Dependencies**

    Actors have dependencies that are expensive or time-consuming to establish during initial creation.

- **Data Migration/Upgrade**

    You need to migrate data between versions of your application without losing existing state.

#### Key points

- **Serialization is helpful**

    The actor's state should be serializable so it can be saved and restored. This often involves careful consideration of which fields to include and how they are represented. If the state is *not* serializable then the state of the actor needs to be derived from other data sources in the system (like queries to other actors).

- **Snapshotting vs. Event Sourcing**

    Hydration can leverage snapshotting (periodic saves of the entire state) or event sourcing (replaying a sequence of events). Each approach has trade-offs.

- **Idempotency is Important**

    Hydration processes should be idempotent – meaning they can be safely replayed without unintended side effects, especially during recovery scenarios.

- **Actor Lifecycle Management**

    Hydration needs to integrate seamlessly with the actor system's lifecycle management (e.g., startup hooks, shutdown procedures).

- **Potential for Complexity**

    Implementing hydration adds complexity to your application and requires careful testing and monitoring.

#### Deep dive

**Understanding the Problem & Approaches**

Without hydration, an actor system on restart would re-initialize *all* actors from scratch. This can be incredibly slow and wasteful if those actors hold significant state (e.g., a game server's world state, a financial trading platform’s order book).  Hydration aims to avoid this.

There are two primary approaches:

1. **Snapshotting:**
   - *How it works:*
       Periodically save the entire state of an actor (or a subset of actors) to persistent storage. On startup, load these snapshots and resume from that point.
   - *Pros:*
     - Relatively simple to implement initially.
     - Provides a good balance between recovery time and storage space.
   - *Cons:*
     - Can be resource intensive if actors have large states.
     - Snapshotting frequency needs careful tuning – too frequent leads to high overhead; too infrequent results in significant data loss on failure.
     - Snapshotting can block the actor during the save operation, impacting responsiveness.

2. **Event Sourcing:**
   - *How it works:*
       Instead of saving state directly, store a sequence of events that led to the current state. On startup, replay these events from the beginning (or from a specific point) to reconstruct the actor's state.
   - *Pros:*
     - Provides an audit trail of all changes.
     - Allows for more flexible recovery options (e.g., replaying events up to a different point in time).
     - Can be easier to reason about and debug.
   - *Cons:*
     - More complex to implement than snapshotting.
     - Requires careful design of event schemas.
     - Replaying events can be slow if the event stream is very large.

##### Example (Multi-component hydration)

Here we have an actor that needs to hydrate/restore it's state for three different items:

- journal
- metadata
- config

This means that it needs to (potentially) send out three messages to different actors in order to retrieve the data. While waiting for responses, the actor remains in a `Hydrating` state until the hydration completes. Any messages that are *not* used for hydration get stashed locally so they can be replayed once hydration finishes.

(Note that this code is framework-agnostic and is for illustrative purposes to show the lifecycle of hydration)

```rust
/// Structure dedicated to hydrating the actor. All this needs to get loaded from other actors.
struct Hydration {
    journal: Option<Vec<Event>>,
    metadata: Option<Metadata>,
    config: Option<Config>,
}

impl Hydration {
    // Checks if all components (journal, metadata, config) are present in the hydration state.
    fn is_complete(&self) -> bool {
        self.journal.is_some() &&
        self.metadata.is_some() &&
        self.config.is_some()
    }

    // Transforms a Hydration struct (containing optional data) into a ReadyState struct (containing concrete data).
    fn into_ready(self) -> ReadyState {
        ReadyState {
            events: self.journal.unwrap(),
            metadata: self.metadata.unwrap(),
            config: self.config.unwrap(),
        }
    }
}

/// State of actor when its ready/running
struct ReadyState {
    events: Vec<Event>, // Vector of events, now fully loaded.
    metadata: Metadata, // Fully loaded metadata.
    config: Config,     // Fully loaded configuration.
}

/// The current state of the actor
enum ActorState {
    Hydrating(Hydration),
    Ready(ReadyState),
}

struct Actor {
    id: Uuid,
    state: ActorState,

    // A queue for messages received while hydrating. You will probably need
    // one of these for each type of message the actor handles.
    stash: Vec<Message>,
}

/// Messages that this actor handles. In a real implementation, these would likely be distinct types.
enum Message {
    // Hydration responses - signals that a piece of hydration data has been loaded.
    JournalLoaded(Vec<Event>),
    MetadataLoaded(Metadata),
    ConfigLoaded(Config),

    // "Real" messages - messages to be processed once the actor is in the Ready state.
    DoThing(String),
    QueryStatus,
    // ... etc
}

impl Actor {
    fn on_start(&mut self) {
      // send out messages to journals, queries, etc using self.id
    }

    fn handle_message(&mut self, msg: Message) {
        match &mut self.state {
            ActorState::Hydrating(hydration) => match msg {
                Message::JournalLoaded(events) => {
                    // Updates the hydration state with loaded journal events.
                    hydration.journal = Some(events);
                }
                Message::MetadataLoaded(data) => {
                    // Updates the hydration state with loaded metadata.
                    hydration.metadata = Some(data);
                }
                Message::ConfigLoaded(cfg) => {
                    // Updates the hydration state with loaded configuration.
                    hydration.config = Some(cfg);
                }
                // Non-hydration messages get stashed - store for later processing when ready.
                other => {
                    self.stash.push(other);
                    return;
                }
            },
            ActorState::Ready(ready) => {
                // Handles messages in the Ready state using a separate handler function.
                self.handle_message(ready, msg);
                return;
            }
        }

        // When handling a hydration message, check if we're done hydrating.
        if let ActorState::Hydrating(hydration) = &self.state {
            if hydration.is_complete() {
                // Transforms the Hydration state to ReadyState.  Cloning is used here for simplicity; std::mem::take could be more efficient.
                let ready_state = hydration.clone().into_ready();
                self.state = ActorState::Ready(ready_state);

                // Unstash all messages that were received while hydrating and process them now.
                let stashed = std::mem::take(&mut self.stash);
                for msg in stashed {
                    self.handle_message(msg);
                }
            }
        }
    }

    // Handles messages when the actor is in the Ready state.
    fn handle_message(&mut self, ready: &mut ReadyState, msg: Message) {
        match msg {
            Message::DoThing(task) => {
                // Processes a "DoThing" message using the loaded data from the ReadyState.
            }
            Message::QueryStatus => {
                // Responds to a "QueryStatus" message, potentially returning metadata.
            }
            _ => {
                // Handles unexpected messages (ignore or log).
            }
        }
    }
}
```

### Recovery with Hydration

Recovery with Hydration is a technique for restoring the state of critical services after failure, minimizing downtime and ensuring business continuity. It involves periodically capturing and persisting the service's current state, allowing it to be quickly reconstructed upon restart. While offering significant benefits in terms of recovery speed and reliability, successful implementation requires careful consideration of snapshot frequency, data consistency, schema evolution, and thorough testing.

#### When to use it

- **Long-Running Processes**

    Services that maintain significant in-memory state, such as caching layers, real-time data processing pipelines, or game servers, greatly benefit from hydration.

- **Critical Business Functions**

    For services where downtime is unacceptable or even a short interruption can have severe consequences (e.g., financial trading platforms), hydration provides a crucial safety net.

- **Complex State Management**

    When the service’s state is difficult to reconstruct through other means (e.g., relying solely on database transactions), hydration offers a more reliable solution.

- **Disaster Recovery**

    Hydration can be an integral part of a disaster recovery plan, allowing services to quickly resume operation in a secondary location after a major outage.

#### Deep Dive: Recovery with Hydration - Rebuilding State from a Snapshot

In highly available and resilient distributed systems, the ability to recover quickly from failures is paramount. **Recovery with Hydration** is a powerful technique that allows a service or component to rebuild its state from a previously saved snapshot (the "hydration" process) after an unexpected outage or catastrophic failure. It's more than just restarting; it’s about restoring functionality as close as possible to the point of interruption.

##### What Does Recovery with Hydration Do?

The core idea is that periodically, a service captures its current state and persists it to durable storage (e.g., database, object store). When the service fails and restarts, instead of starting from an empty or incomplete state, it loads this persisted snapshot and "hydrates" itself – reconstructing its internal data structures and dependencies based on the saved information.

- **State Persistence**

    The foundation is a robust mechanism for periodically capturing and storing the service's state. This can involve snapshots of in-memory caches, database backups, or even message queue positions.

- **Hydration Process**

    The process of loading the persisted state and reconstructing the service’s internal representation. This often involves deserialization, data transformation, and re-establishment of connections to external dependencies.

- **Fast Recovery**

    The primary benefit is significantly reduced recovery time compared to starting from scratch or relying solely on eventual consistency mechanisms.

##### Hydration vs. Point-in-Time Recovery (PITR)

While both aim to restore state, they differ in granularity:

- **Hydration**

    Typically involves periodic snapshots of the entire service's state. It’s a coarser-grained approach.

- **Point-in-Time Recovery (PITR)**

    Often associated with databases, PITR allows restoring data to any specific point in time based on transaction logs. This provides finer-grained recovery but can be more complex to implement and manage.

##### Challenges & Considerations

- **Snapshot Size**

    Large snapshots can impact performance during the snapshotting process and increase storage costs.

- **Consistency During Snapshotting**

    Ensuring data consistency while taking a snapshot is crucial. Techniques like copy-on-write or quiescing the service briefly might be necessary.

- **Schema Evolution**

    As the service’s data structures evolve, the hydration process must handle different versions of the persisted state gracefully (e.g., through schema migrations).

- **Idempotency**

    The hydration process should ideally be idempotent – running it multiple times shouldn't have unintended side effects.

- **Testing Hydration**

    Thoroughly testing the hydration process under various failure scenarios is essential to ensure its reliability.

##### Relationship to Similar Concepts

- **Checkpointing**

    A broader term that encompasses techniques for periodically saving state, including hydration.

- **Stateful Services**

    Recovery with hydration is a key consideration for designing and operating stateful services.

- **Resilience Patterns**

    Hydration aligns with resilience patterns like "Retry," "Circuit Breaker," and "Bulkhead" by providing a mechanism to recover from failures and maintain service availability.

## Random notes

```
1. UUIDv7 store in state
2. send with msg to worker
3. check UUID on return receipt
4. if UUID < current, then ignore the message because this is an indication that we sent out another worker message for some reason, and that the message we just received is from an old request. Possible examples: user smashing a submit button withou any debouncing -> a bunch of messages sent out -> we only want the most recent one.
```
