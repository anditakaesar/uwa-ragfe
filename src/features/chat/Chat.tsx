import { Button, TextArea } from "@carbon/react"
import { Send } from "@carbon/icons-react"
import { marked } from "marked"
import './chat.scss'
import React, { useEffect, useRef, useState } from "react"
import { chatService } from "../../services/chatService"

interface ChatMessage {
  type: "prompt" | "response"
  text: string
  status: "loading" | "done"
}

export const Chat = () => {
  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isThinking, setIsThinking] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  const sendMessage = async () => {
    const text = prompt.trim()
    if (!text || isThinking) return

    const newMessage: ChatMessage = {
      type: 'prompt',
      text,
      status: 'done'
    }
    setMessages((prev) => [...prev, newMessage])
    setPrompt('')
    setIsThinking(true)

    const response = await chatService.sendPrompt(text)

    setMessages((prev) => [
      ...prev,
      {
        type: 'response',
        text: response.data.message,
        status: 'done'
      }
    ])
    setIsThinking(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="chat-page">
      <div className="chat-container">
        {messages.length === 0 && !isThinking ? (
          <div className="chat-empty">
            <p className="chat-empty-title">How can I help you today?</p>
            <p className="chat-empty-hint">Type a prompt below and press Enter to send.</p>
          </div>
        ) : (
          <>
            {messages.map((message, i) => (
              <div
                key={i}
                className={`chat-item chat-item--${message.type}`}
              >
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
            ))}
            {isThinking && (
              <div className="chat-item chat-item--response">
                <div className="chat-bubble chat-bubble--loading">
                  <span className="chat-dot" />
                  <span className="chat-dot" />
                  <span className="chat-dot" />
                </div>
              </div>
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
            disabled={!prompt.trim() || isThinking}
          />
        </div>
      </div>
    </div>
  )
}
