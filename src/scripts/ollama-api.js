import { loadExternalModule } from './shared.js';

function roughNumberOfTokensForOllama(messages) {
    // Similar estimation as OpenAI but may need adjustment for Ollama
    const charsPerToken = 4;
    let chars = 0;
    for (const message of messages) {
        chars += message.role.length;
        chars += message.content.length;
    }
    return chars / charsPerToken;
}

async function getResponseFromOllama(parameters, messages) {
    try {
        // Construct the URL using the host parameter
        const host = parameters.ollamaHost || 'http://localhost:11434';
        const url = `${host}/api/chat`;

        // Format the request body for Ollama API
        const requestBody = {
            model: parameters.model,
            messages: messages,
            options: {
                temperature: parameters.temperature,
                num_predict: parameters.maxNewTokens,
                repeat_penalty: parameters.repetitionPenalty + 1.0, // Ollama uses different scale
            }
        };

        // Make the API call
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.error || `HTTP error ${response.status}`);
        }

        const data = await response.json();
        return data.message.content;
    } catch (error) {
        const errorMessage = game.i18n.format('unkenny.llm.ollamaError', { error: error.message || error });
        ui.notifications.error(errorMessage);
        console.error('Ollama API error:', error);
        return;
    }
}

export { getResponseFromOllama, roughNumberOfTokensForOllama };