import { useEffect, useRef, useState } from "react";

type Envelope =
  | { type: "ask" }
  | { type: "token"; data: { msgId: string; text: string } }
  | { type: "done"; data: { msgId: string } }
  | { type: "error"; data: { msgId: string; message: string } };

type Handlers = {
  onToken: (id: string, text: string) => void;
  onDone: (id: string) => void;
  onError: (id: string, message: string) => void;
  onDisconnect?: () => void;
};

type ConnectionStatus = "idle" | "open" | "closed";

const WS_URL = "wss://localhost:3000/api/ws/chat";

export function useWebSocket(handlers: Handlers) {
  const wsRef = useRef<WebSocket | null>(null);
  const handlersRef = useRef(handlers);
  const disposedRef = useRef(false);
  const connectRef = useRef<() => void>(() => {});

  useEffect(() => {
    handlersRef.current = handlers;
  });

  const [status, setStatus] = useState<ConnectionStatus>("idle");

  const closeSocket = (code: number, reason: string) => {
    const ws = wsRef.current;
    if (!ws) return;
    if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
      ws.close(code, reason);
    }
  };

  useEffect(() => {
    disposedRef.current = false;
    let retry = 1000;

    const connect = () => {
      if (disposedRef.current) return;

      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        retry = 1000;
        setStatus("open");
      };

      ws.onmessage = (ev) => {
        const msg = JSON.parse(ev.data) as Envelope;
        switch (msg.type) {
          case "token":
            handlersRef.current.onToken(msg.data.msgId, msg.data.text);
            break;
          case "done":
            handlersRef.current.onDone(msg.data.msgId);
            break;
          case "error":
            handlersRef.current.onError(msg.data.msgId, msg.data.message);
            break;
        }
      };

      ws.onclose = () => {
        setStatus("closed");
        handlersRef.current.onDisconnect?.();
        if (!disposedRef.current) {
          setTimeout(connect, retry);
        }
        retry = Math.min(retry * 2, 30_000);
      };
    };

    connectRef.current = connect;
    connect();

    const onUnload = () => closeSocket(1000, "page unload");
    window.addEventListener("beforeunload", onUnload);

    return () => {
      disposedRef.current = true;
      window.removeEventListener("beforeunload", onUnload);
      closeSocket(1000, "component unmounted");
    };
  }, []);

  const disconnect = () => {
    disposedRef.current = true;
    closeSocket(1000, "user disconnected");
    setStatus("closed");
  };

  const reconnect = () => {
    if (disposedRef.current) {
      disposedRef.current = false;
      connectRef.current();
    }
  };

  const send = (msg: object) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    }
  };

  return { send, status, disconnect, reconnect };
}
