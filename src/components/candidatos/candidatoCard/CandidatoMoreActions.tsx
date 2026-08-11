import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, FileText, Target, UserPlus, TrendingUp, Star, Share2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  candidatoId: string;
  onStatusChange?: (id: string, status: string) => void;
  onDelete?: (id: string) => void;
}

export const CandidatoMoreActions = ({ candidatoId, onStatusChange, onDelete }: Props) => {
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => navigate(`/candidato/${candidatoId}`)}>
          <Eye className="h-4 w-4 mr-2" />Ver Perfil Completo
        </DropdownMenuItem>
        <DropdownMenuItem><FileText className="h-4 w-4 mr-2" />Ver Currículo</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem><Target className="h-4 w-4 mr-2" />Calcular Match</DropdownMenuItem>
        <DropdownMenuItem><UserPlus className="h-4 w-4 mr-2" />Adicionar a Vaga</DropdownMenuItem>
        <DropdownMenuSeparator />
        {onStatusChange && (
          <>
            <DropdownMenuItem onClick={() => onStatusChange(candidatoId, 'em_triagem')}>
              <TrendingUp className="h-4 w-4 mr-2" />Mover para Triagem
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange(candidatoId, 'banco_talentos')}>
              <Star className="h-4 w-4 mr-2" />Banco de Talentos
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem><Share2 className="h-4 w-4 mr-2" />Compartilhar</DropdownMenuItem>
        {onDelete && (
          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(candidatoId)}>
            <Trash2 className="h-4 w-4 mr-2" />Excluir
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
