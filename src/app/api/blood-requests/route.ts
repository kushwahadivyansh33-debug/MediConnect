import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const bloodRequestSchema = z.object({
  bloodBankId: z.string().min(1).max(100),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  units: z.number().int().min(1).max(10),
  appointmentSlot: z.enum(["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]),
  neededBy: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .refine((value) => {
      const date = new Date(`${value}T00:00:00.000Z`);
      return (
        !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === value &&
        value >= new Date().toISOString().slice(0, 10)
      );
    }, "Choose today or a future date."),
  requesterName: z.string().trim().min(2).max(80),
  requesterPhone: z
    .string()
    .trim()
    .min(7)
    .max(24)
    .regex(/^[+\d][\d\s().-]+$/, "Enter a valid phone number."),
  requesterEmail: z.union([z.string().trim().email().max(254), z.literal("")]).optional(),
  notes: z.string().trim().max(250).optional(),
  prescriptionConfirmed: z.literal(true),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = bloodRequestSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Please check the request details and required confirmations." },
        { status: 400 },
      );
    }

    const { prescriptionConfirmed: _prescriptionConfirmed, ...requestData } = validated.data;
    const created = db.createBloodRequest({
      ...requestData,
      requesterEmail: requestData.requesterEmail || undefined,
    });
    if (!created) {
      return NextResponse.json({ error: "Blood bank or blood group was not found." }, { status: 404 });
    }

    return NextResponse.json(
      {
        request: {
          reference: created.reference,
          bloodBankName: created.bloodBankName,
          bloodGroup: created.bloodGroup,
          units: created.units,
          neededBy: created.neededBy,
          appointmentSlot: created.appointmentSlot,
          status: created.status,
          createdAt: created.createdAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error in POST /api/blood-requests:", error);
    return NextResponse.json({ error: "Unable to submit the blood request right now." }, { status: 500 });
  }
}
