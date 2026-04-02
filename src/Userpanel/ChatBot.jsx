
import React, { useState, useEffect, useRef } from "react";
import API, { chatWithBot } from "../api";

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hi! I'm your Lost & Found Assistant. How can I help you today?" },
  ]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const message = userInput.trim();
    if (!message) return;

    setMessages((prev) => [...prev, { sender: "user", text: message }]);
    setUserInput("");
    setLoading(true);

    try {
      const res = await chatWithBot(message);
      const botReply = res.data.reply || "⚠️ Sorry, I couldn't understand that.";
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Chatbot not responding. Try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <>
      
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="btn btn-primary rounded-circle position-fixed bottom-0 end-0 m-4 shadow"
          style={{
            width: "60px",
            height: "60px",
            fontSize: "24px",
            zIndex: 1000,
            background: "linear-gradient(135deg, #2575fc, #6a11cb)",
            border: "none",
          }}
        >
          💬
        </button>
      )}

     
      {open && (
        <div
          className="position-fixed bottom-0 end-0 m-4 shadow-lg rounded-4 overflow-hidden bg-white d-flex flex-column"
          style={{
            width: "380px",
            height: "500px",
            fontFamily: "Poppins, sans-serif",
            zIndex: 1001,
            animation: "fadeIn 0.4s ease-in-out",
          }}
        >
          
          <div
            className="d-flex justify-content-between align-items-center px-3 py-3 text-white fw-semibold"
            style={{
              background: "linear-gradient(135deg, #2575fc, #6a11cb)",
              borderBottom: "2px solid #1d5fd1",
              letterSpacing: "0.5px",
            }}
          >
            <span>🤖 Lost & Found Assistant</span>
            <button
              className="btn btn-sm btn-light fw-bold rounded-circle"
              onClick={() => setOpen(false)}
              style={{
                width: "28px",
                height: "28px",
                lineHeight: "14px",
                fontSize: "18px",
                padding: "0",
              }}
            >
              ×
            </button>
          </div>

         
          <div
            className="flex-grow-1 p-3"
            style={{ overflowY: "auto", backgroundColor: "#f9f9f9" }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`d-flex mb-3 ${
                  msg.sender === "user" ? "justify-content-end" : "justify-content-start"
                }`}
              >
                {msg.sender === "bot" && (
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/4712/4712100.png"
                    alt="bot"
                    className="me-2"
                    style={{ width: "30px", height: "30px", borderRadius: "50%" }}
                  />
                )}
                <div
                  className={`px-3 py-2 rounded-4 shadow-sm ${
                    msg.sender === "user"
                      ? "bg-primary text-white"
                      : "bg-light text-dark"
                  }`}
                  style={{
                    maxWidth: "80%",
                    lineHeight: "1.4",
                    animation: "fadeIn 0.3s ease-in-out",
                  }}
                >
                  {msg.text}
                  <div className="text-muted small mt-1" style={{ fontSize: "0.7rem" }}>
                    {new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="d-flex justify-content-start mb-3">
                <div className="px-3 py-2 rounded-4 bg-light text-muted">
                  <span className="typing">
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef}></div>
          </div>

         
          <div className="d-flex align-items-center p-3 border-top bg-white">
            <input
              type="text"
              className="form-control rounded-pill bg-light border-0 me-2"
              placeholder="Type your message..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button
              className="btn btn-primary rounded-circle px-3 py-2"
              onClick={handleSend}
            >
              ➤
            </button>
          </div>
        </div>
      )}

     
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .typing span {
            animation: blink 1.5s infinite;
          }
          .typing span:nth-child(2) {
            animation-delay: 0.3s;
          }
          .typing span:nth-child(3) {
            animation-delay: 0.6s;
          }
          @keyframes blink {
            0%, 80%, 100% { opacity: 0; }
            40% { opacity: 1; }
          }
        `}
      </style>
    </>
  );
};

export default ChatBot;
