const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const MultiverseSocialMediaSimulator = require('./socialMediaSimulator');
const { alternateHistoryAgent, newsReporterAgent, commentaryAgent } = require('./agents');

const PORT = 3000;

const server = http.createServer(async (req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        try {
            const content = await fs.readFile(path.join(__dirname, '..', 'public', 'index.html'), 'utf8');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        } catch (err) {
            res.writeHead(500);
            res.end('Server Error');
        }
    } else if (req.method === 'POST' && req.url === '/generate-news') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            try {
                const { userIdea } = JSON.parse(body);
                let universeDescription;
                if (userIdea) {
                    universeDescription = await alternateHistoryAgent(userIdea);
                } else {
                    universeDescription = await alternateHistoryAgent();
                }
                const newsReport = await newsReporterAgent(universeDescription);
                
                const simulator = new MultiverseSocialMediaSimulator();
                const rawSocialMediaContent = await simulator.generateSocialMediaContent(universeDescription, newsReport);
                const socialMedia = simulator.parseAndFormatContent(rawSocialMediaContent);
                
                const commentary = await commentaryAgent(universeDescription, newsReport);

                const response = JSON.stringify({
                    universeDescription,
                    newsReport,
                    socialMedia,
                    commentary
                });

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(response);
            } catch (err) {
                console.error('Error generating news:', err);
                res.writeHead(500);
                res.end('Error generating news');
            }
        });
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});