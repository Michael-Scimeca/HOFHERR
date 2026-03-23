import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, phone, cateringData } = body;

        // Validation
        if (!name || !email || !cateringData) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Configure Mailer (Fallback to generic if env missing)
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.ethereal.email',
            port: Number(process.env.SMTP_PORT) || 587,
            secure: false, 
            auth: {
                user: process.env.SMTP_USER || 'patience.schmeler48@ethereal.email',
                pass: process.env.SMTP_PASS || '6hTNRXUzv3QZ2n5W5a',
            },
        });

        const mailContent = `
            <h2>New BBQ Catering Inquiry</h2>
            <p><strong>Customer:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <hr />
            <h3>Event Details</h3>
            <p><strong>Date:</strong> ${cateringData.date || 'To be decided'}</p>
            <p><strong>Guests:</strong> ${cateringData.guests}</p>
            <p><strong>Package:</strong> ${cateringData.packageName}</p>
            <p><strong>Estimated Total:</strong> ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cateringData.total)}</p>
            <h3>Choices:</h3>
            <ul>
                ${cateringData.meats.map((m: any) => `<li>${m}</li>`).join('')}
                ${cateringData.sides.map((s: any) => `<li>${s}</li>`).join('')}
            </ul>
        `;

        // Send to Hofherr
        await transporter.sendMail({
            from: '"Hofherr Website" <catering@hofherrmeats.com>',
            to: 'catering@hofherrmeats.com',
            replyTo: email,
            subject: `Catering Inquiry: ${name} — ${cateringData.date || 'TBD'}`,
            html: mailContent,
        });

        // Send Receipt to Customer
        await transporter.sendMail({
            from: '"Hofherr Meat Co." <catering@hofherrmeats.com>',
            to: email,
            subject: `Your Hofherr BBQ Catering Quote — Receipt`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; padding: 20px;">
                    <h1 style="color: #BA1A1A;">✓ We've got your date!</h1>
                    <p>Hi ${name},</p>
                    <p>Thank you for inquiring about BBQ catering on <strong>${cateringData.date || 'TBD'}</strong>.</p>
                    <p>Our team is reviewing your estimated total of <strong>${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cateringData.total)}</strong> for <strong>${cateringData.guests} guests</strong>.</p>
                    <div style="background: #f9f9f9; padding: 20px; border-radius: 8px;">
                        <strong>Menu Selection:</strong><br />
                        ${cateringData.packageName}<br />
                        ${cateringData.meats.join(', ')}<br />
                        ${cateringData.sides.join(', ')}
                    </div>
                    <p>We will be in touch shortly to confirm and discuss any specific dietary needs.</p>
                    <p>— The Hofherr Team</p>
                </div>
            `,
        });

        return NextResponse.json({ success: true });

    } catch (err: any) {
        console.error("Inquiry Hub Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
