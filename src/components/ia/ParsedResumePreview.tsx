import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { User, Briefcase, GraduationCap, Award, Globe, MapPin, Mail, Phone, Sparkles } from 'lucide-react';
import type { ParsedResume } from '@/types/resumeParser';

interface ParsedResumePreviewProps {
  data: ParsedResume;
  className?: string;
}

export function ParsedResumePreview({ data, className }: ParsedResumePreviewProps) {
  const confidenceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Confidence Score */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-medium">Confiança do Parser</span>
            </div>
            <span className={`font-bold ${confidenceColor(data.confidence)}`}>
              {Math.round(data.confidence * 100)}%
            </span>
          </div>
          <Progress value={data.confidence * 100} className="h-2" />
        </CardContent>
      </Card>

      {/* Dados Pessoais */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4" />
            Dados Pessoais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-xl font-semibold">{data.personalInfo.name}</div>
          {data.personalInfo.email && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              {data.personalInfo.email}
            </div>
          )}
          {data.personalInfo.phone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              {data.personalInfo.phone}
            </div>
          )}
          {data.personalInfo.location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {data.personalInfo.location}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Experiências */}
      {data.experience.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Experiência Profissional
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.experience.map((exp, i) => (
              <div key={i}>
                {i > 0 && <Separator className="mb-4" />}
                <div className="font-medium">{exp.title}</div>
                <div className="text-sm text-primary">{exp.company}</div>
                <div className="text-xs text-muted-foreground">
                  {exp.startDate} - {exp.endDate || 'Atual'}
                  {exp.location && ` • ${exp.location}`}
                </div>
                {exp.description && (
                  <p className="text-sm mt-2 text-muted-foreground">{exp.description}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Formação */}
      {data.education.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Formação Acadêmica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.education.map((edu, i) => (
              <div key={i}>
                {i > 0 && <Separator className="mb-4" />}
                <div className="font-medium">{edu.degree}</div>
                <div className="text-sm text-primary">{edu.institution}</div>
                <div className="text-xs text-muted-foreground">
                  {edu.startDate && `${edu.startDate} - `}{edu.endDate || edu.year}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="h-4 w-4" />
              Competências
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, i) => (
                <Badge key={i} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Idiomas */}
      {data.languages && data.languages.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Idiomas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.languages.map((lang, i) => (
                <Badge key={i} variant="outline">
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
              <Award className="h-4 w-4" />
              Certificações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.certifications.map((cert, i) => (
              <div key={i} className="text-sm">
                <span className="font-medium">{cert.name}</span>
                {cert.issuer && <span className="text-muted-foreground"> • {cert.issuer}</span>}
                {cert.year && <span className="text-muted-foreground"> ({cert.year})</span>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
