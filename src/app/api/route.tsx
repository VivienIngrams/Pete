import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Handles POST requests to /api
export async function POST(req: NextRequest) {
  try {
    // Parse the request body as JSON
    const body = await req.json();

    // Extract reCAPTCHA token and validate it
    const { token, name, email, message, subject } = body;

    if (!token) {
      return NextResponse.json(
        { error: "reCAPTCHA token is missing" },
        { status: 400 }
      );
    }

    const isCaptchaValid = await validateCaptcha(token);

    if (!isCaptchaValid) {
      return NextResponse.json(
        { error: "reCAPTCHA validation failed" },
        { status: 403 }
      );
    }

    // Email configuration
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      tls: { rejectUnauthorized: false },
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    // Sending email
    const mail = await transporter.sendMail({
      from: email,
      to: "info@joelbardeau.com",
      subject: `Form submission: ${subject}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    console.log("Email sent successfully:", mail.messageId);
    return NextResponse.json({ message: "Success: email was sent" });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Function to validate reCAPTCHA token
const validateCaptcha = async (response_key: string): Promise<boolean> => {
  const secret_key = process.env.RECAPTCHA_SECRET_KEY;

  if (!secret_key) {
    console.error("reCAPTCHA secret key is not defined in environment variables.");
    return false;
  }

  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response_key}`;

  try {
    const response = await fetch(url, { method: "POST" });
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Error validating reCAPTCHA:", error);
    return false;
  }
};
