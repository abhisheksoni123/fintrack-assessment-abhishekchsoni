import { eq, between, and } from 'drizzle-orm'

    const matchedPaymentIds = new Set<string>()
    const matchedBankIds = new Set<string>()

    const validBankRecords = bankData.filter(r =>
      r.currency === 'USD' && isInPeriod(parseBankDate(r.valueDate), periodStart, periodEnd)
    )

    for (const bankRecord of validBankRecords) {
      const remaining = systemPayments.filter(p => !matchedPaymentIds.has(p.id))

      const match = findMatch(bankRecord, remaining)

      if (match) {
        const delta = toCents(bankRecord.amount) - toCents(match.amount)

        if (delta !== 0) {
          discrepancies.push({
            bankRecord,
            payment: match,
            amountDelta: fromCents(delta),
          })
        } else {
          matched.push({ bankRecord, payment: match })

          matchedPaymentIds.add(match.id)
          matchedBankIds.add(bankRecord.transactionId)

          await tx
            .update(payments)
            .set({ status: 'reconciled' })
            .where(and(eq(payments.id, match.id), eq(payments.status, 'pending')))
        }
      }
    }

    const bankOnly = validBankRecords.filter(r => !matchedBankIds.has(r.transactionId))
    const systemOnly = systemPayments.filter(p => !matchedPaymentIds.has(p.id))

    const totalBankCents = validBankRecords.reduce((s, r) => s + toCents(r.amount), 0)
    const totalSystemCents = systemPayments.reduce((s, p) => s + toCents(p.amount), 0)

    const [saved] = await tx
      .insert(reconciliations)
      .values({
        periodStart,
        periodEnd,
        matchedCount: matched.length,
        unmatchedCount: bankOnly.length + systemOnly.length,
        totalBankAmount: fromCents(totalBankCents),
        totalSystemAmount: fromCents(totalSystemCents),
        difference: fromCents(totalBankCents - totalSystemCents),
        status: 'complete',
      })
      .returning()

    return {
      id: saved.id,
      matched,
      unmatched: { bankOnly, systemOnly },
      discrepancies,
      summary: {
        totalBankAmount: fromCents(totalBankCents),
        totalSystemAmount: fromCents(totalSystemCents),
        difference: fromCents(totalBankCents - totalSystemCents),
      },
    }
  })
}