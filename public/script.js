document.getElementById('chat-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userInput = document.getElementById('user-input');
    const systemInstruction = document.getElementById('system-instruction');
    const fileInput = document.getElementById('file-input');
    const responseArea = document.getElementById('response-area');

    // Add user message to chat history
    addMessageToHistory(userInput.value, true);
    
    const formData = new FormData();
    formData.append('text', userInput.value);
    formData.append('systemInstruction', systemInstruction.value);
    formData.append('sessionId', sessionId);
    
    if (fileInput.files[0]) {
        formData.append('file', fileInput.files[0]);
    }

    responseArea.innerHTML = 'Thinking...\n';
    let responseText = '';
    
    try {
        const response = await fetch('/analyze', {
            method: 'POST',
            // Remove the Content-Type header to let the browser set it correctly for FormData
            body: formData // Remove the Content-Type header to let the browser set it
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(line.slice(6));
                        if (data.error) {
                            responseArea.innerHTML += `Error: ${data.error}\n`;
                        } else {
                            responseText += data.text;
                            // Preserve formatting while streaming
                            responseArea.innerHTML = responseText.replace(/\n/g, '<br>');
                        }
                    } catch (e) {
                        console.error('Failed to parse chunk:', e);
                    }
                }
            }
        }

        // Add bot response to chat history
        if (responseText) {
            addMessageToHistory(responseText, false);
            responseArea.innerHTML = '';
        }
        
    } catch (error) {
        console.error('Error:', error);
        responseArea.innerHTML = `Error: ${error.message}`;
    }
    
    userInput.value = '';
    fileInput.value = '';
});

// Move sessionId outside event listener to maintain same session
const sessionId = Date.now().toString();
const chatHistory = document.getElementById('chat-history');

function addMessageToHistory(text, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${isUser ? 'user-message' : 'bot-message'}`;
    
    // Preserve formatting by replacing newlines with <br> tags
    const formattedText = text.replace(/\n/g, '<br>');
    messageDiv.innerHTML = formattedText;
    
    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}