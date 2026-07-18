import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react'
import { getChatbotReply } from '../chatbot/engine'
import type { ChatMessage } from '../chatbot/types'

interface PortfolioAssistantProps {
  open: boolean
  onClose: () => void
}

const openingSuggestions = [
  'Tell me about yourself',
  'What are your strongest skills?',
  'Show me your selected projects',
  'How can I contact you?',
]

function createMessage(role: ChatMessage['role'], text: string, intent?: string, confidence?: number): ChatMessage {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    role,
    text,
    intent,
    confidence,
    createdAt: Date.now(),
  }
}

export function PortfolioAssistant({ open, onClose }: PortfolioAssistantProps) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage(
      'assistant',
      "Hello, I’m Kottu Saikumar’s portfolio assistant. Ask me about his experience, skills, selected or additional projects, availability, and contact details.",
      'welcome',
      1,
    ),
  ])
  const [suggestions, setSuggestions] = useState(openingSuggestions)
  const dialogRef = useRef<HTMLElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const messageEndRef = useRef<HTMLDivElement>(null)
  const questionCount = useMemo(() => messages.filter((message) => message.role === 'user').length, [messages])

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    requestAnimationFrame(() => inputRef.current?.focus())

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), a[href]'),
      )
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.documentElement.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, open])

  useEffect(() => {
    if (open) messageEndRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' })
  }, [messages, open])

  const askQuestion = (rawQuestion: string) => {
    const question = rawQuestion.trim()
    if (!question) return
    const reply = getChatbotReply(question)
    setMessages((current) => [
      ...current,
      createMessage('user', question),
      createMessage('assistant', reply.text, reply.intent, reply.confidence),
    ])
    setSuggestions(reply.suggestions?.slice(0, 3) ?? openingSuggestions.slice(0, 3))
    setInput('')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    askQuestion(input)
  }

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') onClose()
  }

  if (!open) return null

  return (
    <div className="assistant-layer">
      <button className="assistant-backdrop" type="button" onClick={onClose} aria-label="Close portfolio assistant" />
      <section
        ref={dialogRef}
        className="assistant-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="assistant-title"
        data-lenis-prevent=""
        onWheel={(event) => event.stopPropagation()}
        onTouchMove={(event) => event.stopPropagation()}
      >
        <header className="assistant-header">
          <div>
            <p className="assistant-eyebrow"><span aria-hidden="true" /> Recruiter assistant</p>
            <h2 id="assistant-title">Ask about <em>my work.</em></h2>
            <p>{questionCount ? `${questionCount} question${questionCount === 1 ? '' : 's'} asked` : 'Local knowledge · no API required'}</p>
          </div>
          <button className="assistant-close" type="button" onClick={onClose} aria-label="Close portfolio assistant">×</button>
        </header>

        <div className="assistant-messages" aria-live="polite" aria-relevant="additions" data-lenis-prevent="">
          {messages.map((message) => (
            <article className={`assistant-message ${message.role}`} key={message.id}>
              <span className="assistant-avatar" aria-hidden="true">{message.role === 'assistant' ? 'KS' : 'You'}</span>
              <p>{message.text}</p>
            </article>
          ))}
          <div ref={messageEndRef} />
        </div>

        <div className="assistant-suggestions" aria-label="Suggested questions">
          {suggestions.map((suggestion) => (
            <button type="button" onClick={() => askQuestion(suggestion)} key={suggestion}>{suggestion}</button>
          ))}
        </div>

        <form className="assistant-input" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="portfolio-assistant-question">Ask a question about Kottu Saikumar</label>
          <input
            ref={inputRef}
            id="portfolio-assistant-question"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Ask about skills, projects, experience, or contact"
            autoComplete="off"
          />
          <button type="submit" disabled={!input.trim()} aria-label="Send question"><span>Send</span><b aria-hidden="true">↗</b></button>
        </form>
      </section>
    </div>
  )
}
