document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById('sendBtn');
    const copyBtn = document.getElementById('copyBtn');
    const promptTextarea = document.getElementById('prompt');
    const apiKeyInput = document.getElementById('apiKey');
    const responseTextarea = document.getElementById('response');
    const errorSpan = document.getElementById('error');

    async function processCode(code, key) {
        try {
            const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${key}`,
                    'HTTP-Referer': 'http://127.0.0.1:5500',
                    'X-Title': 'Debugger Elite'
                },
                body: JSON.stringify({
                    'model': 'stepfun/step-3.5-flash:free',
                    'messages': [
                        { 
                            'role': 'system', 
                            'content': 'You are a world-class JS engineer. Fix the users code. Change log() to console.log() and fix case errors. Return ONLY pure code. No markdown, no talking.' 
                        },
                        { 'role': 'user', 'content': code }
                    ]
                })
            });

            if (!res.ok) throw new Error("Invalid API Key or Connection Issue");
            const data = await res.json();
            return data.choices[0].message.content.trim();
        } catch (e) {
            errorSpan.textContent = e.message;
            return null;
        }
    }

    sendBtn.addEventListener('click', async () => {
        const code = promptTextarea.value.trim();
        const key = apiKeyInput.value.trim();

        if (!code || !key) {
            errorSpan.textContent = "Please fill in all fields.";
            return;
        }

        errorSpan.textContent = "";
        sendBtn.innerText = "ANALYZING...";
        sendBtn.disabled = true;

        const result = await processCode(code, key);
        if (result) {
            responseTextarea.value = result;
            sendBtn.innerText = "RUN DEBUGGER";
        } else {
            sendBtn.innerText = "RETRY";
        }
        sendBtn.disabled = false;
    });

    copyBtn.addEventListener('click', () => {
        if (!responseTextarea.value) return;
        navigator.clipboard.writeText(responseTextarea.value).then(() => {
            copyBtn.innerText = "DONE!";
            setTimeout(() => copyBtn.innerText = "COPY", 2000);
        });
    });
});
