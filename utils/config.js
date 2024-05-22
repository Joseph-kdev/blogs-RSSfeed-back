const { configDotenv } = require("dotenv");

configDotenv()

const GEMINI_API = process.env.GEMINI_KEY;
const PORT = process.env.PORT;

module.exports = {
    PORT,
    GEMINI_API,
}