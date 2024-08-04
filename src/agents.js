const axios = require('axios');
require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });

const apiUrl = process.env.API_URL || 'http://localhost:11434/api/generate';
const modelName = process.env.MODEL_NAME || 'llama3.1:latest';

async function generateText(prompt) {
    try {
        const response = await axios.post(apiUrl, {
            model: modelName,
            prompt: prompt,
            stream: false,
            max_tokens: 500,
            temperature: 0.8
        });
        return response.data.response;
    } catch (error) {
        console.error('Error generating text:', error);
        throw error;
    }
}

async function alternateHistoryAgent(userIdea = null) {
    let prompt;
    if (userIdea) {
        prompt = `Create a brief description of a parallel universe based on the following user idea: "${userIdea}". Expand on this idea and specify:
1. The divergence point (what historical event changed or what aspect of reality is different)
2. A brief overview of how this change affected the course of history
3. The current year in this universe
4. Two major differences in technology, culture, or geopolitics compared to our universe

Keep your response concise, focusing on the most impactful changes.`;
    } else {
        prompt = `Create a brief description of a parallel universe where a major historical event had a different outcome. Specify:
1. The divergence point (what historical event changed)
2. A brief overview of how this change affected the course of history
3. The current year in this universe
4. Two major differences in technology, culture, or geopolitics compared to our universe

Keep your response concise, focusing on the most impactful changes.`;
    }
    return generateText(prompt);
}

async function newsReporterAgent(universeDescription) {
    const prompt = `You are a news reporter in the following parallel universe:

${universeDescription}

Based on this alternate history, report on three current events in this universe. Each news item should:
1. Have a catchy headline
2. Contain a brief 2-3 sentence summary of the news
3. Reflect the unique aspects of this parallel universe
4. Be diverse in topic (e.g., politics, technology, culture, environment)

Present your report as a news bulletin, maintaining a professional journalistic tone while capturing the essence of this alternate reality.`;
    return generateText(prompt);
}

async function commentaryAgent(universeDescription, newsReport) {
    const prompt = `You are a multiversal political commentator with knowledge of various parallel universes. You've just received this report from an alternate universe:

Universe Description:
${universeDescription}

News Report:
${newsReport}

Provide a brief commentary on these events. Your commentary should:
1. Analyze one major difference between this universe and our own
2. Speculate on potential future developments in this alternate reality
3. Offer a thought-provoking question about the nature of historical change

Keep your commentary concise and insightful, suitable for a multiversal audience.`;
    return generateText(prompt);
}

module.exports = {
    alternateHistoryAgent,
    newsReporterAgent,
    commentaryAgent
};