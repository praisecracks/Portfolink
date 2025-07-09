import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  SendHorizonal,
  Bot,
  User,
  Trash2,
  UploadCloud,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import logo from '../../assets/portlogo.png';

function Chat() {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [maximized, setMaximized] = useState(false);

  const fileRef = useRef(null);
  const chatRef = useRef(null);
  const inputRef = useRef(null);


const faqContext = `
About the Developer:
Portfolink was created by a Nigerian web developer known as Praisecrack. 
The name "Praisecrack" combines "Praise" (his name) and "crack" (his ability to crack problems in web development with affordable solutions).

About the App:
Portfolink is a web app for building, managing, and sharing developer portfolios.
Features include:
- Adding and editing projects
- AI-generated descriptions
- Firebase-authenticated login
- Resume export and shareable portfolio links

Frequently Asked Questions:

Q: Who is Praisecrack?
A: Praisecrack is a full-stack web developer who builds modern, clean, responsive web applications with great UI/UX.

Q: What can I use Portfolink for?
A: To manage your projects, create AI-written summaries, build a resume, and share your work online.

Q: Can I use AI to help write my project summary?
A: Yes. Just enter a title and tags, then click "AI Generate Description."

Q: Will my data be safe?
A: Yes. Your login and portfolio are secured with Firebase Authentication and Firestore rules.
`;



  useEffect(() => {
    const saved = localStorage.getItem('ai_chat');
    if (saved) setChat(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('ai_chat', JSON.stringify(chat));
  }, [chat]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chat, displayedText]);

  const speak = (text) => {
    if ('speechSynthesis' in window && voiceEnabled) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 1;
      utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const typeWriterEffect = (text) => {
    let i = 0;
    setDisplayedText('');
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text[i]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 20);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    setChat((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setTyping(true);
    setDisplayedText('');

    try {
        const res = await axios.post('https://portfolink-backend.onrender.com/ai', {
          prompt: `
        You are a helpful assistant for a web app called Portfolink.

        Only use the information provided in the FAQ and app context below. Do NOT use any external or pre-learned knowledge about the developer or the app.

        ${faqContext}

        User: ${input.trim()}
        Assistant:
          `.trim()
        });


      const aiText = res.data.description || '🤖 No response from AI.';
      const aiMsg = { sender: 'ai', text: '' };
      setChat((prev) => [...prev, aiMsg]);
      typeWriterEffect(aiText);
      speak(aiText);

      setTimeout(() => {
        setChat((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].text = aiText;
          return updated;
        });
      }, aiText.length * 20 + 100);
    } catch (err) {
      const errorMsg = '❌ AI failed to respond.';
      setChat((prev) => [...prev, { sender: 'ai', text: errorMsg }]);
      speak(errorMsg);
    }

    setTyping(false);
    setLoading(false);
  };

  const clearChat = () => {
    setChat([]);
    localStorage.removeItem('ai_chat');
    setDisplayedText('');
  };

  const containerSize = maximized ? 'w-full h-full max-w-none max-h-none' : 'w-80 h-[550px]';

  return (
    <div className={`fixed z-50 ${maximized ? 'inset-0' : 'bottom-6 right-6'}`}>
      {!open ? (
        <button
          onClick={() => {
            setOpen(true);
            setTimeout(() => inputRef.current?.focus(), 100);
          }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full shadow-xl hover:scale-105 transition"
        >
          Chat AI
        </button>
      ) : (
        <div className={`${containerSize} bg-white rounded-2xl shadow-2xl flex flex-col p-4 border border-blue-500 flex-1`}>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-gray-800 flex">
              <img className="h-7 w-7" src={logo} alt="" />
              &nbsp;AI Chat Assistant
            </h2>
            <div className="flex items-center gap-2">
              <button onClick={() => setVoiceEnabled(!voiceEnabled)} title="Toggle voice">
                {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
              <button onClick={() => setMaximized(!maximized)} title="Toggle maximize">
                {maximized ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
              <button onClick={clearChat} title="Clear chat">
                <Trash2 size={18} />
              </button>
              <button onClick={() => setOpen(false)} className="text-sm text-red-500">
                ✖
              </button>
            </div>
          </div>

          <div ref={chatRef} className="flex-1 overflow-y-auto space-y-3 mb-2 px-1 custom-scrollbar">
            {chat.map((msg, i) => {
              const isLast = i === chat.length - 1;
              const isAI = msg.sender === 'ai';

              return (
                <div key={i} className={`flex items-start gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {isAI && (
                    <div className="bg-gray-200 rounded-full p-1">
                      <Bot className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                  <div
                    className={`px-4 py-2 max-w-[75%] rounded-xl text-sm transition-all duration-300 ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-indigo-100 text-gray-900 rounded-bl-none'
                    }`}
                  >
                    {isAI && isLast && typing ? displayedText : msg.text}
                  </div>
                  {msg.sender === 'user' && (
                    <div className="bg-blue-600 rounded-full p-1">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              );
            })}

            {typing && displayedText === '' && (
              <div className="flex items-center gap-2">
                <div className="bg-gray-300 px-3 py-1 rounded-xl text-sm text-gray-700">
                  <span className="animate-pulse">AI is typing...</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask something..."
              className="flex-1 px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
            >
              <SendHorizonal size={18} />
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="p-2 text-gray-600 hover:text-blue-600"
              title="Upload file"
            >
              <UploadCloud size={18} />
            </button>
            <input
              type="file"
              ref={fileRef}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setChat((prev) => [...prev, { sender: 'user', text: `📎 ${file.name}` }]);
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
