import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const notifs = db.getNotifications();
    return NextResponse.json(notifs);
  } catch (error) {
    console.error("Notifications fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, markAll } = await request.json();
    if (markAll) {
      db.markAllNotificationsAsRead();
      return NextResponse.json({ success: true });
    }
    if (id) {
      const ok = db.markNotificationAsRead(id);
      return NextResponse.json({ success: ok });
    }
    return NextResponse.json({ error: "Missing notification id or markAll flag" }, { status: 400 });
  } catch (error) {
    console.error("Notification update error:", error);
    return NextResponse.json({ error: "Failed to update notification" }, { status: 500 });
  }
}
