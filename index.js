const { Client, MessageAttachment, Intents } = require('discord.js');
const fetch = require('node-fetch');
const http = require('http');
require('dotenv').config();

const client = new Client({ 
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

const PREFIXES = ['meow', 'prr', 'prrr', 'hss', '🐱', '🐈'];

client.once('ready', () => {
    console.log('Bot is online!');
    scheduleCatPicture();
});

client.on('messageCreate', (message) => {
    if (message.author.bot) return;

    const content = message.content.toLowerCase();
    const botMentioned = message.mentions.has(client.user);

    if (PREFIXES.some(prefix => content.includes(prefix)) || botMentioned) {
        sendCatPicture(message.channel);
    }
});

async function scheduleCatPicture() {
    const channel = client.channels.cache.find(ch => ['meow', 'cat', 'cat pics', 'kitten pics', 'gen'].includes(ch.name.toLowerCase()));
    if (channel) {
        await sendCatPicture(channel);
    }
    setTimeout(scheduleCatPicture, 12 * 60 * 60 * 1000); // 12 hours
}

async function sendCatPicture(channel) {
    const imageUrl = await getRandomCatImage();
    const fileName = imageUrl.endsWith('.gif') ? imageUrl.split('/').pop() : 'cat_picture.jpg';
    const attachment = new MessageAttachment(imageUrl, fileName);
    channel.send({ files: [attachment] });
}

async function getRandomCatImage() {
    const response = await fetch('https://api.thecatapi.com/v1/images/search', {
        headers: {
            'x-api-key': process.env.DOG_API_KEY
        }
    });
    const data = await response.json();
    return data[0].url;
}

client.login(process.env.DISCORD_TOKEN);

const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Bot is running!');
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
