import { Button, TextArea } from "@carbon/react"
import { Send } from "@carbon/icons-react"
import { marked } from "marked"
import './chat.scss'
import React, { useEffect, useRef, useState } from "react"
// import { chatService } from "../../services/chatService"
import { useWebSocket } from "../../hooks/useWebSockets"

interface ChatMessage {
  id: string
  type: "prompt" | "response"
  text: string
  status: "loading" | "done" | "failed"
}

export const ChatWs = () => {
  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)
  const { send, status } = useWebSocket({
    onToken: (msgId, text) => {
      setMessages(
        prev => prev.map(
          m => m.id === msgId ? { ...m, text: m.text + text } : m
        )
      )
    },
    onDone: (msgId) => {
      setMessages(
        prev => prev.map(
          m => m.id === msgId ? { ...m, status: "done" } : m
        )
      )
    },
    onError: (msgId, message) => {
      console.error(`Chat message ${msgId} failed:`, message)
      setMessages(
        prev => prev.map(
          m => m.id === msgId ? { ...m, status: "failed" } : m
        )
      )
    }
  })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // via websocket
  const sendMessage = () => {
    if (!prompt.trim()) return

    const qId = crypto.randomUUID()
    const msgId = crypto.randomUUID()
    setMessages(prev => [
      ...prev,
      { id: qId, status: "done", type: "prompt", text: prompt },
      { id: msgId, status: "loading", type: "response", text: "" },
    ])
    setPrompt('')
    send({ type: "ask", data: { prompt, msgId } })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const isLoading = messages.some(m => m.status === 'loading')
  return (
    <div className="chat-page">
      <div className="chat-container">
        {messages.length === 0 ? (
          <div className="chat-empty">
            <p className="chat-empty-title">How can I help you today?</p>
            <p className="chat-empty-hint">Type a prompt below and press Enter to send.</p>
          </div>
        ) : (
          <>
            {messages.map((message, i) =>
              message.type === 'response' && message.status === 'loading' && !message.text ? (
                <div key={i} className="chat-item chat-item--response">
                  <div className="chat-bubble chat-bubble--loading">
                    <span className="chat-dot" />
                    <span className="chat-dot" />
                    <span className="chat-dot" />
                  </div>
                </div>
              ) : (
                <div key={i} className={`chat-item chat-item--${message.type}`}>
                  <div className="chat-bubble">
                    {message.type === 'response' ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: marked.parse(message.text) as string }}
                      />
                    ) : (
                      message.text
                    )}
                  </div>
                </div>
              )
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="input-container">
        <div className="input-box">
          <TextArea
            className="prompt-input"
            id="prompt1"
            labelText=""
            placeholder="Type your prompt... (Enter to send, Shift+Enter for newline)"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={2}
          />
          <Button
            className="send-button"
            renderIcon={Send}
            iconDescription="Send"
            kind="primary"
            size="md"
            hasIconOnly
            onClick={sendMessage}
            disabled={status !== "open" || isLoading}
          />
        </div>
      </div>
    </div>
  )
}
