function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            "Content-Type": "application/json",
        },
    });
}

function escapeHtml(value = "") {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const data = await request.json();

        const {
            name,
            email,
            subject,
            inquiryType,
            message,
            budget,
        } = data;

        if (!name || !email || !subject || !message) {
            return jsonResponse(
                {
                    success: false,
                    error: "Missing required fields.",
                },
                400
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return jsonResponse(
                {
                    success: false,
                    error: "Invalid email address.",
                },
                400
            );
        }

        if (!env.RESEND_API_KEY) {
            return jsonResponse(
                {
                    success: false,
                    error: "Email service is not configured.",
                },
                500
            );
        }

        const response = await fetch(
            "https://api.resend.com/emails",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${env.RESEND_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    from: "Portfolio Contact Form <onboarding@resend.dev>",
                    to: ["smithiian34@gmail.com"],
                    reply_to: email,
                    subject: `[Portfolio] ${subject}`,
                    html: `
                        <h2>New Portfolio Contact Form Submission</h2>

                        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
                        <p><strong>Email:</strong> ${escapeHtml(email)}</p>

                        <p>
                            <strong>Inquiry Type:</strong>
                            ${escapeHtml(inquiryType || "Not specified")}
                        </p>

                        <p>
                            <strong>Budget:</strong>
                            ${escapeHtml(budget || "Not specified")}
                        </p>

                        <p><strong>Message:</strong></p>

                        <p>
                            ${escapeHtml(message)}
                        </p>
                    `,
                }),
            }
        );

        if (!response.ok) {
            const error = await response.text();

            console.error(error);

            return jsonResponse(
                {
                    success: false,
                    error: "Failed to send email.",
                },
                500
            );
        }

        return jsonResponse({
            success: true,
        });
    } catch (error) {
        console.error(error);

        return jsonResponse(
            {
                success: false,
                error: "Server error.",
            },
            500
        );
    }
}