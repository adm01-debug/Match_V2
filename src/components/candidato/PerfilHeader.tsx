/**
 * @fileoverview PerfilHeader component
 * @module PerfilHeader
 */

import { memo } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CandidatoPerfil } from "@/data/candidatoPerfilData";
import { User, Mail, Phone, Linkedin, MapPin, Briefcase, DollarSign, Clock, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface PerfilHeaderProps {
  candidato: CandidatoPerfil;
  onEmail?: () => void;
  onLigar?: () => void;
  onFavoritar?: () => void;
}

export const PerfilHeader = memo(function PerfilHeader({ candidato, onEmail, onLigar, onFavoritar }: PerfilHeaderProps) {
  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return "bg-success/10 text-success border-success/20";
    if (score >= 60) return "bg-warning/10 text-warning border-warning/20";
    return "bg-destructive/10 text-destructive border-destructive/20";
  };

  return (
    <div data-testid="perfil-header" className="bg-card rounded-lg border p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
            {(candidato as any).foto || candidato.foto_url ? (
              <img loading="lazy" src={(candidato as any).foto || candidato.foto_url} 
                alt={candidato.nome} 
                className="h-24 w-24 rounded-full object-cover" 
              />
            ) : (
              <User className="h-12 w-12 text-primary" />
            )}
          </div>
        </div>

        {/* Info Principal */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{candidato.nome}</h1>
              <p className="text-muted-foreground">
                {(candidato as any).cargoAtual || candidato.vagaAtual}
                {(candidato as any).empresaAtual && ` • ${(candidato as any).empresaAtual}`}
              </p>
            </div>
            {(candidato as any).matchScore !== undefined && (
              <Badge 
                variant="outline" 
                className={cn("text-lg px-4 py-1", getMatchScoreColor((candidato as any).matchScore))}
              >
                <Star className="h-4 w-4 mr-1" />
                Match: {(candidato as any).matchScore}%
              </Badge>
            )}
          </div>

          {/* Contatos */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {((candidato as any).cidade || (candidato as any).estado) && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{(candidato as any).cidade}, {(candidato as any).estado}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{candidato.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{candidato.telefone}</span>
            </div>
            {(candidato as any).linkedin && (
              <div className="flex items-center gap-2 text-sm">
                <Linkedin className="h-4 w-4 text-muted-foreground" />
                <a href={`https://${(candidato as any).linkedin}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                  {(candidato as any).linkedin}
                </a>
              </div>
            )}
          </div>

          {/* Status Cards */}
          <div className="mt-4 flex flex-wrap gap-3">
            {(candidato as any).disponibilidadeLabel && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-success/10 text-success rounded-full text-sm">
                <Clock className="h-4 w-4" />
                {(candidato as any).disponibilidadeLabel}
              </div>
            )}
            {(candidato as any).pretensaoSalarial && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm">
                <DollarSign className="h-4 w-4" />
                Pretensão: R$ {(candidato as any).pretensaoSalarial.toLocaleString('pt-BR')}
              </div>
            )}
            {candidato.vagaAtual && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full text-sm">
                <Briefcase className="h-4 w-4" />
                {candidato.vagaAtual}{(candidato as any).etapaAtualLabel ? ` - ${(candidato as any).etapaAtualLabel}` : ''}
              </div>
            )}
          </div>
        </div>

        {/* Ações */}
        <div className="flex flex-row md:flex-col gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onEmail} aria-label="Action button">
            <Mail className="h-4 w-4 mr-2" />
            E-mail
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onLigar}>
            <Phone className="h-4 w-4 mr-2" />
            Ligar
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onFavoritar}>
            <Star className="h-4 w-4 mr-2" />
            Favoritar
          </Button>
        </div>
      </div>
    </div>
  );
});

PerfilHeader.displayName = "PerfilHeader";
