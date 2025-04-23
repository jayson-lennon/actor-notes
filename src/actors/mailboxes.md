# Mailboxes

An actor mailbox, or message queue, serves as a central storage unit specifically designed to hold messages directed at a particular actor instance in concurrent programming systems. This mechanism ensures that actors can receive and process their messages in a controlled and orderly manner without immediate interference from other operations or actors.

## Purpose of a Mailbox

1. **Message Buffering:** Actors typically operate asynchronously, and it's possible for multiple messages to be sent to an actor at once before it has the opportunity to process them. The mailbox acts as a buffer, storing these messages until they can be processed one by one.
  
2. **Isolation from Concurrency Issues:** By handling message delivery and processing in a serialized manner through the mailbox, actors are isolated from direct concurrency issues such as data races or deadlocks.

3. **Order of Message Processing:** Mailboxes typically use **First-In-First-Out (FIFO)** ordering which processes messages in the order they were received.

## Implementation Characteristics

- **Thread Safety:** Mailboxes are inherently thread-safe to allow multiple threads to deliver messages concurrently without corrupting the message queue.
  
- **Blocking Operations:** Upon attempting to read from an empty mailbox, actor systems often implement blocking operations where the actor thread is paused until a new message arrives. Conversely, when attempting to write to a full mailbox, write operations may block or drop messages based on system policies.

- **Capacity Management:** Mailboxes can have limited capacity, which influences how they handle overflow situations. This capacity management prevents excessive memory usage and helps manage system resources effectively.
