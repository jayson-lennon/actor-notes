# Quick DDD Primer

Here is a list of DDD tactical terms and how they map to Actor Systems:

* **Entity** -> **Unit of State with Unique Identity**: A distinct "thing" in your system that you track individually over time.
    * **Actor Mapping:** Often represented by the state *within* an Actor, with the Actor's address or ID representing the Entity's unique identity.

* **Value Object** -> **Immutable Data Structure**: Data that describes something but has no own identity; defined only by its values.
    * **Actor Mapping:** Data carried as the content of Actor Messages or stored as immutable fields within an Actor's state.

* **Aggregate** -> **Consistent State Cluster (managed by a Coordinator)**: A group of related data that *must* be kept valid together. One point controls all changes to this group.
    * **Actor Mapping:** Naturally maps to a stateful Actor. The Actor *is* the coordinator, encapsulating and managing the state cluster, processing messages sequentially to ensure internal consistency.

* **Domain Service** -> **Domain Process/Operation**: Logic for a significant action or calculation that doesn't belong to just one "thing."
    * **Actor Mapping:** Implemented by dedicated Actors responsible for specific domain processes or orchestrations, possibly interacting with stateful Actors.

* **Application Service** -> **Use Case Coordinator**: Code that directs steps to perform a specific action requested by the user or another system; uses the domain logic but isn't the logic itself.
    * **Actor Mapping:** Implemented by Actors that serve as the entry point for commands or requests, orchestrating interactions by sending messages to other Actors (Domain Services, Aggregates).

* **Repository** -> **State Loader/Saver**: Gets and saves the "Consistent State Clusters" (Aggregates) from/to storage.
    * **Actor Mapping:** Used *by* Actors to manage their persistent state. In some frameworks, persistence is integrated into the Actor model itself.

* **Domain Event** -> **Something Significant Happened**: A notification or record that a key occurrence took place in the system.
    * **Actor Mapping:** Often implemented directly as Actor Messages that are emitted by Actors and can be subscribed to by other Actors or external systems.

