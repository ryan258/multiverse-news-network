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

For each post, provide the following in a structured format:
1. USERNAME: The username of the poster (fictional)
2. POST: The content of the post
3. LIKES: Number of likes
4. SHARES: Number of shares
5. COMMENTS: Number of comments
6. REACTIONS: 2-3 sample comments with usernames

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
        const posts = [];
        const postRegex = /USERNAME: (.*?)\nPOST: (.*?)\nLIKES: (\d+)\nSHARES: (\d+)\nCOMMENTS: (\d+)\nREACTIONS:([\s\S]*?)(?=\n\nUSERNAME:|$)/g;
        const commentRegex = /(\w+): (.*)/g;

        let match;
        while ((match = postRegex.exec(content)) !== null) {
            const [, username, post, likes, shares, comments, reactionsRaw] = match;
            const reactions = [];

            let commentMatch;
            while ((commentMatch = commentRegex.exec(reactionsRaw)) !== null) {
                reactions.push({
                    username: commentMatch[1],
                    comment: commentMatch[2].trim()
                });
            }

            posts.push({
                username: username.trim(),
                post: post.trim(),
                likes: parseInt(likes),
                shares: parseInt(shares),
                comments: parseInt(comments),
                reactions: reactions
            });
        }

        return posts;
    }

    formatPostsForDisplay(posts) {
        return posts.map(post => `
            User: ${post.username}
            Post: "${post.post}"
            Likes: ${post.likes} | Shares: ${post.shares} | Comments: ${post.comments}
            
            Top Reactions:
            ${post.reactions.map(reaction => `- ${reaction.username}: "${reaction.comment}"`).join('\n')}
            
            ${'-'.repeat(50)}
        `).join('\n');
    }
}

module.exports = MultiverseSocialMediaSimulator;

// Example usage:
/*
async function runSocialMediaSimulation(universeDescription, newsReport) {
    const simulator = new MultiverseSocialMediaSimulator();
    const rawContent = await simulator.generateSocialMediaContent(universeDescription, newsReport);
    const parsedPosts = simulator.parseAndFormatContent(rawContent);
    const formattedDisplay = simulator.formatPostsForDisplay(parsedPosts);
    console.log(formattedDisplay);
    return parsedPosts;  // Return structured data for potential further use
}
*/