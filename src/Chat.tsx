"use client";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface ChatMessage {
  userId: string;
  userName: string;
  message: string;
  room?: string;
}


const SOCKET_URL = "http://localhost:5000";

export default function Chat() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("main");

  useEffect(() => {
    const newSocket: Socket = io(SOCKET_URL, { transports: ["websocket"] });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected:", newSocket.id);
      newSocket.emit("joinRoom", room);
    });

    newSocket.on("receive", (data: ChatMessage) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [room]);

  const handleSend = () => {
    if (!message.trim() || !userName.trim() || !socket?.id) return;

    const chatMessage: ChatMessage = {
      userId: socket.id,
      userName,
      message,
      room,
    };

    socket.emit("send", chatMessage);
    setMessage("");
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "2rem auto",
        padding: "1rem",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0 0 8px rgba(0,0,0,0.1)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
        Real-Time Chat
      </h2>

      <input
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="Your name"
        style={{
          width: "100%",
          padding: "0.5rem",
          marginBottom: "0.5rem",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />

      <input
        type="text"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        placeholder="Room name"
        style={{
          width: "100%",
          padding: "0.5rem",
          marginBottom: "0.5rem",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />

      <div
        style={{
          height: "250px",
          overflowY: "auto",
          background: "#f9f9f9",
          border: "1px solid #eee",
          borderRadius: "4px",
          padding: "0.5rem",
          marginBottom: "0.5rem",
        }}
      >
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.userName}:</strong> {msg.message}
          </div>
        ))}
      </div>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        style={{
          width: "100%",
          padding: "0.5rem",
          marginBottom: "0.5rem",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />

      <button
        onClick={handleSend}
        style={{
          width: "100%",
          padding: "0.5rem",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Send
      </button>
    </div>
  );
}
