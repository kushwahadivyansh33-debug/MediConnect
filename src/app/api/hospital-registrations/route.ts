import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const hospitalRegistrationSchema = z.object({
  name: z.string().trim().min(2).max(120),
  type: z.enum(["HOSPITAL", "CLINIC", "TRAUMA_CENTER"]),
  address: z.string().trim().min(5).max(200),
  area: z.string().trim().min(2).max(80),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  pincode: z.string().trim().min(4).max(10).regex(/^[A-Za-z0-9 -]+$/),
  phone: z.string().trim().min(7).max(24).regex(/^[+\d][\d\s().-]+$/),
  emergencyPhone: z.string().trim().min(7).max(24).regex(/^[+\d][\d\s().-]+$/),
  email: z.string().trim().email().max(254),
  website: z.union([z.string().trim().url().max(254), z.literal("")]).optional(),
  contactName: z.string().trim().min(2).max(80),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = hospitalRegistrationSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Please check the hospital details and required contact information." },
        { status: 400 },
      );
    }

    const registration = db.createHospitalRegistration({
      ...validated.data,
      website: validated.data.website || undefined,
    });

    return NextResponse.json(
      {
        registration: {
          id: registration.id,
          status: registration.status,
          createdAt: registration.createdAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error in POST /api/hospital-registrations:", error);
    return NextResponse.json(
      { error: "Unable to submit the hospital registration right now." },
      { status: 500 },
    );
  }
}
