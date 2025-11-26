import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import CardDeck from '@/components/oracle/CardDeck';
import ChatDialog from '@/components/oracle/ChatDialog';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCw, Eye } from 'lucide-react';

export default function Oracle() {
  const [question, setQuestion] = useState('');
  const [phase, setPhase] = useState('question'); // question, cards, interpretation
  const [selectedCards, setSelectedCards] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentReading, setCurrentReading] = useState(null);

  const handleQuestionSubmit = () => {
    if (!question.trim()) return;
    setPhase('cards');
  };

  const handleCardsSelected = async (cards) => {
    setSelectedCards(cards);
    setPhase('interpretation');
    await getInterpretation(cards);
  };

  const getInterpretation = async (cards) => {
    setIsLoading(true);
    
    const cardsDescription = cards.map((card, i) => 
      `Position ${i + 1}: ${card.name} (${card.deity}) - ${card.reversed ? 'Inversée' : 'Droite'} - Signification: ${card.meaning}`
    ).join('\n');

    const prompt = `Tu es un Oracle Égyptien ancien, sage et mystique. Tu parles avec sagesse et poésie, en utilisant des références à la mythologie égyptienne.

Question du consultant: "${question}"

Cartes tirées:
${cardsDescription}

Donne une interprétation mystique et profonde de ce tirage. Commence par accueillir le consultant, puis analyse chaque carte en lien avec la question posée. Termine par un conseil général inspiré de la sagesse égyptienne.

Utilise un style poétique mais accessible, avec des références aux dieux égyptiens et à la symbolique des cartes. Utilise le markdown pour structurer ta réponse (gras pour les noms de cartes, italique pour les conseils).`;

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: null
      });

      const oracleMessage = {
        role: 'oracle',
        content: response
      };

      setMessages([oracleMessage]);

      // Sauvegarder le tirage
      const reading = await base44.entities.Reading.create({
        question,
        cards_drawn: cards.map(c => ({ name: c.name, position: `Position ${c.position}`, reversed: c.reversed })),
        interpretation: response,
        conversation: [{ role: 'user', content: question }, oracleMessage]
      });
      
      setCurrentReading(reading);
    } catch (error) {
      console.error('Erreur lors de l\'interprétation:', error);
      setMessages([{
        role: 'oracle',
        content: "Les voies du destin sont troublées... Veuillez réessayer."
      }]);
    }
    
    setIsLoading(false);
  };

  const handleFollowUpQuestion = async (followUp) => {
    const userMessage = { role: 'user', content: followUp };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    const cardsContext = selectedCards.map((card, i) => 
      `${card.name} (${card.reversed ? 'Inversée' : 'Droite'})`
    ).join(', ');

    const conversationHistory = messages.map(m => 
      `${m.role === 'user' ? 'Consultant' : 'Oracle'}: ${m.content}`
    ).join('\n\n');

    const prompt = `Tu es un Oracle Égyptien ancien. Voici le contexte de la consultation:

Question initiale: "${question}"
Cartes tirées: ${cardsContext}

Conversation précédente:
${conversationHistory}

Nouvelle question du consultant: "${followUp}"

Réponds à cette question en restant dans ton rôle d'Oracle Égyptien, en faisant référence aux cartes tirées si pertinent. Utilise un style mystique et sage.`;

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: null
      });

      const oracleMessage = { role: 'oracle', content: response };
      setMessages(prev => [...prev, oracleMessage]);

      // Mettre à jour le tirage
      if (currentReading) {
        await base44.entities.Reading.update(currentReading.id, {
          conversation: [...messages, userMessage, oracleMessage]
        });
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMessages(prev => [...prev, {
        role: 'oracle',
        content: "L'Oracle a besoin d'un moment de méditation... Réessayez."
      }]);
    }

    setIsLoading(false);
  };

  const resetReading = () => {
    setQuestion('');
    setPhase('question');
    setSelectedCards([]);
    setMessages([]);
    setCurrentReading(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d0705] via-[#1a0f0a] to-[#2c1810] relative overflow-hidden">
      {/* Motifs décoratifs de fond */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-6xl text-[#d4a84b]">𓂀</div>
        <div className="absolute top-20 right-20 text-4xl text-[#d4a84b]">𓆣</div>
        <div className="absolute bottom-20 left-20 text-5xl text-[#d4a84b]">𓁹</div>
        <div className="absolute bottom-10 right-10 text-6xl text-[#d4a84b]">𓊝</div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* En-tête */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-2">
            <span className="text-[#d4a84b] text-2xl">𓂀</span>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#d4a84b] via-[#ffd700] to-[#d4a84b]">
              Oracle d'Égypte
            </h1>
            <span className="text-[#d4a84b] text-2xl">𓂀</span>
          </div>
          <p className="text-[#8b7355] font-serif italic">
            Consultez les anciens dieux pour éclairer votre chemin
          </p>
        </motion.div>

        {/* Bouton Reset */}
        {phase !== 'question' && (
          <div className="flex justify-center mb-6">
            <Button
              onClick={resetReading}
              variant="outline"
              className="border-[#d4a84b]/30 text-[#d4a84b] hover:bg-[#d4a84b]/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Nouvelle Consultation
            </Button>
          </div>
        )}

        {/* Phase 1: Question */}
        {phase === 'question' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-gradient-to-br from-[#2c1810]/80 to-[#1a0f0a]/80 rounded-2xl p-6 md:p-8 border border-[#d4a84b]/30 shadow-2xl shadow-amber-900/20">
              <div className="text-center mb-6">
                <Eye className="w-12 h-12 text-[#d4a84b] mx-auto mb-4" />
                <h2 className="text-xl md:text-2xl font-serif text-[#d4a84b] mb-2">
                  Quelle est votre question ?
                </h2>
                <p className="text-[#8b7355] text-sm">
                  Concentrez-vous et formulez clairement votre interrogation
                </p>
              </div>
              
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Écrivez ici votre question pour l'Oracle..."
                className="min-h-[120px] bg-[#1a0f0a] border-[#d4a84b]/30 text-[#e8d4a8] placeholder:text-[#6b5544] focus:border-[#d4a84b] resize-none mb-4"
              />
              
              <Button
                onClick={handleQuestionSubmit}
                disabled={!question.trim()}
                className="w-full bg-gradient-to-r from-[#d4a84b] to-[#b8860b] hover:from-[#e5b84d] hover:to-[#c99a0b] text-[#1a0f0a] font-bold py-6 text-lg rounded-xl shadow-lg shadow-amber-900/30"
              >
                Consulter l'Oracle
              </Button>
            </div>
          </motion.div>
        )}

        {/* Phase 2: Tirage des cartes */}
        {phase === 'cards' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-br from-[#2c1810]/60 to-[#1a0f0a]/60 rounded-2xl p-6 border border-[#d4a84b]/20">
              <div className="text-center mb-4">
                <p className="text-[#d4a84b] font-serif italic">
                  Votre question : "{question}"
                </p>
              </div>
              <CardDeck 
                onCardsSelected={handleCardsSelected}
                numberOfCards={3}
              />
            </div>
          </motion.div>
        )}

        {/* Phase 3: Interprétation et Chat */}
        {phase === 'interpretation' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-6xl mx-auto"
          >
            <div className="grid md:grid-cols-2 gap-6">
              {/* Cartes tirées */}
              <div className="bg-gradient-to-br from-[#2c1810]/60 to-[#1a0f0a]/60 rounded-2xl p-6 border border-[#d4a84b]/20">
                <h3 className="text-[#d4a84b] font-serif text-lg mb-4 text-center">
                  Vos Cartes
                </h3>
                <div className="flex flex-wrap justify-center gap-4">
                  {selectedCards.map((card, index) => (
                    <div key={card.id} className="text-center">
                      <div className="text-[#8b7355] text-xs mb-1">Position {index + 1}</div>
                      <div className={`bg-gradient-to-br from-[#f4e4c1] to-[#d4bc8a] rounded-lg p-4 border-2 border-[#8b6914] ${card.reversed ? 'rotate-180' : ''}`}>
                        <div className="text-3xl mb-1">{card.symbol}</div>
                        <div className={`text-xs font-bold text-[#3d2914] ${card.reversed ? 'rotate-180' : ''}`}>
                          {card.name}
                        </div>
                      </div>
                      {card.reversed && (
                        <div className="text-red-400 text-xs mt-1">Inversée</div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <p className="text-[#8b7355] text-sm italic">
                    Question : "{question}"
                  </p>
                </div>
              </div>

              {/* Zone de dialogue */}
              <div className="h-[500px] md:h-[600px]">
                <ChatDialog
                  messages={messages}
                  onSendMessage={handleFollowUpQuestion}
                  isLoading={isLoading}
                  placeholder="Posez une question supplémentaire..."
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}