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
    <div className="flex flex-col h-full bg-gradient-to-b from-[#1a0f0a]/95 to-[#0d0705]/95 rounded-xl border border-[#d4a84b]/30 overflow-hidden">
      {/* En-tête */}
      <div className="px-4 py-3 border-b border-[#d4a84b]/20 bg-gradient-to-r from-[#2c1810] to-[#1a0f0a]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#d4a84b]" />
          <h3 className="text-[#d4a84b] font-serif font-bold">Dialogue avec l'Oracle</h3>
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
                      ? 'bg-gradient-to-r from-[#d4a84b] to-[#b8860b] text-[#1a0f0a]'
                      : 'bg-gradient-to-r from-[#2c1810] to-[#3d2618] text-[#e8d4a8] border border-[#d4a84b]/20'
                  }`}
                >
                  {message.role === 'oracle' && (
                    <div className="flex items-center gap-2 mb-2 text-[#d4a84b] text-xs font-serif">
                      <span>𓂀</span>
                      <span>L'Oracle répond</span>
                    </div>
                  )}
                  <div className="prose prose-sm prose-invert max-w-none">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                        strong: ({ children }) => <strong className="text-[#ffd700] font-bold">{children}</strong>,
                        em: ({ children }) => <em className="text-[#e8d4a8] italic">{children}</em>,
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
              <div className="bg-gradient-to-r from-[#2c1810] to-[#3d2618] rounded-2xl px-4 py-3 border border-[#d4a84b]/20">
                <div className="flex items-center gap-2 text-[#d4a84b]">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm font-serif">L'Oracle médite...</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Zone de saisie */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-[#d4a84b]/20 bg-[#1a0f0a]">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1 bg-[#2c1810] border-[#d4a84b]/30 text-[#e8d4a8] placeholder:text-[#8b7355] focus:border-[#d4a84b] focus:ring-[#d4a84b]/20"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-[#d4a84b] to-[#b8860b] hover:from-[#e5b84d] hover:to-[#c99a0b] text-[#1a0f0a]"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}