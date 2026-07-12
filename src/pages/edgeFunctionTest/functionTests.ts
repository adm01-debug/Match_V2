import {
  FileText, Target, Mail, MessageSquare, Github, Globe, ShieldAlert, RefreshCw,
} from 'lucide-react';
import type { FunctionTest } from './types';

export const FUNCTION_TESTS: FunctionTest[] = [
  { name: 'health', label: 'Health Check', icon: RefreshCw, description: 'Verifica se o serviço está online', body: {}, isProtected: false },
  { name: 'geo-check', label: 'Geo Check', icon: Globe, description: 'Verifica localização geográfica por IP', body: { ip: '8.8.8.8' }, isProtected: false },
  { name: 'ip-guard', label: 'IP Guard', icon: ShieldAlert, description: 'Verifica se IP está bloqueado', body: { ip: '192.168.1.1', action: 'check' }, isProtected: false },
  { name: 'parse-resume', label: 'Parse Resume', icon: FileText, description: 'Extrai dados de currículo (requer auth)', body: { resumeUrl: 'https://example.com/test.pdf', candidatoId: 'test-id' }, isProtected: true },
  { name: 'match-score', label: 'Match Score', icon: Target, description: 'Calcula compatibilidade candidato/vaga (requer auth)', body: { candidatoId: 'test-id', vagaId: 'test-vaga-id' }, isProtected: true },
  { name: 'send-email', label: 'Send Email', icon: Mail, description: 'Envia email via Resend (requer auth)', body: { to: 'test@example.com', subject: 'Teste de Email', html: '<p>Este é um teste</p>' }, isProtected: true },
  { name: 'send-whatsapp', label: 'Send WhatsApp', icon: MessageSquare, description: 'Envia mensagem WhatsApp (requer auth)', body: { to: '+5511999999999', message: 'Teste de WhatsApp' }, isProtected: true },
  { name: 'github-api', label: 'GitHub API', icon: Github, description: 'Busca dados do GitHub (requer auth)', body: { username: 'octocat' }, isProtected: true },
];
