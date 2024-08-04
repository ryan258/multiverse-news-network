const axios = require('axios');
require('dotenv').config();

class MultiverseSocialMediaSimulator {
    constructor() {
        this.apiUrl = process.env.API_URL || 'http://localhost:11434/api/generate';
        this.modelName = process.env.MODEL_NAME || 'llama3.1:latest';
    }

    async generateSocialMediaContent(universeDescription, newsReport) {
        const prompt = `Based on the following alternate universe description and news report, generate a set of social media posts and reactions that might occur in this universe. Include 3 posts with their respective reactions:

Universe Description:
${universeDescription}

News Report:
${newsReport}

For each post, provide:
1. The username of the poster (fictional)
2. The content of the post
3. The number of likes, shares, and comments
4. 2-3 sample comments with usernames

Ensure the posts and reactions reflect the unique aspects of this alternate universe.`;

        try {
            const response = await axios.post(this.apiUrl, {
                model: this.modelName,
                prompt: prompt,
                stream: false,
                max_tokens: 500,
                temperature: 0.8
            });

            return response.data.response;
        } catch (error) {
            console.error('Error generating social media content:', error);
            throw error;
        }
    }

    parseAndFormatContent(content) {
        // This method would parse the AI-generated content and format it into a structured object
        // For simplicity, we'll just return the raw content for now
        return content;
    }
}

module.exports = MultiverseSocialMediaSimulator;

// Example usage:
/*
async function runSocialMediaSimulation(universeDescription, newsReport) {
    const simulator = new MultiverseSocialMediaSimulator();
    const rawContent = await simulator.generateSocialMediaContent(universeDescription, newsReport);
    const formattedContent = simulator.parseAndFormatContent(rawContent);
    console.log(formattedContent);
}

// Call this function with the universe description and news report from your main script
*/