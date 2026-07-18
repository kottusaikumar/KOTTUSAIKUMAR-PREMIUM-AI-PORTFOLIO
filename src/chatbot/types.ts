export type ChatRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: ChatRole
  text: string
  intent?: string
  confidence?: number
  createdAt: number
}

export interface ChatbotReply {
  text: string
  intent: string
  confidence: number
  suggestions?: string[]
}

export interface IntentRule {
  id: string
  patterns: string[]
  keywords?: string[]
  excludes?: string[]
  answer: string | (() => string)
  priority: number
}
