import { memo } from 'react';
import { Mail, Phone } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface CandidateProfileHeaderProps {
  candidato: {
    nome: string;
    email: string;
    telefone?: string;
  };
}

export const CandidateProfileHeader = memo(function CandidateProfileHeader({ candidato }: CandidateProfileHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-start gap-4">
      <Avatar className="h-20 w-20">
        <AvatarFallback className="text-2xl">{candidato.nome.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-2xl font-bold">{candidato.nome}</h1>
        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Mail className="h-4 w-4" />
            {candidato.email}
          </span>
          {candidato.telefone && (
            <span className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              {candidato.telefone}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});
