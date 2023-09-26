import OpenAI from "openai";
import { config } from "dotenv";
import express, { response } from "express";
config();

const app = express();
const port = 3000;

const openai = new OpenAI();

const requestGPT = async (content) => {
    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: content }],
        model: "gpt-3.5-turbo",
    });

    const responseContent = completion.choices[0].message.content;
    return responseContent
};

const understandResponse = async (input, options) => {
    const request = `You are given a statement: '${input}' 
    try to understand which option best descrives this statement: '${options.join(
        "', '"
    )}'.
    The important part is that you are required to respond with only the index of the option (from 1 to ${
        options.length
    }).
    No text only one number. If none of the options sufficiently match any of the statements, return a logical response to the statement and prefix it with a '!'.`;
    const response = await requestGPT(request);
    return response
};

app.get("/api", async (req, res) => {
    const { input, options: optionsString } = req.query;
    const options = optionsString.split(",");
    const conclusion = await understandResponse(input, options);
    res.send(conclusion)
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
