import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const updateBloodSchema = z.object({
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  status: z.enum(["AVAILABLE", "LIMITED", "UNAVAILABLE", "UNKNOWN"]),
  unitsAvailable: z.number().int().min(0).optional(),
});

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const bloodBank = db.getBloodBankById(params.id);
  if (!bloodBank) {
    return NextResponse.json({ error: "Blood bank not found" }, { status: 404 });
  }
  return NextResponse.json(bloodBank);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Staff login required." }, { status: 401 });
    }

    const body = await request.json();
    const validated = updateBloodSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: "Validation failed", details: validated.error.format() }, { status: 400 });
    }

    const updated = db.updateBloodInventory(
      params.id,
      validated.data.bloodGroup,
      {
        status: validated.data.status,
        unitsAvailable: validated.data.unitsAvailable,
      },
      { id: user.id, name: user.name }
    );

    if (!updated) {
      return NextResponse.json({ error: "Blood bank not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, bloodBank: updated });
  } catch (error) {
    console.error("Error in PATCH /api/blood-banks/[id]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
