import OpenAI from "openai";
import { config } from "dotenv"
config()

const openai = new OpenAI();

const requestGPT = async (content) => {
    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: content }],
        model: "gpt-3.5-turbo",
    });

    return completion.choices[0].message.content
}

const understandResponse = async (input, options) => {
    const request = `You are given a statement: '${input}' 
    try to understand which option best descrives this statement: '${options.join("', '")}'.
    The important part is that you are required to respond with only the index of the option (from 1 to ${options.length}).
    No text only one number. If none of the options sufficiently match any of the statements return just '0'.`
    console.log(request)
    const response = await requestGPT(request)
    const optionIndex = parseInt(response)
    return optionIndex !== 0 ? options[optionIndex - 1] : "No option matches the input."
}

const conclusion = await understandResponse(``, [
    "The murderer is Bob",
    "The person is tired",
    "The murderer is Alice",
    "The person is hungry",
    "Life is hard"
])
console.log(conclusion)