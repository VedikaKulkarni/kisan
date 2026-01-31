import React, { useState, useRef, useEffect, useContext } from "react";
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext";

const ChatBot = () => {
    const { user } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Namaste! I am KisanSetu AI. Ask me about **Our Website**, **Mandi prices**, **Weather**" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);

    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    // Voice Output (Text-to-Speech)
    const speak = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Stop previous
            const utterance = new SpeechSynthesisUtterance(text);
            // utterance.lang = 'hi-IN'; // Could dynamic based on language detection
            window.speechSynthesis.speak(utterance);
        }
    };

    // Voice Input (Speech-to-Text)
    const startListening = () => {
        // Stop any current speech when mic is clicked
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }

        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {

            alert("Voice input is not supported in this browser.");
            return;
        }
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = 'en-IN'; // Default to English (India), can be toggled
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
            // Optional: Auto-send after voice
            // sendMessage(transcript); 
        };

        recognition.start();
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const toggleChat = () => setIsOpen(!isOpen);

    const sendMessage = async (overrideText = null) => {
        const textToSend = overrideText || input;
        if (!textToSend.trim()) return;

        const userMsg = { sender: "user", text: textToSend };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const res = await axios.post("/chatbot", {
                question: userMsg.text,
                role: user?.role || 'consumer' // Pass role context
            });
            const answer = res.data.answer || "Sorry, I didn't get that.";

            const botMsg = { sender: "bot", text: answer };
            setMessages((prev) => [...prev, botMsg]);

            speak(answer); // Speak the response

            // Handle Navigation Action
            if (res.data.action && res.data.action.type === "navigate") {
                setTimeout(() => {
                    navigate(res.data.action.payload);
                    setIsOpen(false); // Close chat on navigation
                }, 1500);
            }

        } catch (error) {
            console.error("Chat Error:", error);
            setMessages((prev) => [...prev, { sender: "bot", text: "Error connecting to server." }]);
            speak("Error connecting to server.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") sendMessage();
    };

    return (
        <div className="chat-widget-container">
            {/* Chat Launcher Button */}
            <button className={`chat-launcher ${isOpen ? "hidden" : ""}`} onClick={toggleChat}>
                <i className="bi bi-robot fs-4 text-white"></i>
            </button>

            {/* Chat Window */}
            <div className={`chat-window ${isOpen ? "open" : ""}`}>
                <div className="chat-header">
                    <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-robot"></i>
                        <span className="fw-bold">KisanSetu AI</span>
                    </div>
                    <button onClick={toggleChat} className="close-btn">&times;</button>
                </div>

                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender}`}>
                            <div className="message-bubble">
                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="message bot">
                            <div className="message-bubble typing-indicator">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="chat-input-area">
                    <button
                        className={`btn btn-sm me-2 ${isListening ? "btn-danger" : "btn-outline-secondary"}`}
                        onClick={startListening}
                        title="Speak"
                    >
                        <i className={`bi ${isListening ? "bi-mic-mute-fill" : "bi-mic-fill"}`}></i>
                    </button>
                    <input
                        type="text"
                        placeholder="Ask or say 'Go to orders'..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button onClick={() => sendMessage()} disabled={loading}>
                        <i className="bi bi-send-fill"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatBot;
