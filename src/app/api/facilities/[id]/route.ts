import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const updateResourceSchema = z.object({
  resourceId: z.string(),
  status: z.enum(["AVAILABLE", "LIMITED", "UNAVAILABLE", "UNKNOWN"]),
  availableUnits: z.number().int().min(0).optional(),
  notes: z.string().max(250).optional(),
});

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const facility = db.getFacilityById(params.id);
  if (!facility) {
    return NextResponse.json({ error: "Facility not found" }, { status: 404 });
  }
  return NextResponse.json(facility);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Staff login required." }, { status: 401 });
    }

    // Role-based permissions
    if (user.role !== "ADMIN" && user.facilityId !== params.id) {
      return NextResponse.json(
        { error: "Forbidden. You are not authorized to modify resources for this facility." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validated = updateResourceSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: "Validation failed", details: validated.error.format() }, { status: 400 });
    }

    const updatedFacility = db.updateFacilityResource(
      params.id,
      validated.data.resourceId,
      {
        status: validated.data.status,
        availableUnits: validated.data.availableUnits,
        notes: validated.data.notes,
      },
      { id: user.id, name: user.name }
    );

    if (!updatedFacility) {
      return NextResponse.json({ error: "Facility or resource not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, facility: updatedFacility });
  } catch (error) {
    console.error("Error in PATCH /api/facilities/[id]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
