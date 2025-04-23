# Communication channels

The method in which actors communicate with other actors is not dictated by the underlying mathematical model of actors. Therefore, **how** they communicate can vary significantly across different implementations.

## Types of Actor Communication Channels

Each method of communication has different overhead and informs the way in which actor-based programs are written. Here is a short list of the primary methods used by actor frameworks or libraries:

### Physical Actors (Actors with Affinity)

Some actor systems use "physical" or affinity-based communication channels where actors have direct bindings or shared memory spaces:

- **Shared Memory:** Actors residing on the same physical machine can communicate directly using shared memory, which provides low-latency interaction.
- **Network Sockets:** Network sockets are used for inter-machine communication. This introduces a minimal overhead compared to higher-level messaging protocols.

With physical actors you will usually have access to an `ActorRef` or similar data structure. This represents a reference to a specific instance of an actor in the system (local or remote). If the actor dies, then the `ActorRef` becomes invalid and the communication channel is broken. Attempting to send a message on a broken channel will result in a failure at the sender. This gives the sender the opportunity to perform some kind of different action on failure, but then also requires managing the lifetime of the communication channel manually.

Many actor libraries use physical actors because they are the simple to implement while also providing the bare-minimum to fulfill the actor model without additional overhead.

### Virtual Actors (Grains)

This approach is used by Microsoft Orleans, a framework that leverages a distributed computing model. In this paradigm, actors, or "grains," are essentially virtualized and opaque objects to the caller. If actor `A` wishes to communicate with actor `B`, it simply sends a message to `B`. The Orleans runtime handles the intricacies of managing these grains. Specifically:

- **Automatic Activation:** If actor `B` is not already operational when actor `A` attempts to send a message, the runtime automatically activates or "spins up" actor `B`.
- **Transparent Location:** Actor `B` can be located anywhere within the distributed system. The exact location becomes irrelevant since Orleans manages the communication channels between actors.
- **Message Queueing and Routing:** Messages are placed in a queue specific to the grain (actor) until it is ready to process them. This mechanism ensures that message delivery is reliable and follows a FIFO order where applicable.

With virtual actor systems, you'll have access to a `VirtualActorRef` or similar data structure. This represents the "identity" of an actor. For example, if you query for actor `Foo` with identity `123`, then the returned `VirtualActorRef` will _always_ route to `Foo123` even if that actor dies. The communication channel to `Foo123` _always exists_ because the actor runtime performs work behind the scenes to create and maintain the communication channel regardless of the current system state.

### Event-Driven Channels

Event-driven channels involve actors listening to specific events or signals:

- **Subscription Model:** Actors can subscribe to certain types of events or messages. When these events occur, the event source sends out notifications that are delivered to interested actors.
- **Asynchronous Notification:** This model is inherently asynchronous, meaning that actors do not have to actively query for events but instead reactively process them.

Event-driven channels can use a global message broker. Actors subscribe to events on the broker and also send messages to the broker. The message broker then becomes responsible for routing messages to the correct subscribers.

Using a global message broker decouples actors from direct `ActorRef` communication, eliminating concerns about broken links. However, this setup introduces indirection, potentially increasing overhead in message transmission. Additionally, there's a risk of message loss unless acknowledged by the recipient. We assume continuous availability of the broker, ensuring that messages can always be _sent_; however, delivery is not guaranteed without waiting for an acknowledgment.
