import type { NextApiRequest, NextApiResponse } from 'next'
import openai from '@/lib/openaiClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const prompt = req.body.prompt || 'Say something smart.'

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    })

    res.status(200).json({ result: completion.choices[0].message.content })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}
