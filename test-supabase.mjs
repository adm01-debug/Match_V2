// Script para testar conexão com Supabase
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://kjymlggxuoqsakjkjnkc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqeW1sZ2d4dW9xc2FramtqbmtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0Mjg1NTgsImV4cCI6MjEwMTAwNDU1OH0.iqNVhXAcmX-RhFlPlJhsuZxGvytnCJGzFBC4On51u8w';

async function testConnection() {
  console.log('🔄 Testando conexão com Supabase...\n');
  console.log('URL:', SUPABASE_URL);

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  try {
    // Teste 1: Verificar se o servidor está respondendo
    console.log('\n📡 Teste 1: Verificando kesehatan do servidor...');
    const { data: healthData, error: healthError } = await supabase.from('profiles').select('count').limit(1);

    if (healthError) {
      console.log('❌ Erro na conexão:', healthError.message);
      console.log('Código do erro:', healthError.code);
    } else {
      console.log('✅ Conexão estabelecida com sucesso!');
      console.log('Resposta:', healthData);
    }

    // Teste 2: Listar algumas tabelas
    console.log('\n📊 Teste 2: Verificando acesso ao banco...');
    const { data: tableData, error: tableError } = await supabase
      .from('profiles')
      .select('id, email, nome')
      .limit(3);

    if (tableError) {
      console.log('⚠️ Erro ao acessar tabela profiles:', tableError.message);
    } else {
      console.log('✅ Tabela profiles acessível!');
      console.log('Dados encontrados:', tableData?.length || 0, 'registros');
      if (tableData && tableData.length > 0) {
        console.log('Amostra:', tableData[0]);
      }
    }

    // Teste 3: Verificar candidatos
    console.log('\n👥 Teste 3: Verificando tabela candidatos...');
    const { data: candidatosData, error: candidatosError } = await supabase
      .from('candidatos')
      .select('id, nome, email')
      .limit(3);

    if (candidatosError) {
      console.log('⚠️ Erro ao acessar tabela candidatos:', candidatosError.message);
    } else {
      console.log('✅ Tabela candidatos acessível!');
      console.log('Total de candidatos:', candidatosData?.length || 0, 'registros');
    }

    console.log('\n✅ Teste de conexão concluído!');

  } catch (error) {
    console.error('\n❌ Erro fatal:', error);
  }
}

testConnection();
