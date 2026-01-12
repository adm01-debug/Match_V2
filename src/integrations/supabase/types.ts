export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      allowed_countries: {
        Row: {
          added_by: string | null
          country_code: string
          country_name: string
          created_at: string
          id: string
          is_active: boolean
          updated_at: string
        }
        Insert: {
          added_by?: string | null
          country_code: string
          country_name: string
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Update: {
          added_by?: string | null
          country_code?: string
          country_name?: string
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      allowed_ips: {
        Row: {
          added_by: string | null
          created_at: string
          description: string | null
          id: string
          ip_address: string
          is_active: boolean
          updated_at: string
        }
        Insert: {
          added_by?: string | null
          created_at?: string
          description?: string | null
          id?: string
          ip_address: string
          is_active?: boolean
          updated_at?: string
        }
        Update: {
          added_by?: string | null
          created_at?: string
          description?: string | null
          id?: string
          ip_address?: string
          is_active?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      assessment_questoes: {
        Row: {
          assessment_id: string | null
          created_at: string | null
          dimensao: string | null
          id: string
          obrigatoria: boolean | null
          opcoes: Json | null
          ordem: number | null
          peso: number | null
          texto: string
          tipo: string
        }
        Insert: {
          assessment_id?: string | null
          created_at?: string | null
          dimensao?: string | null
          id?: string
          obrigatoria?: boolean | null
          opcoes?: Json | null
          ordem?: number | null
          peso?: number | null
          texto: string
          tipo: string
        }
        Update: {
          assessment_id?: string | null
          created_at?: string | null
          dimensao?: string | null
          id?: string
          obrigatoria?: boolean | null
          opcoes?: Json | null
          ordem?: number | null
          peso?: number | null
          texto?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_questoes_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_respostas: {
        Row: {
          assessment_id: string | null
          candidato_id: string | null
          created_at: string | null
          finalizado_em: string | null
          id: string
          iniciado_em: string | null
          processo_id: string | null
          respostas: Json
          resultados: Json | null
          status: string | null
          tempo_gasto: number | null
        }
        Insert: {
          assessment_id?: string | null
          candidato_id?: string | null
          created_at?: string | null
          finalizado_em?: string | null
          id?: string
          iniciado_em?: string | null
          processo_id?: string | null
          respostas: Json
          resultados?: Json | null
          status?: string | null
          tempo_gasto?: number | null
        }
        Update: {
          assessment_id?: string | null
          candidato_id?: string | null
          created_at?: string | null
          finalizado_em?: string | null
          id?: string
          iniciado_em?: string | null
          processo_id?: string | null
          respostas?: Json
          resultados?: Json | null
          status?: string | null
          tempo_gasto?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "assessment_respostas_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_respostas_candidato_id_fkey"
            columns: ["candidato_id"]
            isOneToOne: false
            referencedRelation: "candidatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_respostas_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: false
            referencedRelation: "processos_seletivos"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          descricao: string | null
          duracao_estimada: number | null
          id: string
          instrucoes: string | null
          tipo: string
          titulo: string
          total_questoes: number | null
          updated_at: string | null
          versao: number | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          duracao_estimada?: number | null
          id?: string
          instrucoes?: string | null
          tipo: string
          titulo: string
          total_questoes?: number | null
          updated_at?: string | null
          versao?: number | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          duracao_estimada?: number | null
          id?: string
          instrucoes?: string | null
          tipo?: string
          titulo?: string
          total_questoes?: number | null
          updated_at?: string | null
          versao?: number | null
        }
        Relationships: []
      }
      bateria_provas_rel: {
        Row: {
          bateria_id: string
          id: string
          obrigatoria: boolean
          ordem: number
          prova_id: string
        }
        Insert: {
          bateria_id: string
          id?: string
          obrigatoria?: boolean
          ordem?: number
          prova_id: string
        }
        Update: {
          bateria_id?: string
          id?: string
          obrigatoria?: boolean
          ordem?: number
          prova_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bateria_provas_rel_bateria_id_fkey"
            columns: ["bateria_id"]
            isOneToOne: false
            referencedRelation: "baterias_provas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bateria_provas_rel_prova_id_fkey"
            columns: ["prova_id"]
            isOneToOne: false
            referencedRelation: "provas"
            referencedColumns: ["id"]
          },
        ]
      }
      baterias_provas: {
        Row: {
          ativo: boolean
          created_at: string
          departamento: string
          descricao: string | null
          duracao_total: number
          id: string
          nivel: string
          nome: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          departamento?: string
          descricao?: string | null
          duracao_total?: number
          id?: string
          nivel?: string
          nome: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          departamento?: string
          descricao?: string | null
          duracao_total?: number
          id?: string
          nivel?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      behavioral_assessment_results: {
        Row: {
          answers: Json
          candidato_id: string | null
          completed_at: string | null
          created_at: string
          id: string
          primary_result: string | null
          processo_id: string | null
          results: Json
          score: number | null
          secondary_result: string | null
          started_at: string | null
          time_spent: number | null
          tool_id: string
          tool_name: string
          updated_at: string
        }
        Insert: {
          answers?: Json
          candidato_id?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          primary_result?: string | null
          processo_id?: string | null
          results?: Json
          score?: number | null
          secondary_result?: string | null
          started_at?: string | null
          time_spent?: number | null
          tool_id: string
          tool_name: string
          updated_at?: string
        }
        Update: {
          answers?: Json
          candidato_id?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          primary_result?: string | null
          processo_id?: string | null
          results?: Json
          score?: number | null
          secondary_result?: string | null
          started_at?: string | null
          time_spent?: number | null
          tool_id?: string
          tool_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "behavioral_assessment_results_candidato_id_fkey"
            columns: ["candidato_id"]
            isOneToOne: false
            referencedRelation: "candidatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "behavioral_assessment_results_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: false
            referencedRelation: "processos_seletivos"
            referencedColumns: ["id"]
          },
        ]
      }
      blocked_ips: {
        Row: {
          blocked_at: string
          blocked_by: string | null
          created_at: string
          expires_at: string | null
          id: string
          ip_address: string
          is_permanent: boolean
          reason: string | null
        }
        Insert: {
          blocked_at?: string
          blocked_by?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          ip_address: string
          is_permanent?: boolean
          reason?: string | null
        }
        Update: {
          blocked_at?: string
          blocked_by?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          ip_address?: string
          is_permanent?: boolean
          reason?: string | null
        }
        Relationships: []
      }
      candidatos: {
        Row: {
          arquivo_curriculo: string | null
          created_at: string | null
          email: string
          experiencias: Json | null
          fonte: string | null
          formacao: Json | null
          habilidades: string[] | null
          id: string
          nome: string
          resumo: string | null
          status: string | null
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          arquivo_curriculo?: string | null
          created_at?: string | null
          email: string
          experiencias?: Json | null
          fonte?: string | null
          formacao?: Json | null
          habilidades?: string[] | null
          id?: string
          nome: string
          resumo?: string | null
          status?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          arquivo_curriculo?: string | null
          created_at?: string | null
          email?: string
          experiencias?: Json | null
          fonte?: string | null
          formacao?: Json | null
          habilidades?: string[] | null
          id?: string
          nome?: string
          resumo?: string | null
          status?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      candidatos_auth: {
        Row: {
          candidato_id: string | null
          created_at: string
          curriculo_nome: string | null
          curriculo_url: string | null
          email: string
          id: string
          nome: string
          telefone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          candidato_id?: string | null
          created_at?: string
          curriculo_nome?: string | null
          curriculo_url?: string | null
          email: string
          id?: string
          nome: string
          telefone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          candidato_id?: string | null
          created_at?: string
          curriculo_nome?: string | null
          curriculo_url?: string | null
          email?: string
          id?: string
          nome?: string
          telefone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidatos_auth_candidato_id_fkey"
            columns: ["candidato_id"]
            isOneToOne: false
            referencedRelation: "candidatos"
            referencedColumns: ["id"]
          },
        ]
      }
      candidaturas: {
        Row: {
          candidato_auth_id: string
          carta_apresentacao: string | null
          created_at: string
          curriculo_url: string | null
          data_candidatura: string
          etapa_atual: string
          id: string
          processo_id: string | null
          status: string
          updated_at: string
          vaga_id: string
        }
        Insert: {
          candidato_auth_id: string
          carta_apresentacao?: string | null
          created_at?: string
          curriculo_url?: string | null
          data_candidatura?: string
          etapa_atual?: string
          id?: string
          processo_id?: string | null
          status?: string
          updated_at?: string
          vaga_id: string
        }
        Update: {
          candidato_auth_id?: string
          carta_apresentacao?: string | null
          created_at?: string
          curriculo_url?: string | null
          data_candidatura?: string
          etapa_atual?: string
          id?: string
          processo_id?: string | null
          status?: string
          updated_at?: string
          vaga_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidaturas_candidato_auth_id_fkey"
            columns: ["candidato_auth_id"]
            isOneToOne: false
            referencedRelation: "candidatos_auth"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidaturas_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: false
            referencedRelation: "processos_seletivos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidaturas_vaga_id_fkey"
            columns: ["vaga_id"]
            isOneToOne: false
            referencedRelation: "vagas"
            referencedColumns: ["id"]
          },
        ]
      }
      comparativos_candidatos: {
        Row: {
          candidatos_ids: string[]
          created_at: string | null
          criterios_comparados: string[] | null
          gerado_por: string | null
          id: string
          resultado: Json | null
          vaga_id: string | null
        }
        Insert: {
          candidatos_ids: string[]
          created_at?: string | null
          criterios_comparados?: string[] | null
          gerado_por?: string | null
          id?: string
          resultado?: Json | null
          vaga_id?: string | null
        }
        Update: {
          candidatos_ids?: string[]
          created_at?: string | null
          criterios_comparados?: string[] | null
          gerado_por?: string | null
          id?: string
          resultado?: Json | null
          vaga_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comparativos_candidatos_vaga_id_fkey"
            columns: ["vaga_id"]
            isOneToOne: false
            referencedRelation: "vagas"
            referencedColumns: ["id"]
          },
        ]
      }
      competencias: {
        Row: {
          ativo: boolean | null
          categoria: string | null
          created_at: string | null
          descricao: string | null
          id: string
          indicadores_comportamentais: string[] | null
          nome: string
          perguntas_sugeridas: string[] | null
          tipo: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          categoria?: string | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          indicadores_comportamentais?: string[] | null
          nome: string
          perguntas_sugeridas?: string[] | null
          tipo?: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          categoria?: string | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          indicadores_comportamentais?: string[] | null
          nome?: string
          perguntas_sugeridas?: string[] | null
          tipo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      comunicacoes: {
        Row: {
          assunto: string
          candidato_id: string
          conteudo: string
          created_at: string
          enviado_em: string
          enviado_por: string | null
          id: string
          template_etapa: string
          template_nome: string
        }
        Insert: {
          assunto: string
          candidato_id: string
          conteudo: string
          created_at?: string
          enviado_em?: string
          enviado_por?: string | null
          id?: string
          template_etapa: string
          template_nome: string
        }
        Update: {
          assunto?: string
          candidato_id?: string
          conteudo?: string
          created_at?: string
          enviado_em?: string
          enviado_por?: string | null
          id?: string
          template_etapa?: string
          template_nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "comunicacoes_candidato_id_fkey"
            columns: ["candidato_id"]
            isOneToOne: false
            referencedRelation: "candidatos"
            referencedColumns: ["id"]
          },
        ]
      }
      criterios_selecao: {
        Row: {
          ativo: boolean | null
          competencia_id: string | null
          created_at: string | null
          descricao: string | null
          id: string
          nome: string
          nota_minima: number | null
          ordem: number | null
          perfil_cargo_id: string | null
          peso: number | null
          tipo: string
        }
        Insert: {
          ativo?: boolean | null
          competencia_id?: string | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome: string
          nota_minima?: number | null
          ordem?: number | null
          perfil_cargo_id?: string | null
          peso?: number | null
          tipo?: string
        }
        Update: {
          ativo?: boolean | null
          competencia_id?: string | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          nota_minima?: number | null
          ordem?: number | null
          perfil_cargo_id?: string | null
          peso?: number | null
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "criterios_selecao_competencia_id_fkey"
            columns: ["competencia_id"]
            isOneToOne: false
            referencedRelation: "competencias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "criterios_selecao_perfil_cargo_id_fkey"
            columns: ["perfil_cargo_id"]
            isOneToOne: false
            referencedRelation: "perfis_cargo"
            referencedColumns: ["id"]
          },
        ]
      }
      entrevista_respostas: {
        Row: {
          avaliador_id: string | null
          created_at: string | null
          entrevista_id: string | null
          id: string
          nota: number | null
          observacoes: string | null
          pergunta_id: string | null
          resposta_candidato: string | null
          template_id: string | null
        }
        Insert: {
          avaliador_id?: string | null
          created_at?: string | null
          entrevista_id?: string | null
          id?: string
          nota?: number | null
          observacoes?: string | null
          pergunta_id?: string | null
          resposta_candidato?: string | null
          template_id?: string | null
        }
        Update: {
          avaliador_id?: string | null
          created_at?: string | null
          entrevista_id?: string | null
          id?: string
          nota?: number | null
          observacoes?: string | null
          pergunta_id?: string | null
          resposta_candidato?: string | null
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "entrevista_respostas_entrevista_id_fkey"
            columns: ["entrevista_id"]
            isOneToOne: false
            referencedRelation: "entrevistas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entrevista_respostas_pergunta_id_fkey"
            columns: ["pergunta_id"]
            isOneToOne: false
            referencedRelation: "template_perguntas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entrevista_respostas_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates_entrevista"
            referencedColumns: ["id"]
          },
        ]
      }
      entrevistas: {
        Row: {
          candidato_id: string | null
          candidato_nome: string
          created_at: string
          created_by: string | null
          data: string
          entrevistadores: string[]
          etapa: string
          feedback_avaliado_em: string | null
          feedback_avaliado_por: string | null
          feedback_comentarios: string | null
          feedback_nota: number | null
          feedback_pontos_fortes: string[] | null
          feedback_pontos_melhorar: string[] | null
          feedback_recomendacao: string | null
          feedback_resultado: string | null
          hora_fim: string
          hora_inicio: string
          id: string
          link_online: string | null
          local: string | null
          observacoes: string | null
          status: string
          tipo: string
          updated_at: string
          vaga_id: string
          vaga_titulo: string
        }
        Insert: {
          candidato_id?: string | null
          candidato_nome: string
          created_at?: string
          created_by?: string | null
          data: string
          entrevistadores?: string[]
          etapa: string
          feedback_avaliado_em?: string | null
          feedback_avaliado_por?: string | null
          feedback_comentarios?: string | null
          feedback_nota?: number | null
          feedback_pontos_fortes?: string[] | null
          feedback_pontos_melhorar?: string[] | null
          feedback_recomendacao?: string | null
          feedback_resultado?: string | null
          hora_fim: string
          hora_inicio: string
          id?: string
          link_online?: string | null
          local?: string | null
          observacoes?: string | null
          status?: string
          tipo: string
          updated_at?: string
          vaga_id: string
          vaga_titulo: string
        }
        Update: {
          candidato_id?: string | null
          candidato_nome?: string
          created_at?: string
          created_by?: string | null
          data?: string
          entrevistadores?: string[]
          etapa?: string
          feedback_avaliado_em?: string | null
          feedback_avaliado_por?: string | null
          feedback_comentarios?: string | null
          feedback_nota?: number | null
          feedback_pontos_fortes?: string[] | null
          feedback_pontos_melhorar?: string[] | null
          feedback_recomendacao?: string | null
          feedback_resultado?: string | null
          hora_fim?: string
          hora_inicio?: string
          id?: string
          link_online?: string | null
          local?: string | null
          observacoes?: string | null
          status?: string
          tipo?: string
          updated_at?: string
          vaga_id?: string
          vaga_titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "entrevistas_candidato_id_fkey"
            columns: ["candidato_id"]
            isOneToOne: false
            referencedRelation: "candidatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entrevistas_vaga_id_fkey"
            columns: ["vaga_id"]
            isOneToOne: false
            referencedRelation: "vagas"
            referencedColumns: ["id"]
          },
        ]
      }
      geo_access_logs: {
        Row: {
          allowed: boolean
          country_code: string | null
          country_name: string | null
          created_at: string
          id: string
          ip_address: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          allowed: boolean
          country_code?: string | null
          country_name?: string | null
          created_at?: string
          id?: string
          ip_address: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          allowed?: boolean
          country_code?: string | null
          country_name?: string | null
          created_at?: string
          id?: string
          ip_address?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      indicacoes: {
        Row: {
          bonus: number | null
          candidato_email: string
          candidato_nome: string
          candidato_telefone: string | null
          created_at: string
          id: string
          indicador_email: string
          indicador_nome: string
          indicador_user_id: string | null
          observacao: string | null
          status: string
          updated_at: string
          vaga_id: string | null
          vaga_titulo: string
        }
        Insert: {
          bonus?: number | null
          candidato_email: string
          candidato_nome: string
          candidato_telefone?: string | null
          created_at?: string
          id?: string
          indicador_email: string
          indicador_nome: string
          indicador_user_id?: string | null
          observacao?: string | null
          status?: string
          updated_at?: string
          vaga_id?: string | null
          vaga_titulo: string
        }
        Update: {
          bonus?: number | null
          candidato_email?: string
          candidato_nome?: string
          candidato_telefone?: string | null
          created_at?: string
          id?: string
          indicador_email?: string
          indicador_nome?: string
          indicador_user_id?: string | null
          observacao?: string | null
          status?: string
          updated_at?: string
          vaga_id?: string | null
          vaga_titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "indicacoes_vaga_id_fkey"
            columns: ["vaga_id"]
            isOneToOne: false
            referencedRelation: "vagas"
            referencedColumns: ["id"]
          },
        ]
      }
      ip_access_logs: {
        Row: {
          action: string
          allowed: boolean
          created_at: string
          endpoint: string | null
          id: string
          ip_address: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          allowed: boolean
          created_at?: string
          endpoint?: string | null
          id?: string
          ip_address: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          allowed?: boolean
          created_at?: string
          endpoint?: string | null
          id?: string
          ip_address?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      login_attempts: {
        Row: {
          attempt_type: string
          attempts_count: number
          created_at: string
          first_attempt_at: string
          id: string
          identifier: string
          last_attempt_at: string
          locked_until: string | null
          updated_at: string
        }
        Insert: {
          attempt_type?: string
          attempts_count?: number
          created_at?: string
          first_attempt_at?: string
          id?: string
          identifier: string
          last_attempt_at?: string
          locked_until?: string | null
          updated_at?: string
        }
        Update: {
          attempt_type?: string
          attempts_count?: number
          created_at?: string
          first_attempt_at?: string
          id?: string
          identifier?: string
          last_attempt_at?: string
          locked_until?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      match_scores: {
        Row: {
          analise: string | null
          candidato_id: string
          created_at: string | null
          habilidades_extras: string[] | null
          habilidades_faltantes: string[] | null
          habilidades_match: string[] | null
          id: string
          pontos_atencao: string[] | null
          pontos_fortes: string[] | null
          recomendacao: string | null
          score_experiencia: number | null
          score_formacao: number | null
          score_habilidades: number | null
          score_total: number
          vaga_id: string
          vaga_titulo: string
        }
        Insert: {
          analise?: string | null
          candidato_id: string
          created_at?: string | null
          habilidades_extras?: string[] | null
          habilidades_faltantes?: string[] | null
          habilidades_match?: string[] | null
          id?: string
          pontos_atencao?: string[] | null
          pontos_fortes?: string[] | null
          recomendacao?: string | null
          score_experiencia?: number | null
          score_formacao?: number | null
          score_habilidades?: number | null
          score_total: number
          vaga_id: string
          vaga_titulo: string
        }
        Update: {
          analise?: string | null
          candidato_id?: string
          created_at?: string | null
          habilidades_extras?: string[] | null
          habilidades_faltantes?: string[] | null
          habilidades_match?: string[] | null
          id?: string
          pontos_atencao?: string[] | null
          pontos_fortes?: string[] | null
          recomendacao?: string | null
          score_experiencia?: number | null
          score_formacao?: number | null
          score_habilidades?: number | null
          score_total?: number
          vaga_id?: string
          vaga_titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_scores_candidato_id_fkey"
            columns: ["candidato_id"]
            isOneToOne: false
            referencedRelation: "candidatos"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          match_score: number | null
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          match_score?: number | null
          message: string
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          match_score?: number | null
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      password_reset_requests: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          reason: string | null
          requested_at: string
          reset_token: string | null
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          token_expires_at: string | null
          updated_at: string
          user_email: string
          user_id: string
          user_name: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          reason?: string | null
          requested_at?: string
          reset_token?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          token_expires_at?: string | null
          updated_at?: string
          user_email: string
          user_id: string
          user_name?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          reason?: string | null
          requested_at?: string
          reset_token?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          token_expires_at?: string | null
          updated_at?: string
          user_email?: string
          user_id?: string
          user_name?: string | null
        }
        Relationships: []
      }
      password_reset_tokens: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          token: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          token: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          token?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      perfil_valores: {
        Row: {
          created_at: string | null
          id: string
          obrigatorio: boolean | null
          perfil_cargo_id: string | null
          peso: number | null
          valor_cultural_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          obrigatorio?: boolean | null
          perfil_cargo_id?: string | null
          peso?: number | null
          valor_cultural_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          obrigatorio?: boolean | null
          perfil_cargo_id?: string | null
          peso?: number | null
          valor_cultural_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "perfil_valores_perfil_cargo_id_fkey"
            columns: ["perfil_cargo_id"]
            isOneToOne: false
            referencedRelation: "perfis_cargo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "perfil_valores_valor_cultural_id_fkey"
            columns: ["valor_cultural_id"]
            isOneToOne: false
            referencedRelation: "valores_culturais"
            referencedColumns: ["id"]
          },
        ]
      }
      perfis_cargo: {
        Row: {
          created_at: string | null
          descricao: string | null
          id: string
          nome: string
          nota_minima_aprovacao: number | null
          perfil_conformidade: number | null
          perfil_dominancia: number | null
          perfil_estabilidade: number | null
          perfil_influencia: number | null
          peso_comportamental: number | null
          peso_cultural: number | null
          peso_tecnico: number | null
          tolerancia_perfil: number | null
          updated_at: string | null
          vaga_id: string | null
        }
        Insert: {
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome: string
          nota_minima_aprovacao?: number | null
          perfil_conformidade?: number | null
          perfil_dominancia?: number | null
          perfil_estabilidade?: number | null
          perfil_influencia?: number | null
          peso_comportamental?: number | null
          peso_cultural?: number | null
          peso_tecnico?: number | null
          tolerancia_perfil?: number | null
          updated_at?: string | null
          vaga_id?: string | null
        }
        Update: {
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          nota_minima_aprovacao?: number | null
          perfil_conformidade?: number | null
          perfil_dominancia?: number | null
          perfil_estabilidade?: number | null
          perfil_influencia?: number | null
          peso_comportamental?: number | null
          peso_cultural?: number | null
          peso_tecnico?: number | null
          tolerancia_perfil?: number | null
          updated_at?: string | null
          vaga_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "perfis_cargo_vaga_id_fkey"
            columns: ["vaga_id"]
            isOneToOne: false
            referencedRelation: "vagas"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          action: string
          created_at: string
          description: string | null
          id: string
          module: string
          name: string
        }
        Insert: {
          action: string
          created_at?: string
          description?: string | null
          id?: string
          module: string
          name: string
        }
        Update: {
          action?: string
          created_at?: string
          description?: string | null
          id?: string
          module?: string
          name?: string
        }
        Relationships: []
      }
      processos_seletivos: {
        Row: {
          candidato_foto: string | null
          candidato_id: string | null
          candidato_nome: string
          created_at: string
          data_inscricao: string
          data_ultima_movimentacao: string
          dias_na_etapa: number | null
          etapa_atual: string
          id: string
          match_score: number | null
          origem: string | null
          status: string
          updated_at: string
          vaga_id: string | null
          vaga_titulo: string
        }
        Insert: {
          candidato_foto?: string | null
          candidato_id?: string | null
          candidato_nome: string
          created_at?: string
          data_inscricao?: string
          data_ultima_movimentacao?: string
          dias_na_etapa?: number | null
          etapa_atual?: string
          id?: string
          match_score?: number | null
          origem?: string | null
          status?: string
          updated_at?: string
          vaga_id?: string | null
          vaga_titulo: string
        }
        Update: {
          candidato_foto?: string | null
          candidato_id?: string | null
          candidato_nome?: string
          created_at?: string
          data_inscricao?: string
          data_ultima_movimentacao?: string
          dias_na_etapa?: number | null
          etapa_atual?: string
          id?: string
          match_score?: number | null
          origem?: string | null
          status?: string
          updated_at?: string
          vaga_id?: string | null
          vaga_titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "processos_seletivos_candidato_id_fkey"
            columns: ["candidato_id"]
            isOneToOne: false
            referencedRelation: "candidatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "processos_seletivos_vaga_id_fkey"
            columns: ["vaga_id"]
            isOneToOne: false
            referencedRelation: "vagas"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          id: string
          nome: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          id?: string
          nome: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          id?: string
          nome?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      provas: {
        Row: {
          aplicacoes: number
          ativo: boolean
          categoria: string
          created_at: string
          departamentos: string[]
          descricao: string | null
          duracao: number
          id: string
          media_notas: number | null
          niveis_aplicaveis: string[]
          nota_minima: number
          pontuacao_maxima: number
          tags: string[] | null
          titulo: string
          total_questoes: number
          updated_at: string
        }
        Insert: {
          aplicacoes?: number
          ativo?: boolean
          categoria: string
          created_at?: string
          departamentos?: string[]
          descricao?: string | null
          duracao?: number
          id?: string
          media_notas?: number | null
          niveis_aplicaveis?: string[]
          nota_minima?: number
          pontuacao_maxima?: number
          tags?: string[] | null
          titulo: string
          total_questoes?: number
          updated_at?: string
        }
        Update: {
          aplicacoes?: number
          ativo?: boolean
          categoria?: string
          created_at?: string
          departamentos?: string[]
          descricao?: string | null
          duracao?: number
          id?: string
          media_notas?: number | null
          niveis_aplicaveis?: string[]
          nota_minima?: number
          pontuacao_maxima?: number
          tags?: string[] | null
          titulo?: string
          total_questoes?: number
          updated_at?: string
        }
        Relationships: []
      }
      questoes: {
        Row: {
          alternativas: Json | null
          created_at: string
          dificuldade: string
          enunciado: string
          id: string
          ordem: number
          pontuacao: number
          prova_id: string
          resposta_correta: string | null
          tipo: string
        }
        Insert: {
          alternativas?: Json | null
          created_at?: string
          dificuldade?: string
          enunciado: string
          id?: string
          ordem?: number
          pontuacao?: number
          prova_id: string
          resposta_correta?: string | null
          tipo: string
        }
        Update: {
          alternativas?: Json | null
          created_at?: string
          dificuldade?: string
          enunciado?: string
          id?: string
          ordem?: number
          pontuacao?: number
          prova_id?: string
          resposta_correta?: string | null
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "questoes_prova_id_fkey"
            columns: ["prova_id"]
            isOneToOne: false
            referencedRelation: "provas"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_limit_logs: {
        Row: {
          blocked: boolean
          created_at: string
          endpoint: string
          id: string
          ip_address: string
          request_count: number
        }
        Insert: {
          blocked?: boolean
          created_at?: string
          endpoint: string
          id?: string
          ip_address: string
          request_count?: number
        }
        Update: {
          blocked?: boolean
          created_at?: string
          endpoint?: string
          id?: string
          ip_address?: string
          request_count?: number
        }
        Relationships: []
      }
      regras_automacao: {
        Row: {
          acoes: Json
          aplicavel_a: string[] | null
          ativo: boolean | null
          condicoes: Json
          created_at: string | null
          descricao: string | null
          id: string
          nome: string
          prioridade: number | null
          tipo: string
          updated_at: string | null
        }
        Insert: {
          acoes: Json
          aplicavel_a?: string[] | null
          ativo?: boolean | null
          condicoes: Json
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome: string
          prioridade?: number | null
          tipo: string
          updated_at?: string | null
        }
        Update: {
          acoes?: Json
          aplicavel_a?: string[] | null
          ativo?: boolean | null
          condicoes?: Json
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          prioridade?: number | null
          tipo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      regras_log: {
        Row: {
          acao_executada: Json | null
          candidato_id: string | null
          detalhes: string | null
          executado_em: string | null
          id: string
          processo_id: string | null
          regra_id: string | null
          resultado: string | null
        }
        Insert: {
          acao_executada?: Json | null
          candidato_id?: string | null
          detalhes?: string | null
          executado_em?: string | null
          id?: string
          processo_id?: string | null
          regra_id?: string | null
          resultado?: string | null
        }
        Update: {
          acao_executada?: Json | null
          candidato_id?: string | null
          detalhes?: string | null
          executado_em?: string | null
          id?: string
          processo_id?: string | null
          regra_id?: string | null
          resultado?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "regras_log_candidato_id_fkey"
            columns: ["candidato_id"]
            isOneToOne: false
            referencedRelation: "candidatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "regras_log_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: false
            referencedRelation: "processos_seletivos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "regras_log_regra_id_fkey"
            columns: ["regra_id"]
            isOneToOne: false
            referencedRelation: "regras_automacao"
            referencedColumns: ["id"]
          },
        ]
      }
      resultados_provas: {
        Row: {
          candidato_id: string | null
          candidato_nome: string
          created_at: string
          finalizado_em: string | null
          id: string
          iniciado_em: string
          nota: number
          percentual: number
          processo_id: string | null
          prova_id: string
          respostas: Json | null
          status: string
          tempo_gasto: number
        }
        Insert: {
          candidato_id?: string | null
          candidato_nome: string
          created_at?: string
          finalizado_em?: string | null
          id?: string
          iniciado_em?: string
          nota?: number
          percentual?: number
          processo_id?: string | null
          prova_id: string
          respostas?: Json | null
          status?: string
          tempo_gasto?: number
        }
        Update: {
          candidato_id?: string | null
          candidato_nome?: string
          created_at?: string
          finalizado_em?: string | null
          id?: string
          iniciado_em?: string
          nota?: number
          percentual?: number
          processo_id?: string | null
          prova_id?: string
          respostas?: Json | null
          status?: string
          tempo_gasto?: number
        }
        Relationships: [
          {
            foreignKeyName: "resultados_provas_candidato_id_fkey"
            columns: ["candidato_id"]
            isOneToOne: false
            referencedRelation: "candidatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resultados_provas_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: false
            referencedRelation: "processos_seletivos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resultados_provas_prova_id_fkey"
            columns: ["prova_id"]
            isOneToOne: false
            referencedRelation: "provas"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string
          id: string
          permission_id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          created_at?: string
          id?: string
          permission_id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          created_at?: string
          id?: string
          permission_id?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      scorecard_competencias: {
        Row: {
          competencia_id: string | null
          created_at: string | null
          criterio_id: string | null
          evidencias: string[] | null
          fonte: string | null
          id: string
          nome: string
          nota: number | null
          peso: number | null
          scorecard_id: string | null
          tipo: string | null
        }
        Insert: {
          competencia_id?: string | null
          created_at?: string | null
          criterio_id?: string | null
          evidencias?: string[] | null
          fonte?: string | null
          id?: string
          nome: string
          nota?: number | null
          peso?: number | null
          scorecard_id?: string | null
          tipo?: string | null
        }
        Update: {
          competencia_id?: string | null
          created_at?: string | null
          criterio_id?: string | null
          evidencias?: string[] | null
          fonte?: string | null
          id?: string
          nome?: string
          nota?: number | null
          peso?: number | null
          scorecard_id?: string | null
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scorecard_competencias_competencia_id_fkey"
            columns: ["competencia_id"]
            isOneToOne: false
            referencedRelation: "competencias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scorecard_competencias_criterio_id_fkey"
            columns: ["criterio_id"]
            isOneToOne: false
            referencedRelation: "criterios_selecao"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scorecard_competencias_scorecard_id_fkey"
            columns: ["scorecard_id"]
            isOneToOne: false
            referencedRelation: "scorecards"
            referencedColumns: ["id"]
          },
        ]
      }
      scorecards: {
        Row: {
          atualizado_em: string | null
          candidato_id: string | null
          created_at: string | null
          disc_conformidade: number | null
          disc_dominancia: number | null
          disc_estabilidade: number | null
          disc_influencia: number | null
          fit_perfil: number | null
          gerado_por: string | null
          id: string
          justificativa: string | null
          perfil_cargo_id: string | null
          pontos_desenvolvimento: string[] | null
          pontos_fortes: string[] | null
          processo_id: string | null
          recomendacao: string | null
          riscos: string[] | null
          score_comportamental: number | null
          score_cultural: number | null
          score_experiencia: number | null
          score_final: number | null
          score_tecnico: number | null
        }
        Insert: {
          atualizado_em?: string | null
          candidato_id?: string | null
          created_at?: string | null
          disc_conformidade?: number | null
          disc_dominancia?: number | null
          disc_estabilidade?: number | null
          disc_influencia?: number | null
          fit_perfil?: number | null
          gerado_por?: string | null
          id?: string
          justificativa?: string | null
          perfil_cargo_id?: string | null
          pontos_desenvolvimento?: string[] | null
          pontos_fortes?: string[] | null
          processo_id?: string | null
          recomendacao?: string | null
          riscos?: string[] | null
          score_comportamental?: number | null
          score_cultural?: number | null
          score_experiencia?: number | null
          score_final?: number | null
          score_tecnico?: number | null
        }
        Update: {
          atualizado_em?: string | null
          candidato_id?: string | null
          created_at?: string | null
          disc_conformidade?: number | null
          disc_dominancia?: number | null
          disc_estabilidade?: number | null
          disc_influencia?: number | null
          fit_perfil?: number | null
          gerado_por?: string | null
          id?: string
          justificativa?: string | null
          perfil_cargo_id?: string | null
          pontos_desenvolvimento?: string[] | null
          pontos_fortes?: string[] | null
          processo_id?: string | null
          recomendacao?: string | null
          riscos?: string[] | null
          score_comportamental?: number | null
          score_cultural?: number | null
          score_experiencia?: number | null
          score_final?: number | null
          score_tecnico?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "scorecards_candidato_id_fkey"
            columns: ["candidato_id"]
            isOneToOne: false
            referencedRelation: "candidatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scorecards_perfil_cargo_id_fkey"
            columns: ["perfil_cargo_id"]
            isOneToOne: false
            referencedRelation: "perfis_cargo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scorecards_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: false
            referencedRelation: "processos_seletivos"
            referencedColumns: ["id"]
          },
        ]
      }
      template_perguntas: {
        Row: {
          competencia_id: string | null
          created_at: string | null
          criterios_avaliacao: string[] | null
          id: string
          obrigatoria: boolean | null
          ordem: number | null
          pergunta: string
          pontuacao_maxima: number | null
          resposta_ideal: string | null
          template_id: string | null
          tipo: string | null
        }
        Insert: {
          competencia_id?: string | null
          created_at?: string | null
          criterios_avaliacao?: string[] | null
          id?: string
          obrigatoria?: boolean | null
          ordem?: number | null
          pergunta: string
          pontuacao_maxima?: number | null
          resposta_ideal?: string | null
          template_id?: string | null
          tipo?: string | null
        }
        Update: {
          competencia_id?: string | null
          created_at?: string | null
          criterios_avaliacao?: string[] | null
          id?: string
          obrigatoria?: boolean | null
          ordem?: number | null
          pergunta?: string
          pontuacao_maxima?: number | null
          resposta_ideal?: string | null
          template_id?: string | null
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "template_perguntas_competencia_id_fkey"
            columns: ["competencia_id"]
            isOneToOne: false
            referencedRelation: "competencias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "template_perguntas_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates_entrevista"
            referencedColumns: ["id"]
          },
        ]
      }
      templates_entrevista: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          departamento: string | null
          descricao: string | null
          duracao_sugerida: number | null
          id: string
          nivel: string | null
          nome: string
          tipo_entrevista: string | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          departamento?: string | null
          descricao?: string | null
          duracao_sugerida?: number | null
          id?: string
          nivel?: string | null
          nome: string
          tipo_entrevista?: string | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          departamento?: string | null
          descricao?: string | null
          duracao_sugerida?: number | null
          id?: string
          nivel?: string | null
          nome?: string
          tipo_entrevista?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      trusted_devices: {
        Row: {
          created_at: string
          device_hash: string
          device_name: string | null
          expires_at: string
          id: string
          last_used_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          device_hash: string
          device_name?: string | null
          expires_at: string
          id?: string
          last_used_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          device_hash?: string
          device_name?: string | null
          expires_at?: string
          id?: string
          last_used_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_2fa: {
        Row: {
          backup_codes: string[]
          created_at: string
          enabled: boolean
          id: string
          secret: string
          updated_at: string
          user_id: string
          verified_at: string | null
        }
        Insert: {
          backup_codes?: string[]
          created_at?: string
          enabled?: boolean
          id?: string
          secret: string
          updated_at?: string
          user_id: string
          verified_at?: string | null
        }
        Update: {
          backup_codes?: string[]
          created_at?: string
          enabled?: boolean
          id?: string
          secret?: string
          updated_at?: string
          user_id?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      user_2fa_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: string | null
          success: boolean
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: string | null
          success?: boolean
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          success?: boolean
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vagas: {
        Row: {
          beneficios: string[] | null
          cidade: string | null
          contratados: number
          created_at: string
          data_criacao: string
          data_encerramento: string | null
          data_publicacao: string | null
          departamento: string
          descricao_empresa: string | null
          em_processo: number
          estado: string | null
          gestor_nome: string | null
          id: string
          modalidade: string
          perguntas_triagem: Json | null
          prioridade: string
          quantidade: number
          recrutador_nome: string | null
          requisitos_desejaveis: string | null
          requisitos_obrigatorios: string | null
          responsabilidades: string | null
          salario_a_combinar: boolean
          salario_max: number | null
          salario_min: number | null
          skills_avaliacao: string[] | null
          status: string
          tipo_contrato: string
          titulo: string
          total_candidatos: number
          updated_at: string
        }
        Insert: {
          beneficios?: string[] | null
          cidade?: string | null
          contratados?: number
          created_at?: string
          data_criacao?: string
          data_encerramento?: string | null
          data_publicacao?: string | null
          departamento: string
          descricao_empresa?: string | null
          em_processo?: number
          estado?: string | null
          gestor_nome?: string | null
          id?: string
          modalidade?: string
          perguntas_triagem?: Json | null
          prioridade?: string
          quantidade?: number
          recrutador_nome?: string | null
          requisitos_desejaveis?: string | null
          requisitos_obrigatorios?: string | null
          responsabilidades?: string | null
          salario_a_combinar?: boolean
          salario_max?: number | null
          salario_min?: number | null
          skills_avaliacao?: string[] | null
          status?: string
          tipo_contrato?: string
          titulo: string
          total_candidatos?: number
          updated_at?: string
        }
        Update: {
          beneficios?: string[] | null
          cidade?: string | null
          contratados?: number
          created_at?: string
          data_criacao?: string
          data_encerramento?: string | null
          data_publicacao?: string | null
          departamento?: string
          descricao_empresa?: string | null
          em_processo?: number
          estado?: string | null
          gestor_nome?: string | null
          id?: string
          modalidade?: string
          perguntas_triagem?: Json | null
          prioridade?: string
          quantidade?: number
          recrutador_nome?: string | null
          requisitos_desejaveis?: string | null
          requisitos_obrigatorios?: string | null
          responsabilidades?: string | null
          salario_a_combinar?: boolean
          salario_max?: number | null
          salario_min?: number | null
          skills_avaliacao?: string[] | null
          status?: string
          tipo_contrato?: string
          titulo?: string
          total_candidatos?: number
          updated_at?: string
        }
        Relationships: []
      }
      valores_culturais: {
        Row: {
          ativo: boolean | null
          cor: string | null
          created_at: string | null
          descricao: string | null
          icone: string | null
          id: string
          nome: string
          ordem: number | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          cor?: string | null
          created_at?: string | null
          descricao?: string | null
          icone?: string | null
          id?: string
          nome: string
          ordem?: number | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          cor?: string | null
          created_at?: string | null
          descricao?: string | null
          icone?: string | null
          id?: string
          nome?: string
          ordem?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      webauthn_credentials: {
        Row: {
          counter: number
          created_at: string
          credential_id: string
          device_name: string | null
          device_type: string | null
          id: string
          last_used_at: string | null
          public_key: string
          transports: string[] | null
          user_id: string
        }
        Insert: {
          counter?: number
          created_at?: string
          credential_id: string
          device_name?: string | null
          device_type?: string | null
          id?: string
          last_used_at?: string | null
          public_key: string
          transports?: string[] | null
          user_id: string
        }
        Update: {
          counter?: number
          created_at?: string
          credential_id?: string
          device_name?: string | null
          device_type?: string | null
          id?: string
          last_used_at?: string | null
          public_key?: string
          transports?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_old_login_attempts: { Args: never; Returns: undefined }
      cleanup_old_logs: { Args: never; Returns: undefined }
      get_user_permissions: {
        Args: { _user_id: string }
        Returns: {
          action: string
          module: string
          name: string
        }[]
      }
      get_user_roles: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"][]
      }
      has_permission: {
        Args: { _action: string; _module: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_hr_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "rh" | "gestor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "rh", "gestor"],
    },
  },
} as const
