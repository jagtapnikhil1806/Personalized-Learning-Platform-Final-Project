import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion, AnimatePresence } from "framer-motion";
import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";

const GeminiChatbot = ({ isLoggedIn }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Initialize Gemini with latest configuration
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_APP_GEMINI_API_KEY);
  
  // Use the correct model name (as of July 2024)
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-pro-latest" // Updated model name
  });

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Updated API call format
      const result = await model.generateContent({
        contents: [{
          parts: [{
            text: input
          }]
        }]
      });
      
      const response = await result.response;
      const text = response.text();
      const botMessage = { text, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages((prev) => [
        ...prev, 
        { 
          text: "Service temporarily unavailable. Please try again later.",
          sender: "bot" 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) return null;

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-pink-500 text-white p-4 rounded-full shadow-lg cursor-pointer z-50"
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes size={24} /> : <FaRobot size={24} />}
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 right-6 w-80 bg-white dark:bg-richblack-800 rounded-lg shadow-xl z-50 flex flex-col"
            style={{ height: "60vh" }}
          >
            <div className="p-4 bg-gradient-to-r from-blue-500 to-pink-500 text-white rounded-t-lg">
              <h3 className="font-bold">Gemini Assistant</h3>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`mb-3 p-3 rounded-lg max-w-[80%] ${
                    msg.sender === "user"
                      ? "bg-blue-100 dark:bg-blue-900 ml-auto"
                      : "bg-gray-100 dark:bg-richblack-700 mr-auto"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-richblack-700 p-3 rounded-lg max-w-[80%]">
                    <div className="flex space-x-2">
                      {[...Array(3)].map((_, i) => (
                        <div 
                          key={i}
                          className="w-2 h-2 rounded-full bg-gray-400"
                          style={{ 
                            animation: `bounce 1.5s infinite ${i * 0.2}s`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-gray-200 dark:border-richblack-600 flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 p-2 rounded-l-lg border border-gray-300 dark:bg-richblack-700 dark:border-richblack-600 focus:outline-none"
                disabled={loading}
              />
              <button
                onClick={handleSendMessage}
                disabled={loading}
                className="bg-gradient-to-r from-blue-500 to-pink-500 text-white p-2 rounded-r-lg disabled:opacity-50"
              >
                <FaPaperPlane />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </>
  );
};

export default GeminiChatbot;