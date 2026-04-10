exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
    if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

    const { name, age, occasion, wish, language, tone } = JSON.parse(event.body || '{}');
    const { GEMINI_API_KEY, ELEVENLABS_API_KEY } = process.env;
    const VOICE_ID = '3C4ilKOJAsjhzHnyXYtH';

    if (!name || !wish) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing required fields' }) };

    // Step 1: Gemini writes the script
    const prompt = `You are DnB Santa — Father Christmas who grew up on drum & bass, jungle and rave music from the 90s and 2000s. You have MC energy — big ups, shout-outs, massive respect — but you're also genuinely kind, warm and magical. You love kids and the dancefloor in equal measure.

Write a personalised spoken voice message from DnB Santa. Rules:
- 100 to 120 words MAXIMUM
- Written entirely in ${language}
- Natural speech rhythm — this will be spoken aloud by a voice model
- No stage directions, no asterisks, no emoji, no parentheses — only the exact words to be spoken
- Person's name: ${name}
- Their age: ${age}
- Occasion: ${occasion}
- Their wish or special message: "${wish}"
- Tone style: ${tone}
- End warmly with a mention of the FeelFamous family or the village

Start with a strong greeting, get personal and specific, build warmth and energy, close with genuine love.`;

    let script;
    try {
        const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { maxOutputTokens: 350, temperature: 0.85 }
                })
            }
        );

        if (!geminiRes.ok) {
            const err = await geminiRes.text();
            console.error('Gemini error:', err);
            return { statusCode: 500, headers, body: JSON.stringify({ error: 'Script generation failed' }) };
        }

        const geminiData = await geminiRes.json();
        script = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (!script) return { statusCode: 500, headers, body: JSON.stringify({ error: 'Empty script from Gemini' }) };

    } catch(e) {
        console.error('Gemini exception:', e);
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Script generation failed' }) };
    }

    // Step 2: ElevenLabs TTS
    try {
        const audioRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
            method: 'POST',
            headers: {
                'xi-api-key': ELEVENLABS_API_KEY,
                'Content-Type': 'application/json',
                'Accept': 'audio/mpeg'
            },
            body: JSON.stringify({
                text: script,
                model_id: 'eleven_multilingual_v2',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.8,
                    style: 0.3,
                    use_speaker_boost: true
                }
            })
        });

        if (!audioRes.ok) {
            const err = await audioRes.text();
            console.error('ElevenLabs error:', err);
            // Return the script even if audio fails so it's not a total loss
            return { statusCode: 500, headers, body: JSON.stringify({ error: 'Audio generation failed', script }) };
        }

        const audioBuffer = await audioRes.arrayBuffer();
        const audioBase64 = Buffer.from(audioBuffer).toString('base64');

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ script, audio: audioBase64 })
        };

    } catch(e) {
        console.error('ElevenLabs exception:', e);
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Audio generation failed', script }) };
    }
};
