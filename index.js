const cors = require("cors")
const RSSparser = require("rss-parser")
const express = require("express")


const genAI = require("./gemini-start")
const config = require("./utils/config")

const feedURLs = [
    {   
        key: "bytebytego",
        value:"https://blog.bytebytego.com/feed",
    },
    {
        key: "cssTricks",
        value:"https://css-tricks.com/feed",
    },
    {
        key: "liveSec",
        value:"https://www.welivesecurity.com/feed"
    },
    {
        key: "logRocket",
        value:"https://blog.logrocket.com/feed",
    },
    {
        key: "smashingMag",
        value:"https://www.smashingmagazine.com/feed"
    },
    {
        key: "codingHorror",
        value:"https://blog.codinghorror.com/rss"
    },
]

const parser = new RSSparser();
const feedsData = {}

const parseFeed = async feedInfo => {
    const {key, value} = feedInfo
    const feed = await parser.parseURL(value);
    feedsData[key] = feed.items
}

const parseFeeds = async() => {
    for(const feedInfo of feedURLs) {
        await parseFeed(feedInfo)
    }
}

parseFeeds()

const app = express();
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send(feedsData)
})


app.post('/summaries', async(req, res) => {
    const { actualUrl } = req.body
    const model = genAI.getGenerativeModel({ model: "gemini-pro"})

    const prompt = `Summarize this blog ${actualUrl} in a concise and informative
                    way. In your summary start with the blog's title as a heading.
                    At the end of your summary always include a key takeaways section
                    for the blog. Also below this add a daily joke section and display 
                    it with italics formatting.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    res.send(text)
})

async function run() {
    const model = genAI.getGenerativeModel({ model: "gemini-pro"})

    const prompt = "Summarize this blog: https://blog.bytebytego.com/p/cloudflares-trillion-message-kafka"

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    console.log(text);
}

// run()


const server = app.listen(config.PORT, () => {
    console.log('server running');
})
