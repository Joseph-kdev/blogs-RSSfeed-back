const { GoogleGenerativeAI } = require("@google/generative-ai");

const config = require("./utils/config")
const genAI = new GoogleGenerativeAI(config.GEMINI_API)

module.exports = genAI
