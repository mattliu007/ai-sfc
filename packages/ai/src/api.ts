import consola from 'consola'
import type OpenAI from 'openai'
import { baseChatCompletionCreateParams, baseModel, openai } from './config'

export async function getCompletion(msg: string) {
  const chatCompletion = await openai.chat.completions.create({
    ...baseChatCompletionCreateParams,
    messages: [{ role: 'user', content: msg }],
    model: baseModel,
  })

  return chatCompletion.choices
}

export interface SprintFestivalCouplets {
  上联: string
  下联: string
  横批: string
  总结: string
}

export async function getCouplets(couplet: string) {
  const tooltip = [
    '请根据我的提示生成一组春联，包含上联、下联各一句，每句字数在五到十三字之间，并附上一个恰当的横批。',
    '并给出一个字总结。',
    '不需要标点符号，尽量不要使用生僻字。',
    '以下述 JSON 给出：',
    `export interface SprintFestivalCouplets {
  上联: string
  下联: string
  横批: string
  总结: string
}`,
  ]

  const messages: OpenAI.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: tooltip.join('\n'),
    },
  ]

  if (couplet)
    messages.push({ role: 'user', content: `我的提示是：${couplet}` })

  const chatCompletion = await openai.chat.completions.create({
    messages,
    model: 'deepseek-chat',
    max_tokens: 300,
    // stream: true
  })

  consola.debug(chatCompletion)
  return chatCompletion.choices[0].message
}
