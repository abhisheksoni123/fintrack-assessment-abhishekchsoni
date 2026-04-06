# AI Usage Journal

## Tool(s) used

- ChatGPT (GPT-5.3)

## Interaction Log

| #   | What I asked the AI                              | Quality of AI response (1-5) | Accepted? | My reasoning                                                                          |
| --- | ------------------------------------------------ | ---------------------------- | --------- | ------------------------------------------------------------------------------------- |
| 1   | Generate CLARIFICATIONS.md based on client brief | 5                            | Yes       | Covered most ambiguities and showed strong product thinking                           |
| 2   | Perform code audit and list bugs                 | 5                            | Yes       | Identified critical issues like SQL injection and matching flaws                      |
| 3   | Create AUDIT.md file                             | 5                            | Yes       | Clean formatting and structured output                                                |
| 4   | Fix reconciler, API, and dashboard               | 4                            | Partial   | Strong improvements but required manual validation for concurrency and business logic |

## Reflection

**Bugs AI found correctly** (that you then verified):

- SQL Injection vulnerabilities in API routes
- Weak matching logic (amount-only matching)
- Floating point precision issue in monetary calculations
- Missing DB transaction leading to data inconsistency
- Missing cleanup in frontend polling

**Bugs AI missed or got wrong**:

- Did not fully address race conditions between concurrent reconciliation runs
- Did not implement true idempotency handling
- Assumed simple transaction is enough without discussing locking strategy

**AI-generated code you rejected** (with reason):

- Initial matching logic using only amount (too naive for fintech use case)
- Direct status update without verifying strong match conditions

**The moment you most doubted the AI output and how you verified it**:
I doubted the correctness of the matching logic and concurrency safety. I verified it by reasoning about real-world fintech scenarios like duplicate transactions and parallel reconciliation runs.

**What you know that the AI does not** (domain/architecture insight the AI could not have):

- Real-world reconciliation systems require strong guarantees like idempotency and audit trails
- Financial systems must prioritize correctness over performance, especially in matching and state transitions
