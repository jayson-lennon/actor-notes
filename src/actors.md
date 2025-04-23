# Actors in Actor Systems

**Actors** are the primary components of actor systems, acting as isolated, lightweight computational units designed to handle messaging and state management without direct interference.

## Key Components of an Actor

- **State:**
  Each actor maintains its own private data that only it can access and modify. This isolation prevents concurrent modifications and eliminates common concurrency issues.
- **Behavior:**
  Actors define behavior as a set of rules for processing incoming messages. This behavior includes updating the actor's state and sending messages to other actors.
- **Mailbox:**
  Actors have a mailbox, which is a queue where all incoming messages are stored. The actor processes these messages one at a time, ensuring that message processing adheres to a specific order.

## Benefits

- **Isolation:** Actors do not share state directly, preventing concurrency conflicts.
- **Concurrency Simplification:** Serial processing of messages within each actor avoids synchronization issues.
- **Modularity:** Actors are independent units that can be tested and scaled separately.

## Actor Processing

Below is a high-level overview of the steps taken by an actor:

1. **Receive message via mailbox**  

   Message receipt is asynchronous. The actor system will typically get the next message from the queue and hand it off to the actor for processing. The actor never enters a loop to get messages and instead has a handler that is called when a message is sent to it for processing.

2. **Update its internal state**

   Upon receiving a message, an actor _may_ modify its internal state based on the content and purpose of the message. This state update enables actors to maintain and alter their internal configurations or variables as required by their behavior logic.

3. **Send messages to other actors (including itself)**

   An actor has the capability to send messages to other actors within the same system. This includes having the ability to send messages to itself, which can be useful for tasks that require iterative processing or callbacks.

4. **Spawn new child actors**

   In addition to sending and receiving messages, an actor can also create new child actors. This feature supports hierarchical structures in actor systems, enabling parent-child relationships where actors manage their own lifecycle and interactions with other members of the system.

5. **End message processing**

   After any state updates and message sends, the actor returns from it's handler function thereby handing off control back to the actor system.

All functionality of a program can be modeled by putting small state changes in actors and using messages to communicate. Note how in the above steps there are no accesses to other actor states and no waiting for messages from other actors. All an actor does is run a handler function upon message receipt, perform it's processing, and then stop.
