exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
    if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

    const { message, page, timestamp } = JSON.parse(event.body || '{}');
    const { RESEND_API_KEY } = process.env;

    if (!message || !message.trim()) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'No message provided' }) };
    }

    const safeMessage = message.trim().slice(0, 2000);
    const safeTimestamp = timestamp || new Date().toISOString();
    const safePage = page || 'unknown';

    const emailBody = `
⚠️ CHILD SAFETY ALERT — DnB Santa

A child has reported feeling unsafe on the site and needs help.

TIME: ${safeTimestamp}
PAGE: ${safePage}

THEIR MESSAGE:
"${safeMessage}"

---
ACTION REQUIRED: Review this immediately and check the site for any content or user behaviour that may have caused this.
This alert was sent from the child safety system on dnbsanta.com.
The child has been told that someone is looking at this right now.
`.trim();

    try {
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'DnB Santa Safety Team <welcome@cannabin-oid.co.uk>',
                to: ['glowgadgets@gmail.com'],
                subject: `⚠️ CHILD SAFETY ALERT — DnB Santa — ${safeTimestamp}`,
                text: emailBody
            })
        });

        if (!res.ok) {
            const err = await res.text();
            console.error('Resend error:', err);
            return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to send alert' }) };
        }

        return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };

    } catch (e) {
        console.error('Child safety report error:', e);
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server error' }) };
    }
};
