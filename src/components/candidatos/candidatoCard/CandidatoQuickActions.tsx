import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Eye, MessageSquare, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  candidatoId: string;
  isHovered: boolean;
}

export const CandidatoQuickActions = ({ candidatoId, isHovered }: Props) => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}
      className="flex items-center gap-1"
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); navigate(`/candidato/${candidatoId}`); }}>
            <Eye className="h-3.5 w-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Ver perfil</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => e.stopPropagation()}>
            <MessageSquare className="h-3.5 w-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Enviar mensagem</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => e.stopPropagation()}>
            <Calendar className="h-3.5 w-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Agendar entrevista</TooltipContent>
      </Tooltip>
    </motion.div>
  );
};
