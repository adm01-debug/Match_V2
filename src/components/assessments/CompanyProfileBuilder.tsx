/**
 * @fileoverview Construtor de Perfil Cultural da Empresa (orchestrator)
 */
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Scale, Target } from 'lucide-react';
import { useCompanyProfile } from './companyProfile/useCompanyProfile';
import { BuilderHeader } from './companyProfile/BuilderHeader';
import { PilaresTab } from './companyProfile/PilaresTab';
import { CulturaTab } from './companyProfile/CulturaTab';
import { DealbreakersTab } from './companyProfile/DealbreakersTab';
import { ProfilePreview } from './companyProfile/ProfilePreview';
import type { CompanyProfileBuilderProps } from './companyProfile/types';

export function CompanyProfileBuilder({ initialProfile, onSave, vagaId }: CompanyProfileBuilderProps) {
  const [activeTab, setActiveTab] = useState('pilares');
  const state = useCompanyProfile(initialProfile, vagaId);

  return (
    <div className="space-y-6">
      <BuilderHeader
        nome={state.nome}
        descricao={state.descricao}
        onNomeChange={state.setNome}
        onDescricaoChange={state.setDescricao}
        onReset={state.resetToDefaults}
        onSave={() => onSave(state.buildProfile())}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="pilares" className="gap-2"><Target className="h-4 w-4" />Pilares</TabsTrigger>
          <TabsTrigger value="cultura" className="gap-2"><Scale className="h-4 w-4" />Cultura</TabsTrigger>
          <TabsTrigger value="dealbreakers" className="gap-2"><AlertTriangle className="h-4 w-4" />Dealbreakers</TabsTrigger>
        </TabsList>

        <TabsContent value="pilares">
          <PilaresTab
            pilaresValorizados={state.pilaresValorizados}
            onChange={state.handlePilarChange}
            topPilares={state.topPilares}
            lowPilares={state.lowPilares}
          />
        </TabsContent>

        <TabsContent value="cultura">
          <CulturaTab culturaDimensoes={state.culturaDimensoes} onChange={state.handleCulturaChange} />
        </TabsContent>

        <TabsContent value="dealbreakers">
          <DealbreakersTab
            dealbreakers={state.dealbreakers}
            toggleDealbreaker={state.toggleDealbreaker}
            customDealbreaker={state.customDealbreaker}
            setCustomDealbreaker={state.setCustomDealbreaker}
            addCustomDealbreaker={state.addCustomDealbreaker}
          />
        </TabsContent>
      </Tabs>

      <ProfilePreview
        topPilares={state.topPilares}
        pilaresValorizados={state.pilaresValorizados}
        culturaDimensoes={state.culturaDimensoes}
        dealbreakers={state.dealbreakers}
      />
    </div>
  );
}

export default CompanyProfileBuilder;
