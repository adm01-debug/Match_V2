import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useWhiteLabel } from "@/hooks/useWhiteLabel";
import { Palette, Type, Mail, Globe, Upload, Loader2 } from "lucide-react";

export function WhiteLabelSettings() {
  const { toast } = useToast();
  const { config, updateConfig, isUpdating } = useWhiteLabel();
  const [localConfig, setLocalConfig] = useState(config);

  const handleChange = (key: string, value: string) => {
    setLocalConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      await updateConfig(localConfig);
      toast({ title: "Configurações salvas!" });
    } catch {
      toast({ title: "Erro ao salvar", variant: "destructive" });
    }
  };

  const ColorPicker = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input type="color" value={value} onChange={e => onChange(e.target.value)} className="w-12 h-10 p-1" />
        <Input value={value} onChange={e => onChange(e.target.value)} className="flex-1 font-mono" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">White-Label</h2>
          <p className="text-muted-foreground">Personalize a aparência do sistema</p>
        </div>
        <Button onClick={handleSave} disabled={isUpdating}>
          {isUpdating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Salvar Alterações
        </Button>
      </div>

      <Tabs defaultValue="branding">
        <TabsList>
          <TabsTrigger value="branding">Marca</TabsTrigger>
          <TabsTrigger value="colors">Cores</TabsTrigger>
          <TabsTrigger value="typography">Tipografia</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Identidade Visual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nome da Empresa</Label>
                <Input value={localConfig.companyName} onChange={e => handleChange("companyName", e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Logo (URL)</Label>
                  <div className="flex gap-2">
                    <Input value={localConfig.logo} onChange={e => handleChange("logo", e.target.value)} />
                    <Button variant="outline" size="icon"><Upload className="h-4 w-4" /></Button>
                  </div>
                  {localConfig.logo && (
                    <div className="p-4 border rounded-lg bg-muted/50">
                      <img src={localConfig.logo} alt="Logo preview" className="h-12 object-contain" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Favicon (URL)</Label>
                  <Input value={localConfig.favicon} onChange={e => handleChange("favicon", e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Domínio Customizado</Label>
                <Input value={localConfig.customDomain || ""} onChange={e => handleChange("customDomain", e.target.value)} placeholder="app.suaempresa.com" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="colors" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Paleta de Cores
              </CardTitle>
              <CardDescription>Personalize as cores do sistema</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <ColorPicker label="Cor Primária" value={localConfig.primaryColor} onChange={v => handleChange("primaryColor", v)} />
              <ColorPicker label="Cor Secundária" value={localConfig.secondaryColor} onChange={v => handleChange("secondaryColor", v)} />
              <ColorPicker label="Cor de Destaque" value={localConfig.accentColor} onChange={v => handleChange("accentColor", v)} />
              <ColorPicker label="Fundo" value={localConfig.backgroundColor} onChange={v => handleChange("backgroundColor", v)} />
              <ColorPicker label="Texto" value={localConfig.textColor} onChange={v => handleChange("textColor", v)} />
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-6 rounded-lg" style={{ backgroundColor: localConfig.backgroundColor, color: localConfig.textColor }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: localConfig.primaryColor }}>{localConfig.companyName}</h3>
                <div className="flex gap-2">
                  <button className="px-4 py-2 rounded" style={{ backgroundColor: localConfig.primaryColor, color: "#fff" }}>Primário</button>
                  <button className="px-4 py-2 rounded" style={{ backgroundColor: localConfig.secondaryColor, color: "#fff" }}>Secundário</button>
                  <button className="px-4 py-2 rounded" style={{ backgroundColor: localConfig.accentColor, color: "#fff" }}>Destaque</button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="typography" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                Tipografia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Fonte Principal</Label>
                <Input value={localConfig.fontFamily} onChange={e => handleChange("fontFamily", e.target.value)} placeholder="Inter, sans-serif" />
              </div>
              <div className="space-y-2">
                <Label>Fonte de Títulos</Label>
                <Input value={localConfig.headingFontFamily || ""} onChange={e => handleChange("headingFontFamily", e.target.value)} placeholder="Inter, sans-serif" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Configurações de Email
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email de Envio</Label>
                  <Input type="email" value={localConfig.fromEmail} onChange={e => handleChange("fromEmail", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Nome do Remetente</Label>
                  <Input value={localConfig.fromName} onChange={e => handleChange("fromName", e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Rodapé do Email</Label>
                <Input value={localConfig.emailFooter || ""} onChange={e => handleChange("emailFooter", e.target.value)} placeholder="© 2025 Sua Empresa. Todos os direitos reservados." />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
