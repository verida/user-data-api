import Groq from "groq-sdk"
import Axios from 'axios'

const llmUri = 'http://127.0.0.1:11434/api/generate'
const GROQ_MODEL = 'mixtral-8x7b-32768' // 'llama3-8b-8192' // 'llama3-70b-8192' // 'llama3-8b-8192' //'llama-3.1-8b-instant' //'llama3-70b-8192' // 'llama3-8b-8192'
const GROQ_KEY = process.env.GROQ_KEY

const groq = new Groq({ apiKey: GROQ_KEY });

export class LLMServices {

    public async groq(query: string, model: string = GROQ_MODEL) {
        const response = await groq.chat.completions.create({
            messages: [
              {
                role: "user",
                content: query,
              },
            ],
            model: GROQ_MODEL,
          });
          return response.choices[0]?.message?.content || ''
    }

    public async llama(prompt: string, model: string = 'llama3') {
        const serverResponse = await Axios.post(llmUri, {
            model,
            prompt,
            stream: false
        })

        return serverResponse.data.response
    }
}