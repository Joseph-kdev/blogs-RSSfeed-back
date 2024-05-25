const cors = require("cors")
const RSSparser = require("rss-parser")
const express = require("express")
const path = require("path")

const app = express();

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
    try {
        const {key, value} = feedInfo
        const feed = await parser.parseURL(value);
        feedsData[key] = feed.items
    } catch (error) {
        console.error('Error parsing feed', error);
    }
}

const parseFeeds = async() => {
    const parsePromises = feedURLs.map(parseFeed);
    await Promise.all(parsePromises);
}

parseFeeds()

app.use(express.static("dist"))
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.sendFile(path.join(process.cwd(), "dist", "index.html"));
});

app.get('/api/blogs', async(req, res) => {
    try {
        if (Object.keys(feedsData).length === 0) {
            await parseFeeds();
        }
        res.send(feedsData);
    } catch (error) {
        console.error('Error fetching feeds:', error);
        res.status(500).send('Error fetching feeds.');
    }
})


app.post('/api/summaries', async(req, res) => {
    const { actualUrl } = req.body
    const model = genAI.getGenerativeModel({ model: "gemini-pro"})

    const prompt = `Summarize this blog ${actualUrl} in a concise and informative
                    way. In your summary start with the blog's title as a heading.
                    At the end of your summary always include a key takeaways section
                    for the blog.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    res.send(text)
})


const server = app.listen(config.PORT, () => {
    console.log(`server running on port ${config.PORT}`);
})
