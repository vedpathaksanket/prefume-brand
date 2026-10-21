/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ParfumeurChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPerfumeDetailByName?: (name: string) => void;
}

export const ParfumeurChatModal: React.FC<ParfumeurChatModalProps> = ({
  isOpen,
  onClose,
  onOpenPerfumeDetailByName,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Greetings. I am your Master Parfumeur at Maison Aura. Whether you seek a nocturnal signature of smoked agarwood, a radiant dawn of Grasse roses, or guidance on bespoke fragrance layering, I invite you to share what calls to your senses.',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'gemini-3.8-flash' | 'gemini-3.1-flash-lite'>(
    'gemini-3.8-flash'
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    'Find my signature scent for evening wear',
    'How do I layer Obsidian Oud with Celestial Rose?',
    'Explain the sillage of Amber Velvet',
    'Which fragrance suits a summer wedding?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      // Build conversation payload for the backend Gemini endpoint
      const payloadMessages = newMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: payloadMessages,
          model: selectedModel,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'The atelier is quiet; please ask again.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content:
          'I apologize, our sensory consultation was momentarily interrupted. Please allow me another moment to consult the olfactory archives.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content:
          'Our consultation has refreshed. What atmosphere or aroma profile would you like to explore today?',
        timestamp: new Date(),
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-end p-4 sm:p-6 overflow-hidden"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm"
      />

      {/* Floating Salon Drawer / Dialog */}
      <motion.div
        initial={{ opacity: 0, x: 40, scale: 0.98 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 40, scale: 0.98 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-lg h-[92vh] max-h-[750px] liquid-glass bg-[#080a0f]/98 rounded-3xl border border-white/10 shadow-2xl flex flex-col justify-between overflow-hidden"
      >
        {/* Salon Header */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between bg-[#0b0e16]/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f3e5ab] flex items-center justify-center">
              <Bot className="w-4 h-4 text-[#d4af37]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3
                  className="text-lg text-white font-medium tracking-wide"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Aura AI Master Parfumeur
                </h3>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
              </div>
              <p className="text-[11px] text-zinc-400">
                Place Vendôme & Grasse Olfactory Specialist
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Model Switcher */}
            <div className="flex items-center p-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px]">
              <button
                onClick={() => setSelectedModel('gemini-3.8-flash')}
                className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                  selectedModel === 'gemini-3.8-flash'
                    ? 'bg-[#d4af37] text-black font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Gemini 3.8 Flash · High nuance & poetic accuracy"
              >
                Deep Nuance
              </button>
              <button
                onClick={() => setSelectedModel('gemini-3.1-flash-lite')}
                className={`px-2 py-0.5 rounded-full transition-all cursor-pointer flex items-center gap-0.5 ${
                  selectedModel === 'gemini-3.1-flash-lite'
                    ? 'bg-[#d4af37] text-black font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Gemini 3.1 Flash Lite · Fast consultation"
              >
                <Zap className="w-2.5 h-2.5" />
                <span>Fast</span>
              </button>
            </div>

            {/* Clear conversation */}
            <button
              onClick={handleResetChat}
              className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              title="Reset conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Close parfumeur chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin">
          {messages.map((message) => {
            const isUser = message.role === 'user';
            return (
              <div
                key={message.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f3e5ab] flex items-center justify-center shrink-0 mt-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-[#d4af37] text-[#08090d] font-medium rounded-tr-sm shadow-md'
                      : 'liquid-glass text-zinc-200 border border-white/[0.08] rounded-tl-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap font-light">{message.content}</p>

                  <span
                    className={`block text-[9px] mt-1.5 font-mono ${
                      isUser ? 'text-black/60 text-right' : 'text-zinc-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-full bg-white/10 text-zinc-300 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing state */}
          {isLoading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-7 h-7 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f3e5ab] flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              </div>
              <div className="liquid-glass rounded-2xl px-4 py-3 border border-white/[0.08] flex items-center gap-1.5 text-xs text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-bounce [animation-delay:0.4s]" />
                <span className="ml-2 text-[11px] italic font-serif">
                  Distilling olfactory notes...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="px-5 py-2.5 bg-white/[0.015] border-t border-white/[0.04]">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className="px-3 py-1 rounded-full text-[11px] text-zinc-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] whitespace-nowrap transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-white/[0.08] bg-[#07090e]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask the Master Parfumeur (notes, layering, rituals)..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-full bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#d4af37]/60 transition-colors"
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className={`p-3 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                inputValue.trim() && !isLoading
                  ? 'bg-[#d4af37] text-[#08090d] hover:scale-105 shadow-md shadow-[#d4af37]/20 font-bold'
                  : 'bg-white/5 text-zinc-600 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </form>

          <div className="mt-2 text-center">
            <span className="text-[10px] text-zinc-500">
              Powered by Gemini · Artisanal Olfactory Knowledge Base
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
