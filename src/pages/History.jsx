import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Calendar, MessageCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function History() {
  const { data: readings, isLoading } = useQuery({
    queryKey: ['readings'],
    queryFn: () => base44.entities.Reading.list('-created_date', 50),
    initialData: []
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0d0705] via-[#1a0f0a] to-[#2c1810] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#d4a84b] animate-spin mx-auto mb-4" />
          <p className="text-[#8b7355] font-serif">Chargement des consultations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d0705] via-[#1a0f0a] to-[#2c1810] py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#d4a84b] mb-2">
            Vos Consultations Passées
          </h1>
          <p className="text-[#8b7355]">
            {readings.length} consultation{readings.length > 1 ? 's' : ''} enregistrée{readings.length > 1 ? 's' : ''}
          </p>
        </motion.div>

        {readings.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">𓂀</div>
            <p className="text-[#8b7355] font-serif">
              Aucune consultation pour le moment.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 max-w-4xl mx-auto">
            {readings.map((reading, index) => (
              <motion.div
                key={reading.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-[#2c1810]/80 to-[#1a0f0a]/80 border-[#d4a84b]/30">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-[#d4a84b] font-serif text-lg leading-snug">
                          "{reading.question}"
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-[#8b7355] text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {format(new Date(reading.created_date), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Cartes tirées */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {reading.cards_drawn?.map((card, i) => (
                        <div 
                          key={i}
                          className={`bg-gradient-to-br from-[#f4e4c1] to-[#d4bc8a] px-3 py-1.5 rounded-lg text-xs font-medium text-[#3d2914] border border-[#8b6914] ${card.reversed ? 'line-through opacity-70' : ''}`}
                        >
                          {card.name} {card.reversed && '(Inv.)'}
                        </div>
                      ))}
                    </div>

                    {/* Interprétation */}
                    <div className="bg-[#1a0f0a]/50 rounded-lg p-4 border border-[#d4a84b]/10">
                      <ScrollArea className="max-h-48">
                        <div className="prose prose-sm prose-invert max-w-none text-[#c9b896]">
                          <ReactMarkdown>
                            {reading.interpretation?.substring(0, 500)}
                            {reading.interpretation?.length > 500 ? '...' : ''}
                          </ReactMarkdown>
                        </div>
                      </ScrollArea>
                    </div>

                    {/* Nombre de messages */}
                    {reading.conversation && reading.conversation.length > 2 && (
                      <div className="flex items-center gap-2 mt-3 text-[#8b7355] text-sm">
                        <MessageCircle className="w-4 h-4" />
                        <span>{reading.conversation.length - 1} messages échangés</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}