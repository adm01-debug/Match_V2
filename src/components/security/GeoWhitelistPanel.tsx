/**
 * @fileoverview Geographic Whitelist Management Panel
 * @module components/security/GeoWhitelistPanel
 * @description Painel para gerenciamento de países permitidos
 */

import { useState, memo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Globe, Plus, Trash2, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  getAllowedCountries,
  addCountryToWhitelist,
  removeCountryFromWhitelist,
  toggleCountryStatus,
} from '@/services/geoService';

// Lista de países comuns
const COMMON_COUNTRIES = [
  { code: 'BR', name: 'Brasil' },
  { code: 'US', name: 'Estados Unidos' },
  { code: 'PT', name: 'Portugal' },
  { code: 'ES', name: 'Espanha' },
  { code: 'AR', name: 'Argentina' },
  { code: 'MX', name: 'México' },
  { code: 'CO', name: 'Colômbia' },
  { code: 'CL', name: 'Chile' },
  { code: 'PE', name: 'Peru' },
  { code: 'UY', name: 'Uruguai' },
  { code: 'PY', name: 'Paraguai' },
  { code: 'DE', name: 'Alemanha' },
  { code: 'FR', name: 'França' },
  { code: 'IT', name: 'Itália' },
  { code: 'GB', name: 'Reino Unido' },
  { code: 'CA', name: 'Canadá' },
  { code: 'JP', name: 'Japão' },
  { code: 'CN', name: 'China' },
  { code: 'AU', name: 'Austrália' },
  { code: 'IN', name: 'Índia' },
];

export const GeoWhitelistPanel = memo(() => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: countries = [], isLoading } = useQuery({
    queryKey: ['allowed-countries'],
    queryFn: getAllowedCountries,
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const country = COMMON_COUNTRIES.find(c => c.code === selectedCountry);
      if (!country) throw new Error('País não encontrado');
      return addCountryToWhitelist(country.code, country.name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allowed-countries'] });
      toast({ title: 'País adicionado com sucesso' });
      setIsDialogOpen(false);
      setSelectedCountry('');
    },
    onError: () => {
      toast({ title: 'Erro ao adicionar país', variant: 'destructive' });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      toggleCountryStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allowed-countries'] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeCountryFromWhitelist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allowed-countries'] });
      toast({ title: 'País removido com sucesso' });
    },
    onError: () => {
      toast({ title: 'Erro ao remover país', variant: 'destructive' });
    },
  });

  // Filtrar países já adicionados
  const availableCountries = COMMON_COUNTRIES.filter(
    c => !countries.some(ac => ac.countryCode === c.code)
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Bloqueio Geográfico</CardTitle>
              <CardDescription>
                Gerencie os países autorizados a acessar o sistema
              </CardDescription>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar País
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar País</DialogTitle>
                <DialogDescription>
                  Selecione um país para adicionar à lista de permitidos
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>País</Label>
                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um país" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCountries.map(country => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name} ({country.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => addMutation.mutate()}
                  disabled={!selectedCountry || addMutation.isPending}
                >
                  {addMutation.isPending && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Adicionar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : countries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum país na whitelist</p>
            <p className="text-sm">Adicione países para permitir acesso</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>País</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {countries.map(country => (
                <TableRow key={country.id}>
                  <TableCell className="font-medium">
                    {country.countryName}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{country.countryCode}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={country.isActive ? 'default' : 'secondary'}>
                      {country.isActive ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          toggleMutation.mutate({
                            id: country.id,
                            isActive: !country.isActive,
                          })
                        }
                        disabled={toggleMutation.isPending}
                      >
                        {country.isActive ? (
                          <ToggleRight className="h-4 w-4 text-green-500" />
                        ) : (
                          <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeMutation.mutate(country.id)}
                        disabled={removeMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
});

GeoWhitelistPanel.displayName = 'GeoWhitelistPanel';

export default GeoWhitelistPanel;
