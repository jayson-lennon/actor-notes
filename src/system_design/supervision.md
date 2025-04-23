# Supervision

Actor supervision is a key concept when using the actor model.

## What is Actor Supervision?

In an actor system, implementing hierarchical supervision is a best practice. When an actor acts as a parent by spawning another actor (the child), the parent should take on the role of supervisor for the spawned child. The rationale behind this is that the parent has the knowledge of how to spawn the child. Therefore, in cases where the child terminates, the parent is equipped to respawn it.

The supervision hierarchy forms a tree structure where each supervisor is responsible for spawning its immediate children. This setup allows the entire system to be "bootstrapped" by starting with the root-level actor, known as the _system supervisor_. The system supervisor spawns its children, which can also be supervisors, and these in turn spawn their own children, continuing until the entire system is online. Since supervisors manage only their immediate children, this design facilitates restarting arbitrary parts of the system as needed.

Supervision strategies include:

- **Resume**

    The failing child actor is resumed, and its internal state is preserved. This is suitable for transient errors that do not corrupt the actor's state and where continuing processing is safe.

- **Restart**

    The failing child actor is stopped, a new instance of the actor is created with a fresh internal state, and the new instance resumes processing. This is typically used when the actor's state might be corrupted by the failure and a clean slate is needed. The message that caused the failure is usually skipped.

- **Stop**

    The failing child actor is permanently terminated. This directive is used for non-recoverable errors or when the failed actor is no longer needed.

- **Escalate**

    The failure is sent up to the supervisor's own supervisor (its parent). This is used when the current supervisor cannot handle the specific failure and delegates the decision to a higher level in the hierarchy.

A supervision strategy is activated by a _supervision event_. When a problem occurs with a child actor, the actor system itself will generate a supervision event and forward it to the child's supervisor. The supervisor can then apply it's desired strategy based on it's own state and the state of the child actor.

### Benefits of Actor Supervision

1. **Failure Isolation**: By isolating failures at the actor level, supervision ensures that an error in one part of the application does not affect the rest.

2. **Fault Tolerance**: Applications can be designed to handle failures gracefully, providing a high availability of services even when parts of the system fail.

3. **Ease of Debugging and Maintenance**: Clearly defined recovery strategies make debugging easier and maintenance simpler.
