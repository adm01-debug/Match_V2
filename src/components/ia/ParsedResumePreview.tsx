import { memo, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { User, Briefcase, GraduationCap, Award, Globe, MapPin, Mail, Phone, Sparkles } from 'lucide-react';
import type { ParsedResume } from '@/types/resumeParser';

interface ParsedResumePreviewProps {
  data: ParsedResume;
  className?: string;
  isLoading?: boolean;
}

function getConfidenceColor(score: number): string {
  if (score >= 0.8) return 'text-green-600';
  if (score >= 0.6) return 'text-yellow-600';
  return 'text-red-600';
}

function getConfidenceLabel(score: number): string {
  if (score >= 0.8) return 'Alta';
  if (score >= 0.6) return 'Média';
  return 'Baixa';
}

function generateKey(prefix: string, item: Record<string, unknown>, index: number): string {
  const identifier = item.id || item.name || item.title || item.degree || '';
  return `${prefix}-${String(identifier).slice(0, 20)}-${index}`;
}

function ParsedResumePreviewComponent({ data, className, isLoading }: ParsedResumePreviewProps) {
  const confidencePercent = useMemo(() => Math.round(data.confidence * 100), [data.confidence]);
  const confidenceColor = useMemo(() => getConfidenceColor(data.confidence), [data.confidence]);
  const confidenceLabel = useMemo(() => getConfidenceLabel(data.confidence), [data.confidence]);

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className ?? ''}`}>
        <Card>
          <CardContent className="pt-4">
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="h-2 bg-muted rounded" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className ?? ''}`} role="region" aria-label="Pré-visualização do currículo">
      {/* Confidence Score */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
              <span className="font-medium">Confiança do Parser</span>
            </div>
            <span className={`font-bold ${confidenceColor}`} aria-label={`Confiança ${confidenceLabel}: ${confidencePercent}%`}>
              {confidencePercent}%
            </span>
          </div>
          <Progress 
            value={confidencePercent} 
            className="h-2" 
            aria-label={`Nível de confiança: ${confidencePercent}%`}
          />
        </CardContent>
      </Card>

      {/* Dados Pessoais */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4" aria-hidden="true" />
            Dados Pessoais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-xl font-semibold">{data.personalInfo.name || 'Nome não informado'}</div>
          {data.personalInfo.email && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" aria-hidden="true" />
              <a href={`mailto:${data.personalInfo.email}`} className="hover:underline">
                {data.personalInfo.email}
              </a>
            </div>
          )}
          {data.personalInfo.phone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" aria-hidden="true" />
              <a href={`tel:${data.personalInfo.phone}`} className="hover:underline">
                {data.personalInfo.phone}
              </a>
            </div>
          )}
          {data.personalInfo.location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              <span>{data.personalInfo.location}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Experiências */}
      {data.experience?.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase className="h-4 w-4" aria-hidden="true" />
              Experiência Profissional ({data.experience.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4" role="list" aria-label="Lista de experiências">
              {data.experience.map((exp, i) => (
                <div key={generateKey('exp', exp, i)} role="listitem">
                  {i > 0 && <Separator className="mb-4" />}
                  <div className="font-medium">{exp.title}</div>
                  <div className="text-sm text-primary">{exp.company}</div>
                  <div className="text-xs text-muted-foreground">
                    {exp.startDate} - {exp.current ? 'Atual' : exp.endDate || 'N/A'}
                    {exp.location && ` • ${exp.location}`}
                  </div>
                  {exp.description && (
                    <p className="text-sm mt-2 text-muted-foreground">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formação */}
      {data.education?.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <GraduationCap className="h-4 w-4" aria-hidden="true" />
              Formação Acadêmica ({data.education.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4" role="list" aria-label="Lista de formação">
              {data.education.map((edu, i) => (
                <div key={generateKey('edu', edu, i)} role="listitem">
                  {i > 0 && <Separator className="mb-4" />}
                  <div className="font-medium">{edu.degree}</div>
                  <div className="text-sm text-primary">{edu.institution}</div>
                  <div className="text-xs text-muted-foreground">
                    {edu.startDate && `${edu.startDate} - `}{edu.endDate || edu.year || 'N/A'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Skills */}
      {data.skills?.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="h-4 w-4" aria-hidden="true" />
              Competências ({data.skills.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2" role="list" aria-label="Lista de competências">
              {data.skills.map((skill, i) => {
                const skillName = typeof skill === 'string' ? skill : skill.name;
                return (
                  <Badge key={`skill-${skillName}-${i}`} variant="secondary" role="listitem">
                    {skillName}
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Idiomas */}
      {data.languages && data.languages.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-4 w-4" aria-hidden="true" />
              Idiomas ({data.languages.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2" role="list" aria-label="Lista de idiomas">
              {data.languages.map((lang, i) => (
                <Badge key={generateKey('lang', lang, i)} variant="outline" role="listitem">
                  {lang.name} {lang.level && `(${lang.level})`}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Certificações */}
      {data.certifications && data.certifications.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="h-4 w-4" aria-hidden="true" />
              Certificações ({data.certifications.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2" role="list" aria-label="Lista de certificações">
              {data.certifications.map((cert, i) => (
                <div key={generateKey('cert', cert, i)} className="text-sm" role="listitem">
                  <span className="font-medium">{cert.name}</span>
                  {cert.issuer && <span className="text-muted-foreground"> • {cert.issuer}</span>}
                  {cert.year && <span className="text-muted-foreground"> ({cert.year})</span>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

ParsedResumePreviewComponent.displayName = 'ParsedResumePreview';

export const ParsedResumePreview = memo(ParsedResumePreviewComponent);
