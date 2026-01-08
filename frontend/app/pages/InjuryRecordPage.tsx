'use client';

import { useMemo, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { getStatusColor } from '@/utils/getStatusColor';
import { getSeverityColor } from '@/utils/getSeverityColor';
import { getStatusText } from '@/utils/getStatusText';
import { getSeverityText } from '@/utils/getSeverityText';
import HeaderInjuryRecord from '../components/HeaderInjuryRecord';
import { useGetInjuryRecords } from '@/hooks/useGetInjuryRecord';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const InjuryRecordPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [teamFilter, setTeamFilter] = useState<string>('all');
  const {
    data: injuries = [],
    isLoading,
    error,
    refetch,
  } = useGetInjuryRecords();

  const teams = [...new Set(injuries.map((injury) => injury.team))].filter(
    Boolean
  );

  const filteredInjuries = useMemo(() => {
    let filtered = injuries;

    if (searchTerm) {
      filtered = filtered.filter(
        (injury) =>
          injury.athlete_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          injury.injuryType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          injury.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((injury) => injury.status === statusFilter);
    }

    if (severityFilter !== 'all') {
      filtered = filtered.filter(
        (injury) => injury.severity === severityFilter
      );
    }

    if (teamFilter !== 'all') {
      filtered = filtered.filter((injury) => injury.team === teamFilter);
    }

    return filtered;
  }, [injuries, searchTerm, statusFilter, severityFilter, teamFilter]); 

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">
        <p className="text-xl">Carregando registros...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">
        <p className="text-xl">Erro ao carregar registros</p>
        <Button onClick={() => refetch()} className="mt-4">
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <HeaderInjuryRecord />

      <div className="flex flex-wrap gap-4 m-6">
        <Input
          type="text"
          placeholder="Buscar atleta, tipo ou descrição..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-zinc-800 text-white border-zinc-700"
        />

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="bg-zinc-800 text-white border-zinc-700">
            <SelectValue placeholder="Todos os Status" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 text-white border-zinc-700">
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="active">Ativo</SelectItem>
            <SelectItem value="recovering">Recuperando</SelectItem>
            <SelectItem value="recovered">Recuperado</SelectItem>
          </SelectContent>
        </Select>

        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="bg-zinc-800 text-white border-zinc-700">
            <SelectValue placeholder="Todas Gravidades" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 text-white border-zinc-700">
            <SelectItem value="all">Todas Gravidades</SelectItem>
            <SelectItem value="minor">Leve</SelectItem>
            <SelectItem value="moderate">Moderado</SelectItem>
            <SelectItem value="severe">Grave</SelectItem>
            <SelectItem value="critical">Crítico</SelectItem>
          </SelectContent>
        </Select>

        <Select value={teamFilter} onValueChange={setTeamFilter}>
          <SelectTrigger className="bg-zinc-800 text-white border-zinc-700">
            <SelectValue placeholder="Todos os Times" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 text-white border-zinc-700 max-h-60 overflow-auto">
            <SelectItem value="all">Todos os Times</SelectItem>
            {teams.map((team) => (
              <SelectItem key={team} value={team}>
                {team}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabela shadcn */}
      <div className="bg-zinc-800 rounded-xl p-4 overflow-x-auto">
        <Table>
          <TableCaption>Registros de lesões</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Atleta</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Gravidade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Dias Afastado</TableHead>
              <TableHead className="text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInjuries.map((injury) => (
              <TableRow key={injury.id}>
                <TableCell>{injury.athlete_name}</TableCell>
                <TableCell>{injury.injuryType}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(
                      injury.severity
                    )}`}
                  >
                    {getSeverityText(injury.severity)}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(
                      injury.status
                    )}`}
                  >
                    {getStatusText(injury.status)}
                  </span>
                </TableCell>
                <TableCell>{formatDate(injury.createdAt)}</TableCell>
                <TableCell>{injury.daysOut}</TableCell>
                <TableCell className="flex gap-2 justify-center">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-blue-500 hover:text-blue-400"
                    onClick={() => console.log('Editar', injury.id)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-red-500 hover:text-red-400"
                    onClick={() => console.log('Deletar', injury.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredInjuries.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-400">
                  Nenhum registro encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default InjuryRecordPage;
