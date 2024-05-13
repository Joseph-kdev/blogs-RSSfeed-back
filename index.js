import cors from "cors";
import RSSparser from "rss-parser";
import express from "express";


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

app.get('/', (req, res) => {
    res.send(feedsData)
})

const server = app.listen('3001', () => {
    console.log('server running');
})
