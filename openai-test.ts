const OpenAI = require("openai");
const dotenv = require('dotenv');
dotenv.config();

const openai = new OpenAI({apiKey: process.env.OPEN_AI_API_KEY});

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "Define the word: antelope" }],
    model: "gpt-3.5-turbo",
  });

  console.log(completion.choices[0]);
}

main();