Task 1 — Requirements Clarification

Below is a list of ambiguities and assumptions identified from the client brief.

1. Matching Logic

Quote:

"Payments need to be properly matched against the bank records"

Ambiguity:
What defines a “proper” match?

Assumption:
Matching should be based on a combination of:

amount
reference OR externalRef
proximity of dates (±1–2 days)

Why this assumption:

Matching only by amount (current implementation) is unsafe (duplicate amounts are common).
Reference IDs are typically the strongest signal in fintech systems.
Date tolerance is needed due to settlement delays. 2. Real-Time Requirement

Quote:

"The system should do reconciliation in real-time — we can't wait for a nightly job"

Ambiguity:
What qualifies as "real-time"?

Assumption:

Reconciliation should be triggered synchronously via API
Response time target: a few seconds for typical batch sizes (not streaming)

Why this assumption:

The current API design (POST /reconcile) suggests request-response execution
No mention of streaming or event-driven architecture 3. Handling Large Batches

Quote:

"Accept a batch of bank records"

Ambiguity:
How large can a batch be?

Assumption:

Initial implementation supports moderate batches (e.g., 1k–10k records)
Future optimization (chunking / background jobs) may be required

Why this assumption:

No pagination or async job system currently exists
Real-time constraint limits extremely large processing 4. Currency Handling

Quote:

"We handle multiple currencies but for now just focus on USD"

Ambiguity:
Should non-USD records be rejected or ignored?

Assumption:

Only USD records are processed
Non-USD records are flagged as discrepancies

Why this assumption:

Safer than silently ignoring
Keeps system extensible for future multi-currency support 5. Discrepancy Definition

Quote:

"Any discrepancies should be flagged so the team can review them"

Ambiguity:
What qualifies as a discrepancy?

Assumption:
A discrepancy occurs when:

Amount mismatch between matched records
Currency mismatch
Date mismatch beyond acceptable threshold

Why this assumption:

These are standard reconciliation mismatch scenarios in fintech systems 6. Reconciliation Persistence

Quote:

"Persist the reconciliation run to the database"

Ambiguity:
What level of detail should be stored?

Assumption:
Store:

Summary (counts, totals)
Matched pairs (IDs)
Unmatched records
Discrepancies

Why this assumption:

Required for auditability and debugging
Current schema only stores summary → insufficient for real-world use 7. Dashboard Expectations

Quote:

"Display past reconciliation runs in a dashboard"

Ambiguity:
What data should be visible?

Assumption:
Dashboard should show:

Period
Matched / unmatched counts
Total discrepancy
Status
Ability to drill down (future scope)

Why this assumption:

Matches typical finance tooling UX
Current UI only shows summary 8. Status Lifecycle

Quote:
(Not explicitly defined, inferred from UI)

Ambiguity:
What are valid reconciliation states?

Assumption:
States:

pending → created
running → processing
complete → success
failed → error

Why this assumption:

Already partially defined in UI
Needed for real-time feedback 9. Idempotency

Quote:
(Not mentioned)

Ambiguity:
What happens if the same batch is submitted multiple times?

Assumption:

System should support idempotency via runId or hash of input

Why this assumption:

Prevents duplicate reconciliation runs
Important in financial systems 10. Timezone Handling

Quote:

"valueDate: ISO date string"

Ambiguity:
Are all timestamps in UTC?

Assumption:

All dates are treated as UTC

Why this assumption:

Standard practice in financial systems
Avoids reconciliation mismatches 11. Payment Status Transition

Quote:
(Not clearly defined)

Ambiguity:
When should a payment be marked as reconciled?

Assumption:

Only when a confident match is found (not just amount match)

Why this assumption:

Prevents incorrect financial state changes
Current implementation is too naive 12. Error Handling

Quote:
(Not mentioned)

Ambiguity:
How should failures be handled?

Assumption:

Partial failures should not corrupt data
Run should be marked failed with logs

Why this assumption:

Critical for reliability in fintech systems 13. Security of Input Data

Quote:
(Not explicitly stated)

Ambiguity:
How trusted is the uploaded bank data?

Assumption:

Input must be validated and sanitized strictly

Why this assumption:

Prevents injection and malformed data issues

Summary

The current system is functionally incomplete and risky due to:

Naive matching logic
Lack of proper discrepancy detection
Weak persistence model
Missing compliance considerations

These assumptions will guide the next steps:

Fix reconciliation logic
Improve data integrity
Ensure auditability
Align with compliance requirements
