import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email address is required." }, { status: 400 });
    }

    const user = db.getUserByEmail(email);
    // Secure pattern: Always return generic response to prevent user enumeration
    if (user) {
      const resetToken = crypto.randomBytes(24).toString("hex");
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins expiry
      db.createPasswordResetToken(email, resetToken, expiresAt);

      // In local development/demo mode, record the token in memory safely
      console.log(`[MediConnect Demo Reset Token] Token for ${email}: ${resetToken}`);
    }

    return NextResponse.json({
      success: true,
      message: "If an authorized staff account exists for this email, password reset instructions have been dispatched.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Failed to process request." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { token, newPassword } = await request.json();
    if (!token || !newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: "Valid reset token and password (min 6 chars) are required." }, { status: 400 });
    }

    const email = db.verifyAndConsumeResetToken(token);
    if (!email) {
      return NextResponse.json(
        { error: "Invalid, expired, or already-used reset token. Please request a new link." },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(newPassword);
    db.updateUserPassword(email, hashedPassword);

    return NextResponse.json({
      success: true,
      message: "Your password has been successfully reset. You may now login.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Failed to reset password." }, { status: 500 });
  }
}
