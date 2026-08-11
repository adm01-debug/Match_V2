/**
 * @fileoverview ResumeParser component (shell orchestrator)
 * @module ResumeParser
 */

import { memo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { MatchScoreCalculator } from './MatchScoreCalculator';
import { ResumeUploadArea } from './resumeParser/ResumeUploadArea';
import { ParsedResumeCard } from './resumeParser/ParsedResumeCard';
import { useResumeParser } from './resumeParser/useResumeParser';
import type { ParsedResume } from './resumeParser/types';

export type { ParsedResume };

interface ResumeParserProps {
  onParsed?: (data: ParsedResume) => void;
  onCandidatoSaved?: (candidatoId: string) => void;
}

function ResumeParserBase({ onParsed, onCandidatoSaved }: ResumeParserProps) {
  const { toast } = useToast();
  const {
    isDragging, setIsDragging, isLoading, isSaving,
    parsedData, fileName, showMatchCalculator, setShowMatchCalculator,
    savedCandidatoId, validateAndParse, saveCandidato, clearData,
  } = useResumeParser({ onParsed, onCandidatoSaved });

  return (
    <div data-testid="resume-parser" className="space-y-6">
      <ResumeUploadArea
        isDragging={isDragging}
        setIsDragging={setIsDragging}
        isLoading={isLoading}
        fileName={fileName}
        hasParsedData={!!parsedData}
        savedCandidatoId={savedCandidatoId}
        onFile={validateAndParse}
      />

      {parsedData && (
        <ParsedResumeCard
          data={parsedData}
          isSaving={isSaving}
          savedCandidatoId={savedCandidatoId}
          showMatchCalculator={showMatchCalculator}
          onClear={clearData}
          onSave={saveCandidato}
          onToggleMatch={() => setShowMatchCalculator(!showMatchCalculator)}
        />
      )}

      {parsedData && savedCandidatoId && showMatchCalculator && (
        <MatchScoreCalculator
          candidatoId={savedCandidatoId}
          candidatoNome={parsedData.nome}
          onScoreCalculated={(score) => {
            toast({
              title: 'Match Score calculado',
              description: `Score salvo no histórico: ${score}%`,
            });
          }}
        />
      )}
    </div>
  );
}

export const ResumeParser = memo(ResumeParserBase);
ResumeParser.displayName = 'ResumeParser';

export default ResumeParser;
