import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"New Subscriber" <${process.env.GMAIL_USER}>`,
      to: "studiolippmannparis@gmail.com",
          subject: "New Newsletter Subscriber",
      html: `<p>New subscriber email: <strong>${email}</strong></p>`,
    });

    return NextResponse.json({ message: "Subscription email sent!" });
  } catch (err) {
    console.error("Subscription API error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
