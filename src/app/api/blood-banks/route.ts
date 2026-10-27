import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bloodGroup = searchParams.get("group"); // e.g. A+, O-, etc.
    const area = searchParams.get("area");
    const query = searchParams.get("q")?.toLowerCase();

    let bloodBanks = db.getBloodBanks();

    if (query) {
      bloodBanks = bloodBanks.filter(
        (b) =>
          b.name.toLowerCase().includes(query) ||
          b.area.toLowerCase().includes(query) ||
          b.city.toLowerCase().includes(query) ||
          (b.hospitalName && b.hospitalName.toLowerCase().includes(query))
      );
    }

    if (area && area !== "ALL") {
      bloodBanks = bloodBanks.filter(
        (b) => b.area.toLowerCase() === area.toLowerCase() || b.city.toLowerCase() === area.toLowerCase()
      );
    }

    if (bloodGroup && bloodGroup !== "ALL") {
      bloodBanks = bloodBanks.filter((b) =>
        b.inventory.some((i) => i.bloodGroup === bloodGroup && i.status !== "UNAVAILABLE")
      );
    }

    return NextResponse.json(bloodBanks);
  } catch (error) {
    console.error("Error in GET /api/blood-banks:", error);
    return NextResponse.json({ error: "Failed to fetch blood banks" }, { status: 500 });
  }
}
