import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const area = searchParams.get("area");
    const facilityType = searchParams.get("type");
    const service = searchParams.get("service"); // e.g., 'icu', 'ventilator', 'x-ray', 'ecg'
    const query = searchParams.get("q")?.toLowerCase();

    let facilities = db.getFacilities();

    if (query) {
      facilities = facilities.filter(
        (f) =>
          f.name.toLowerCase().includes(query) ||
          f.area.toLowerCase().includes(query) ||
          f.city.toLowerCase().includes(query) ||
          f.resources.some((r) => r.name.toLowerCase().includes(query))
      );
    }

    if (area && area !== "ALL") {
      facilities = facilities.filter(
        (f) => f.area.toLowerCase() === area.toLowerCase() || f.city.toLowerCase() === area.toLowerCase()
      );
    }

    if (facilityType) {
      facilities = facilities.filter((f) => f.type.toLowerCase() === facilityType.toLowerCase());
    }

    if (service) {
      const s = service.toLowerCase();
      facilities = facilities.filter((f) =>
        f.resources.some((r) => r.name.toLowerCase().includes(s) && r.status !== "UNAVAILABLE")
      );
    }

    return NextResponse.json(facilities);
  } catch (error) {
    console.error("Error in GET /api/facilities:", error);
    return NextResponse.json({ error: "Failed to fetch facilities" }, { status: 500 });
  }
}
