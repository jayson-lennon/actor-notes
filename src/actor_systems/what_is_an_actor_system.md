# What is an Actor System?

At its core, an actor system consists of:

- **Actors:** These are the fundamental building blocks. Think of them as lightweight, isolated computational units. Each actor has:
  - **State:**  Private data that only it can directly access and modify. This eliminates a huge source of concurrency problems (more on this later).
  - **Behavior:** A set of rules defining how it reacts to incoming messages. It's essentially the logic for processing those messages, potentially updating its state and sending new messages to other actors.
  - **Mailbox:**  A queue where incoming messages are stored. Actors process these messages one at a time (serially), ensuring order within their own context.
- **Messages:** The only way actors communicate with each other. They're simple data structures – no shared memory, no direct function calls. This is *crucial*.
- **The System:**  The environment that manages the actors, schedules them for execution, and handles message routing.
