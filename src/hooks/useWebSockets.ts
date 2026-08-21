import { useEffect, useRef, useState } from "react";

type Envelope = 
  { type: "ask" } | 
  { type: "token", data: {msgId: string, text: string} } | 
  { type: "done", data: {msgId: string} } |
  { type: "error", data: {msgId: string, message: string}}
type Handlers = { 
  onToken: (id: string, text: string) => void 
  onDone: (id: string) => void
  onError: (id: string, message: string) => void 
}

export function useWebSocket(handlers: Handlers) {
  const wsRef = useRef<WebSocket | null>(null)
  const handlersRef = useRef(handlers)
  handlersRef.current = handlers

  const [status, setStatus] = useState<"idle" | "open" | "closed">("idle")

  useEffect(() => {
    // const url = `${location.protocol === "https:" ? "wss:" : "ws:"}//${location.host}/api/ws/chat`
    const url = `wss://localhost:3000/api/ws/chat`
    let disposed = false
    let retry = 1000

    const connect = () => {
      const ws = new WebSocket(url)
      wsRef.current = ws
      ws.onopen = () => {
        retry = 1000
        setStatus("open")
      }

      ws.onmessage = (ev) => {
        const msg = JSON.parse(ev.data) as Envelope
        switch (msg.type) {
          case "token": 
            handlersRef.current.onToken(msg.data.msgId, msg.data.text)
            break
          case "done":
            handlersRef.current.onDone(msg.data.msgId)
            break
          case "error":
            handlersRef.current.onError(msg.data.msgId, msg.data.message)
            break
        }
      }

      ws.onclose = () => {
        setStatus("closed")
        if (!disposed) {
          setTimeout(connect, retry)
        }
        retry = Math.min(retry * 2, 30_000)
      }
    }

    // start connection
    connect()

    return () => {
      disposed = true
      wsRef.current?.close(1000)
    }
  }, [])

  const send = (msg: object) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg))
    }
  }

  return { send, status }
}