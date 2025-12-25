/**
 * @fileoverview CategoriaCard component
 * @module CategoriaCard
 */

import { memo , memo} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { categoriasInfo } from '@/config/testsConfig';
import { CategoriaProva } from '@/types/tests';
import { Brain, Heart, Code, Globe, Target, Users, LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Brain,
  Heart,
  Code,
  Globe,
  Target,
  Users
};

interface CategoriaCardProps {
  categoria: CategoriaProva;
  count: number;
  onClick: () => void;
  isSelected: boolean;
}

export function CategoriaCard({ categoria, count, onClick, isSelected }: CategoriaCardProps) {
  const info = categoriasInfo[categoria];
  const Icon = iconMap[info.icone] || Brain;

  return (
    <Card role="article" aria-label="Categoria" 
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div data-testid="categoria-card" className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-lg ${info.cor} flex items-center justify-center`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-sm">{info.nome}</h3>
            <p className="text-xs text-muted-foreground line-clamp-1">{info.descricao}</p>
          </div>
          <Badge variant="secondary" className="text-xs">
            {count}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

