# Kinds of Messages

In designing actor systems and distributed architectures, especially those leaning towards event-driven principles or [CQRS](https://www.martinfowler.com/bliki/CQRS.html) (Command Query Responsibility Segregation), it's helpful to categorize the different types of messages flowing through the system based on their purpose. The primary distinctions are typically made between Commands, Events, and Queries.

## Commands (Expressing Intent)

**Commands** represent a user's or system's *intent* to perform an action or change the state of the system. They are imperative requests. A Command is a request for the system to *do something*.

* **Nature:** Imperative, a request.
* **Direction:** Usually directed at a specific actor or a well-defined endpoint responsible for handling that specific type of action (e.g., an aggregate actor in DDD).
* **Expectation:** The sender expects the command to be *attempted* and potentially result in a state change and/or the emission of one or more events. The sender might expect an acknowledgment of receipt or a more detailed response indicating success/failure or the outcome of the action.
* **Naming Convention:** Often named in the imperative mood (verb-noun), like `CreateUser`, `PlaceOrder`, `ProcessPayment`.
* **Examples:**

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

## Events (Representing Facts)

**Events** represent something that *has already happened* in the system. They are declarative statements of fact about a state change. Events are the result of successfully processing a Command (or sometimes external occurrences).

* **Nature:** Declarative, a statement of fact.
* **Direction:** Usually published to a Pub/Sub topic or message bus, to be consumed by any interested party. Events are often broadcast.
* **Expectation:** Publishers of events typically use `tell` (fire-and-forget) and do not expect a direct response from consumers. Consumers react to the event asynchronously.
* **Naming Convention:** Often named in the past tense (noun-verb), like `UserCreated`, `OrderPlaced`, `PaymentProcessed`.
* **Examples:**

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

Events are crucial for decoupling. An actor emitting an event doesn't need to know *who* is interested or what they will do. Other actors (subscribers) can react to events to update read models, trigger side effects, or initiate subsequent commands/workflows.

## Queries (Requesting Information)

**Queries** are requests for information about the current state of the system. They are not intended to change the system's state.

* **Nature:** Interrogative, a request for data.
* **Direction:** Directed at an actor or service responsible for providing the requested information (often read models optimized for querying).
* **Expectation:** The sender explicitly expects a response containing the requested data.
* **Naming Convention:** Often named to reflect the data being requested (e.g., `GetUserProfile`, `ListOrders`, `GetOrderStatus`).
* **Examples:**

    | Query                 | Description                            |
    |-----------------------|----------------------------------------|
    | GetUserProfile        | Retrieve details for a specific user   |
    | ListOrders            | Get a list of orders for a user        |
    | GetOrderStatus        | Check the current status of an order   |
    | FindProductsByCategory| Find products within a given category  |
    | CountActiveUsers      | Get the total number of active users   |
