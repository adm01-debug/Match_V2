/**
 * @fileoverview Contextual Help Component
 * @module ContextualHelp
 */

import { memo, ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  HelpCircle,
  ChevronRight, 
  ExternalLink,
  BookOpen,
  Video,
  FileText,
  MessageCircle,
  Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface HelpTopic {
  id: string;
  title: string;
  content: string;
  type: 'tip' | 'guide' | 'video' | 'doc' | 'faq';
  link?: string;
  relatedTopics?: string[];
}

interface ContextualHelpProps {
  topics: HelpTopic[];
  context?: string;
  className?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click';
}

const typeIcons = {
  tip: <Lightbulb className="h-4 w-4" />,
  guide: <BookOpen className="h-4 w-4" />,
  video: <Video className="h-4 w-4" />,
  doc: <FileText className="h-4 w-4" />,
  faq: <MessageCircle className="h-4 w-4" />,
};

const typeLabels = {
  tip: 'Dica',
  guide: 'Guia',
  video: 'Vídeo',
  doc: 'Documentação',
  faq: 'FAQ',
};

export const ContextualHelp = memo(function ContextualHelp({
  topics,
  context,
  className,
  position = 'bottom',
}: ContextualHelpProps) {
  const [selectedTopic, setSelectedTopic] = useState<HelpTopic | null>(null);

  const filteredTopics = context
    ? topics.filter(t => 
        t.title.toLowerCase().includes(context.toLowerCase()) ||
        t.content.toLowerCase().includes(context.toLowerCase())
      )
    : topics;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn('h-8 w-8 rounded-full', className)}
        >
          <HelpCircle className="h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        side={position} 
        className="w-80 p-0"
        sideOffset={8}
      >
        <AnimatePresence mode="wait">
          {selectedTopic ? (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4"
            >
              <button
                onClick={() => setSelectedTopic(null)}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3"
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
                Voltar
              </button>
              
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded bg-primary/10 text-primary">
                  {typeIcons[selectedTopic.type]}
                </div>
                <span className="text-xs text-muted-foreground">
                  {typeLabels[selectedTopic.type]}
                </span>
              </div>
              
              <h3 className="font-semibold mb-2">{selectedTopic.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {selectedTopic.content}
              </p>
              
              {selectedTopic.link && (
                <a
                  href={selectedTopic.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-3"
                >
                  Saiba mais
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
              
              {selectedTopic.relatedTopics && selectedTopic.relatedTopics.length > 0 && (
                <div className="mt-4 pt-3 border-t">
                  <p className="text-xs text-muted-foreground mb-2">Tópicos relacionados:</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedTopic.relatedTopics.map((topicId) => {
                      const related = topics.find(t => t.id === topicId);
                      if (!related) return null;
                      return (
                        <button
                          key={topicId}
                          onClick={() => setSelectedTopic(related)}
                          className="text-xs px-2 py-1 bg-muted rounded hover:bg-muted/80"
                        >
                          {related.title}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="p-3 border-b">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Central de Ajuda</span>
                </div>
              </div>
              
              <div className="max-h-80 overflow-auto">
                {filteredTopics.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    <p className="text-sm">Nenhum tópico encontrado</p>
                  </div>
                ) : (
                  filteredTopics.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => setSelectedTopic(topic)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors text-left border-b last:border-0"
                    >
                      <div className={cn(
                        'p-1.5 rounded',
                        topic.type === 'tip' && 'bg-yellow-500/10 text-yellow-600',
                        topic.type === 'guide' && 'bg-blue-500/10 text-blue-600',
                        topic.type === 'video' && 'bg-red-500/10 text-red-600',
                        topic.type === 'doc' && 'bg-green-500/10 text-green-600',
                        topic.type === 'faq' && 'bg-purple-500/10 text-purple-600',
                      )}>
                        {typeIcons[topic.type]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{topic.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{topic.content}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </PopoverContent>
    </Popover>
  );
});

interface InlineHelpProps {
  content: string;
  title?: string;
  className?: string;
}

export const InlineHelp = memo(function InlineHelp({
  content,
  title,
  className,
}: InlineHelpProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className={cn('inline-flex', className)}>
          <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" sideOffset={5}>
        {title && <p className="font-medium text-sm mb-1">{title}</p>}
        <p className="text-sm text-muted-foreground">{content}</p>
      </PopoverContent>
    </Popover>
  );
});

interface OnboardingTooltipProps {
  content: string;
  step?: number;
  totalSteps?: number;
  onNext?: () => void;
  onSkip?: () => void;
  children: ReactNode;
  isOpen?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const OnboardingTooltip = memo(function OnboardingTooltip({
  content,
  step,
  totalSteps,
  onNext,
  onSkip,
  children,
  isOpen = true,
  position = 'bottom',
}: OnboardingTooltipProps) {
  if (!isOpen) return <>{children}</>;

  return (
    <Popover open={isOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          {children}
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent side={position} className="w-72 p-4" sideOffset={10}>
        <p className="text-sm mb-3">{content}</p>
        
        <div className="flex items-center justify-between">
          {step && totalSteps && (
            <div className="flex gap-1">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    i + 1 === step ? 'bg-primary' : 'bg-muted'
                  )}
                />
              ))}
            </div>
          )}
          
          <div className="flex gap-2 ml-auto">
            {onSkip && (
              <Button variant="ghost" size="sm" onClick={onSkip}>
                Pular
              </Button>
            )}
            {onNext && (
              <Button size="sm" onClick={onNext}>
                {step === totalSteps ? 'Concluir' : 'Próximo'}
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
});

ContextualHelp.displayName = 'ContextualHelp';
InlineHelp.displayName = 'InlineHelp';
OnboardingTooltip.displayName = 'OnboardingTooltip';

export type { HelpTopic };
