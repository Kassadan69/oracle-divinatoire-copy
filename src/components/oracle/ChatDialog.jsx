import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function ChatDialog({ 
  messages = [], 
  onSendMessage, 
  isLoading = false,
  placeholder = "Posez votre question à l'Oracle..."
}) {
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#fffef8] to-[#f4e4c1] rounded-xl border-2 border-[#8b6914]/40 overflow-hidden shadow-lg">
      {/* En-tête */}
      <div className="px-4 py-3 border-b border-[#8b6914]/20 bg-gradient-to-r from-[#e8d4a8] to-[#f4e4c1]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#8b6914]" />
          <h3 className="text-[#6b4423] font-serif font-bold">Dialogue avec l'Oracle</h3>
        </div>
      </div>

      {/* Zone de messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-[#8b6914] to-[#6b4423] text-white'
                      : 'bg-white/80 text-[#3d2914] border-2 border-[#8b6914]/30 shadow-sm'
                  }`}
                >
                  {message.role === 'oracle' && (
                    <div className="flex items-center gap-2 mb-2 text-[#8b6914] text-xs font-serif">
                      <span>𓂀</span>
                      <span>L'Oracle répond</span>
                    </div>
                  )}
                  <div className="prose prose-sm prose-invert max-w-none">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                        strong: ({ children }) => <strong className="text-[#8b6914] font-bold">{children}</strong>,
                        em: ({ children }) => <em className="text-[#6b4423] italic">{children}</em>,
                      }}
                    >
                      {String(message.content || '')}
                    </ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white/80 rounded-2xl px-4 py-3 border-2 border-[#8b6914]/30 shadow-sm">
                <div className="flex items-center gap-2 text-[#8b6914]">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm font-serif">L'Oracle médite...</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Zone de saisie */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-[#8b6914]/20 bg-[#e8d4a8]">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1 bg-white border-[#8b6914]/40 text-[#3d2914] placeholder:text-[#a89070] focus:border-[#8b6914] focus:ring-[#8b6914]/20"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-[#8b6914] to-[#6b4423] hover:from-[#a07818] hover:to-[#7d5029] text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}