import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { reconcilePayments } from "@/lib/services/reconciliation/reconciler";
import { getSession } from "@/lib/auth";
import { reconciliations } from "@/lib/db/schema";

const schema = z.object({
  bankData: z
    .array(
      z.object({
        transactionId: z.string(),
        amount: z.number(),
        currency: z.string(),
        valueDate: z.string(),
        description: z.string(),
        reference: z.string(),
      }),
    )
    .min(1),
  periodStart: z.string().datetime(),
  periodEnd: z.string().datetime(),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = schema.parse(body);

    const result = await reconcilePayments(
      parsed.bankData,
      new Date(parsed.periodStart),
      new Date(parsed.periodEnd),
    );

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to process reconciliation" },
      { status: 500 },
    );
  }
}

export async function GET() {
  const runs = await db.select().from(reconciliations);

  return NextResponse.json({ runs }, { status: 200 });
}
