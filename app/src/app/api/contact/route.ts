import {NextRequest, NextResponse} from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.NEXT_PUBLIC_SMTP_SERVER,
    port: parseInt(process.env.NEXT_PUBLIC_SMTP_PORT!),
    secure: false,
    auth: {
        user: process.env.NEXT_PUBLIC_GMAIL_USER,
        pass: process.env.NEXT_PUBLIC_GMAIL_APP_PASSWORD,
    },
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {name, email, subject, message} = body;

        // Validation
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                {success: false, message: "All fields are required"},
                {status: 400}
            );
        }

        await transporter.sendMail({
            from: process.env.NEXT_PUBLIC_GMAIL_USER,
            to: "dogukanurker@icloud.com",
            subject,
            text: message,
            html: `<h3>New message from: ${name}</h3><p>${message}</p> <p>Email: ${email}</p>`,
        });

        return NextResponse.json(
            {success: true, message: "Email sent successfully"},
            {status: 200}
        );
    } catch (error: unknown) {
        return NextResponse.json(
            {success: false, message: (error as Error).message || "Failed to send email"},
            {status: 500}
        );
    }
}

export async function GET() {
    return NextResponse.json(
        {message: "Method not allowed"},
        {status: 405}
    );
}