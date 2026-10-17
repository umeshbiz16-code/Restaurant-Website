import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Sparkles, Smile, MessageCircle } from "lucide-react";
import { ChatMessage } from "../types";

export default function ChatBox() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      sender: "bot",
      text: "Om Shanti! Welcome to Satvik Events & Caters. I am **Sita**, your dedicated Dining and Event coordinator. All our meals are prepared using pure cow ghee, strictly without onion or garlic. How can I assist you with dining or event bookings today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Sample quick questions
  const quickQuestions = [
    "Is food 100% onion-garlic free?",
    "Tell me about Maharaja Thali.",
    "Catering cost for 50 guests?",
    "How do I track my delivery?"
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessage: ChatMessage = {
      id: "msg-" + Date.now(),
      sender: "user",
      text: textToSend,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      // Package clean message history for Gemini proxy
      const historyPayload = messages.slice(-10).map(msg => ({
        sender: msg.sender,
        text: msg.text
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload
        })
      });

      const data = await response.json();

      const botMessage: ChatMessage = {
        id: "msg-bot-" + Date.now(),
        sender: "bot",
        text: data.response || "Om Shanti. I was momentarily lost in meditation. Could you please repeat that?",
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage: ChatMessage = {
        id: "msg-err-" + Date.now(),
        sender: "bot",
        text: "I apologize, but my connection is slightly unstable right now. We prepare fresh, sacred Indian food with strict hygiene and no onion/garlic! Please retry.",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  // Helper to parse simple markdown bold and bullets
  const renderMessageText = (text: string) => {
    // Simple markdown parsing for rendering clean markdown in standard React JSX
    const lines = text.split("\n");
    return lines.map((line, lineIdx) => {
      let content: React.ReactNode = line;

      // Handle bullet points
      const isBullet = line.trim().startsWith("* ") || line.trim().startsWith("- ");
      if (isBullet) {
        content = line.replace(/^[\s*-]+/, "").trim();
      }

      // Handle simple bold parsing: **text**
      const boldRegex = /\*\*(.*?)\*\*/g;
      if (typeof content === "string" && boldRegex.test(content)) {
        const parts = [];
        let lastIndex = 0;
        let match;
        boldRegex.lastIndex = 0; // reset index

        while ((match = boldRegex.exec(content as string)) !== null) {
          if (match.index > lastIndex) {
            parts.push(content.substring(lastIndex, match.index));
          }
          parts.push(<strong key={match.index} className="font-bold font-serif text-white">{match[1]}</strong>);
          lastIndex = boldRegex.lastIndex;
        }
        if (lastIndex < content.length) {
          parts.push(content.substring(lastIndex));
        }
        content = parts;
      }

      if (isBullet) {
        return (
          <li key={lineIdx} className="ml-4 list-disc text-xs text-gray-300 leading-relaxed mb-1">
            {content}
          </li>
        );
      }

      return (
        <p key={lineIdx} className="text-xs leading-relaxed mb-1.5 last:mb-0 text-gray-300">
          {content}
        </p>
      );
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" id="chat-widget">
      
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-none bg-[#D4AF37] text-black shadow-xl hover:scale-105 transition-transform animate-pulse hover:bg-[#B8962E]"
          id="chat-launcher"
        >
          <MessageCircle className="h-6 w-6 text-black" />
        </button>
      )}

      {/* Expanded Chat Box Window */}
      {isOpen && (
        <div className="w-80 sm:w-96 rounded-none border border-white/10 bg-[#0F0F0F] shadow-2xl flex flex-col h-[500px] max-h-[80vh] overflow-hidden animate-fade-in-up">
          
          {/* Header Banner */}
          <div className="bg-[#121212] border-b border-white/10 px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-none bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                <Smile className="h-5 w-5 text-[#D4AF37]" />
              </div>
              <div>
                <h4 className="text-xs font-serif text-[#D4AF37] flex items-center">
                  <span>Sita</span>
                  <Sparkles className="h-3 w-3 text-[#D4AF37] ml-1.5 animate-pulse" />
                </h4>
                <p className="text-[9px] uppercase tracking-wider text-gray-400 font-medium font-sans">Satvik Coordinator</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="rounded-none p-1 text-gray-400 hover:bg-white/5 hover:text-[#D4AF37] transition-colors"
              id="chat-close-window"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Messages Logs Area */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 bg-[#121212]">
            {messages.map((msg) => {
              const isBot = msg.sender === "bot";
              return (
                <div
                  key={msg.id}
                  className={`flex ${isBot ? "justify-start" : "justify-end"}`}
                >
                  <div className={`max-w-[85%] rounded-none px-4 py-2.5 text-xs shadow-none ${
                    isBot 
                      ? "bg-[#1A1A1A] border border-white/5 text-[#E0E0E0]" 
                      : "bg-[#D4AF37] text-black"
                  }`}>
                    {isBot ? renderMessageText(msg.text) : <p className="font-semibold">{msg.text}</p>}
                    
                    <span className={`text-[8px] mt-1 block text-right font-mono ${isBot ? "text-gray-500" : "text-black/60"}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#1A1A1A] border border-white/5 rounded-none px-4 py-3 flex items-center space-x-1.5">
                  <div className="h-1.5 w-1.5 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="h-1.5 w-1.5 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="h-1.5 w-1.5 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions suggestion pills */}
          {messages.length < 5 && (
            <div className="px-4 py-2 bg-[#1A1A1A] border-t border-white/5 flex flex-wrap gap-1.5">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="bg-transparent border border-white/10 hover:bg-white/5 text-[10px] font-bold text-[#D4AF37] px-2.5 py-1 rounded-none transition-colors uppercase tracking-wider"
                  id={`chat-quick-q-${idx}`}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Chat Form Input */}
          <form onSubmit={handleSubmit} className="border-t border-white/10 p-3 flex items-center space-x-2 bg-[#121212]">
            <input
              type="text"
              placeholder="Ask Sita about thalis or catering..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 rounded-none border border-white/10 bg-black/40 px-3.5 py-2 text-xs text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none placeholder-gray-600"
              id="chat-text-input"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex h-8 w-8 items-center justify-center rounded-none bg-[#D4AF37] text-black shadow-sm hover:bg-[#B8962E] transition-colors disabled:opacity-50"
              id="chat-send-btn"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
