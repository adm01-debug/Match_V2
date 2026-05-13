import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, CheckCircle2, Clock } from 'lucide-react';
import { BehavioralTool } from '@/types/behavioral';

interface BehavioralToolsGridProps {
  tools: BehavioralTool[];
  completedToolIds: string[];
  onStart: (toolId: string) => void;
  toolIcons: Record<string, React.ReactNode>;
}

export function BehavioralToolsGrid({
  tools,
  completedToolIds,
  onStart,
  toolIcons
}: BehavioralToolsGridProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map((tool, index) => {
        const isCompleted = completedToolIds.includes(tool.id);
        
        return (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={`h-full flex flex-col transition-all duration-300 hover:shadow-lg ${isCompleted ? 'border-success/20 bg-success/5' : 'hover:border-primary/30'}`}>
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <div className={`p-2.5 rounded-lg ${isCompleted ? 'bg-success/20 text-success' : 'bg-primary/10 text-primary'}`}>
                    {toolIcons[tool.id] || <Play className="h-6 w-6" />}
                  </div>
                  {isCompleted ? (
                    <Badge variant="secondary" className="bg-success/20 text-success border-0 flex gap-1 items-center">
                      <CheckCircle2 className="h-3 w-3" /> Concluído
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="flex gap-1 items-center">
                      <Clock className="h-3 w-3" /> {tool.estimatedTime} min
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl">{tool.name}</CardTitle>
                <CardDescription className="line-clamp-2">{tool.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-end">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-1.5">
                    {tool.tags?.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="outline" className="text-[10px] uppercase tracking-wider py-0 px-2 h-5">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button 
                    className={`w-full group ${isCompleted ? 'bg-success hover:bg-success/90' : ''}`}
                    onClick={() => onStart(tool.id)}
                  >
                    {isCompleted ? 'Refazer Assessment' : 'Iniciar Agora'}
                    <Play className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}