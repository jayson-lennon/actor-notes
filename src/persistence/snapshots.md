# Snapshots

While the Journal provides a complete, immutable history of an actor's state changes through its events, reconstructing the actor's current state requires replaying potentially thousands or millions of events from the beginning of time or from the last saved snapshot. For long-lived actors with extensive journals, this replay process can become prohibitively slow, delaying recovery and impacting availability.

**Snapshots** provide a shortcut. A Snapshot is a serialized representation of an actor's state at _a specific point in time_. It's a capture of the state after applying a sequence of events up to a certain journal sequence number.

## Snapshots and Journals Together

Snapshots are not a replacement for the Journal; they are a complementary mechanism.

- The **Journal** remains the single source of truth, holding the complete, ordered sequence of events. It tells the story of _how_ the actor reached a state.
- A **Snapshot** is a saved version of the _result_ of applying events up to a certain point. It's a pre-computed state from the story.

When an actor recovers, instead of replaying _all_ events from the beginning of its journal, it can load the most recent Snapshot and then only replay the events that occurred _after_ that snapshot was taken.

## The Recovery Process with Snapshots

The recovery workflow when using Snapshots is:

1. **Load Latest Snapshot:** The actor system attempts to load the most recent Snapshot saved for this specific actor instance.
2. **Load Journal from Snapshot Point:** If a Snapshot is successfully loaded (including its associated journal sequence number), the system then reads events from the Journal starting _immediately after_ that sequence number.
3. **Apply Remaining Events:** The actor applies only these subsequent journaled events to the state loaded from the Snapshot.
4. **Resume Processing:** Once the remaining events are applied, the actor is fully recovered and can handle new messages.
5. **Without Snapshot:** If no Snapshot is found (e.g., it's the first time recovering, or snapshots were lost), the actor recovers by replaying all events from the very beginning of its Journal.

This process significantly reduces the number of events that need to be replayed, speeding up recovery time.

## When and What to Snapshot

- **Frequency:** Snapshots are typically saved periodically – for example, after every N events, after a certain period of time, or when the actor's state reaches a certain size or complexity. Too frequent snapshotting adds overhead (serialization, storage), while too infrequent snapshotting reduces the recovery speed benefit.
- **What State:** The snapshot should capture the actor's _current state_. It should include all the mutable fields that define the actor's current condition. This state must be **Serializable** so it can be written to persistent storage.
- **Consistency:** The snapshot must accurately reflect the state after processing events up to a specific, recorded journal sequence number. This sequence number is crucial for knowing where to start replaying events from the Journal.

## Considerations

- **Storage:** Snapshots require persistent storage (databases, file systems). This storage must be reliable and accessible during recovery.
- **Serialization Overhead:** Creating a snapshot involves serializing the actor's entire state, which can be CPU-intensive and time-consuming, especially for large states.
- **Coupling:** The snapshot format is tightly coupled to the actor's internal state structure. Changes to the actor's state model might require versioning or migration strategies for existing snapshots.
- **Snapshot vs. Journal Integrity:** The Journal remains the ultimate source of truth. If a snapshot is corrupt or missing, the system can (albeit slower) recover solely from the Journal. The system should prioritize Journal integrity.
