import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Save, User, Briefcase, GraduationCap, Award } from 'lucide-react';
import type { ParsedResume } from '@/types/resumeParser';

interface ResumeEditFormProps {
  data: ParsedResume;
  onSave: (data: ParsedResume) => void;
  onCancel?: () => void;
}

export function ResumeEditForm({ data: initialData, onSave, onCancel }: ResumeEditFormProps) {
  const [data, setData] = useState<ParsedResume>(initialData);
  const [newSkill, setNewSkill] = useState('');

  const updatePersonalInfo = (field: keyof ParsedResume['personalInfo'], value: string) => {
    setData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  const addExperience = () => {
    setData((prev) => ({
      ...prev,
      experience: [...prev.experience, { title: '', company: '', startDate: '', description: '' }],
    }));
  };

  const updateExperience = (index: number, field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp, i) => (i === index ? { ...exp, [field]: value } : exp)),
    }));
  };

  const removeExperience = (index: number) => {
    setData((prev) => ({ ...prev, experience: prev.experience.filter((_, i) => i !== index) }));
  };

  const addEducation = () => {
    setData((prev) => ({
      ...prev,
      education: [...prev.education, { degree: '', institution: '', year: '' }],
    }));
  };

  const updateEducation = (index: number, field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.map((edu, i) => (i === index ? { ...edu, [field]: value } : edu)),
    }));
  };

  const removeEducation = (index: number) => {
    setData((prev) => ({ ...prev, education: prev.education.filter((_, i) => i !== index) }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !data.skills.includes(newSkill.trim())) {
      setData((prev) => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setData((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));
  };

  return (
    <div className="space-y-4">
      {/* Dados Pessoais */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4" />
            Dados Pessoais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input value={data.personalInfo.name} onChange={(e) => updatePersonalInfo('name', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input type="email" value={data.personalInfo.email || ''} onChange={(e) => updatePersonalInfo('email', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input value={data.personalInfo.phone || ''} onChange={(e) => updatePersonalInfo('phone', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Localização</Label>
              <Input value={data.personalInfo.location || ''} onChange={(e) => updatePersonalInfo('location', e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Experiências */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Experiência Profissional
            </CardTitle>
            <Button variant="outline" size="sm" onClick={addExperience}>
              <Plus className="h-4 w-4 mr-1" />
              Adicionar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.experience.map((exp, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="grid gap-3 flex-1 md:grid-cols-2">
                  <Input placeholder="Cargo" value={exp.title} onChange={(e) => updateExperience(i, 'title', e.target.value)} />
                  <Input placeholder="Empresa" value={exp.company} onChange={(e) => updateExperience(i, 'company', e.target.value)} />
                  <Input placeholder="Data Início" value={exp.startDate} onChange={(e) => updateExperience(i, 'startDate', e.target.value)} />
                  <Input placeholder="Data Fim" value={exp.endDate || ''} onChange={(e) => updateExperience(i, 'endDate', e.target.value)} />
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeExperience(i)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
              </div>
              <Textarea placeholder="Descrição" value={exp.description || ''} onChange={(e) => updateExperience(i, 'description', e.target.value)} rows={2} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Formação */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Formação Acadêmica
            </CardTitle>
            <Button variant="outline" size="sm" onClick={addEducation}>
              <Plus className="h-4 w-4 mr-1" />
              Adicionar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.education.map((edu, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="grid gap-3 flex-1 md:grid-cols-3">
                <Input placeholder="Curso/Grau" value={edu.degree} onChange={(e) => updateEducation(i, 'degree', e.target.value)} />
                <Input placeholder="Instituição" value={edu.institution} onChange={(e) => updateEducation(i, 'institution', e.target.value)} />
                <Input placeholder="Ano" value={edu.year || ''} onChange={(e) => updateEducation(i, 'year', e.target.value)} />
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeEducation(i)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Award className="h-4 w-4" />
            Competências
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input placeholder="Nova competência" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addSkill()} />
            <Button variant="outline" onClick={addSkill}><Plus className="h-4 w-4" /></Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="cursor-pointer" onClick={() => removeSkill(skill)}>
                {skill} <Trash2 className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex gap-2 justify-end">
        {onCancel && <Button variant="outline" onClick={onCancel}>Cancelar</Button>}
        <Button onClick={() => onSave(data)}><Save className="h-4 w-4 mr-2" />Salvar</Button>
      </div>
    </div>
  );
}
