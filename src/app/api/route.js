import { pipeline } from 'node:stream/promises';
import { NextResponse } from "next/server"
import { OpenAIStream, StreamingTextResponse } from 'ai'

// app/api/route.js 👈🏽
import OpenAI from "openai"

const OPENAI_APIKEY = process.env.OPENAI_SECRET_KEY
const openai = new OpenAI({ apiKey: OPENAI_APIKEY })


// To handle a GET request to /api
export async function GET(request) {
    // Do whatever you want
    return NextResponse.json({ message: "Hello World" }, { status: 200 })
}

// To handle a POST request to /api
export async function POST(request) {
    // Do whatever you want
    const { prompt } = await request.json()
    if (!prompt) {
        return NextResponse.json({ status: 'Please include a prompt' }, { status: 500 })
    }

    try {
        const res = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are an experienced professional cover letter writing assistant. In your response, please only return the cover letter based off of the users prompt and and no extra fluff. Please always address the reader with the phrase 'To Whom it may concern. Thanks!" },
                { role: "user", content: prompt },
            ],
            model: "gpt-3.5-turbo",
            stream: true
        })

        const stream = OpenAIStream(res)
        return new StreamingTextResponse(stream)

    } catch (err) {
        console.log('Failed to create completion', err.message)
        return NextResponse.json({ status: err.message }, { status: 500 })
    }
}


async function sendPrompt(prompt) {
    const completion = await openai.chat.completions.create({
        messages: [
            { role: "system", content: "You are an experienced professional cover letter writing assistant. In your response, please only return the cover letter based off of the users prompt and and no extra fluff." },
            { role: "user", content: prompt },
        ],
        model: "gpt-3.5-turbo",
        stream: true
    })

    console.log(completion.choices[0])
}