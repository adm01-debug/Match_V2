export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      candidatos: {
        Row: {
          id: string
          nome: string
          email: string
          telefone: string | null
          linkedin: string | null
          cidade: string | null
          estado: string | null
          foto_url: string | null
          cargo_atual: string | null
          empresa_atual: string | null
          experiencia_anos: number | null
          pretensao_salarial: number | null
          disponibilidade: string | null
          escolaridade: string | null
          resumo: string | null
          habilidades: string[] | null
          experiencias: Json | null
          formacao: Json | null
          origem: string | null
          indicado_por: string | null
          fonte: string | null
          status: string | null
          arquivo_curriculo: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          nome: string
          email: string
          telefone?: string | null
          linkedin?: string | null
          cidade?: string | null
          estado?: string | null
          foto_url?: string | null
          cargo_atual?: string | null
          empresa_atual?: string | null
          experiencia_anos?: number | null
          pretensao_salarial?: number | null
          disponibilidade?: string | null
          escolaridade?: string | null
          resumo?: string | null
          habilidades?: string[] | null
          experiencias?: Json | null
          formacao?: Json | null
          origem?: string | null
          indicado_por?: string | null
          fonte?: string | null
          status?: string | null
          arquivo_curriculo?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          nome?: string
          email?: string
          telefone?: string | null
          linkedin?: string | null
          cidade?: string | null
          estado?: string | null
          foto_url?: string | null
          cargo_atual?: string | null
          empresa_atual?: string | null
          experiencia_anos?: number | null
          pretensao_salarial?: number | null
          disponibilidade?: string | null
          escolaridade?: string | null
          resumo?: string | null
          habilidades?: string[] | null
          experiencias?: Json | null
          formacao?: Json | null
          origem?: string | null
          indicado_por?: string | null
          fonte?: string | null
          status?: string | null
          arquivo_curriculo?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      vagas: {
        Row: {
          id: string
          titulo: string
          departamento: string
          codigo: string | null
          gestor_id: string | null
          recrutador_id: string | null
          quantidade: number
          tipo_contrato: string
          modalidade: string
          nivel: string | null
          cidade: string | null
          estado: string | null
          pais: string | null
          salario_min: number | null
          salario_max: number | null
          salario_a_combinar: boolean | null
          beneficios: string[] | null
          descricao_empresa: string | null
          responsabilidades: string | null
          requisitos_obrigatorios: string | null
          requisitos_desejaveis: string | null
          habilidades_obrigatorias: string[] | null
          habilidades_desejaveis: string[] | null
          skills_avaliacao: string[] | null
          perguntas_triagem: Json | null
          status: string
          prioridade: string
          data_publicacao: string | null
          data_encerramento: string | null
          prazo_preenchimento: string | null
          total_candidatos: number | null
          em_processo: number | null
          contratados: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          titulo: string
          departamento: string
          codigo?: string | null
          gestor_id?: string | null
          recrutador_id?: string | null
          quantidade?: number
          tipo_contrato?: string
          modalidade?: string
          nivel?: string | null
          cidade?: string | null
          estado?: string | null
          pais?: string | null
          salario_min?: number | null
          salario_max?: number | null
          salario_a_combinar?: boolean | null
          beneficios?: string[] | null
          descricao_empresa?: string | null
          responsabilidades?: string | null
          requisitos_obrigatorios?: string | null
          requisitos_desejaveis?: string | null
          habilidades_obrigatorias?: string[] | null
          habilidades_desejaveis?: string[] | null
          skills_avaliacao?: string[] | null
          perguntas_triagem?: Json | null
          status?: string
          prioridade?: string
          data_publicacao?: string | null
          data_encerramento?: string | null
          prazo_preenchimento?: string | null
          total_candidatos?: number | null
          em_processo?: number | null
          contratados?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          titulo?: string
          departamento?: string
          codigo?: string | null
          gestor_id?: string | null
          recrutador_id?: string | null
          quantidade?: number
          tipo_contrato?: string
          modalidade?: string
          nivel?: string | null
          cidade?: string | null
          estado?: string | null
          pais?: string | null
          salario_min?: number | null
          salario_max?: number | null
          salario_a_combinar?: boolean | null
          beneficios?: string[] | null
          descricao_empresa?: string | null
          responsabilidades?: string | null
          requisitos_obrigatorios?: string | null
          requisitos_desejaveis?: string | null
          habilidades_obrigatorias?: string[] | null
          habilidades_desejaveis?: string[] | null
          skills_avaliacao?: string[] | null
          perguntas_triagem?: Json | null
          status?: string
          prioridade?: string
          data_publicacao?: string | null
          data_encerramento?: string | null
          prazo_preenchimento?: string | null
          total_candidatos?: number | null
          em_processo?: number | null
          contratados?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      processos_seletivos: {
        Row: {
          id: string
          vaga_id: string
          candidato_id: string
          etapa_atual: string
          status: string
          match_score: number | null
          match_score_id: string | null
          origem: string | null
          data_inscricao: string | null
          data_ultima_movimentacao: string | null
          data_conclusao: string | null
          motivo_encerramento: string | null
          observacoes: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          vaga_id: string
          candidato_id: string
          etapa_atual?: string
          status?: string
          match_score?: number | null
          match_score_id?: string | null
          origem?: string | null
          data_inscricao?: string | null
          data_ultima_movimentacao?: string | null
          data_conclusao?: string | null
          motivo_encerramento?: string | null
          observacoes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          vaga_id?: string
          candidato_id?: string
          etapa_atual?: string
          status?: string
          match_score?: number | null
          match_score_id?: string | null
          origem?: string | null
          data_inscricao?: string | null
          data_ultima_movimentacao?: string | null
          data_conclusao?: string | null
          motivo_encerramento?: string | null
          observacoes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "processos_seletivos_vaga_id_fkey"
            columns: ["vaga_id"]
            isOneToOne: false
            referencedRelation: "vagas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "processos_seletivos_candidato_id_fkey"
            columns: ["candidato_id"]
            isOneToOne: false
            referencedRelation: "candidatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "processos_seletivos_match_score_id_fkey"
            columns: ["match_score_id"]
            isOneToOne: false
            referencedRelation: "match_scores"
            referencedColumns: ["id"]
          }
        ]
      }
      entrevistas: {
        Row: {
          id: string
          processo_id: string
          tipo: string
          etapa: string
          data_hora: string
          duracao_minutos: number
          local: string | null
          link_video: string | null
          entrevistadores: string[] | null
          entrevistadores_nomes: string[] | null
          status: string
          parecer: string | null
          observacoes: string | null
          candidato_notificado: boolean | null
          lembrete_enviado: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          processo_id: string
          tipo?: string
          etapa: string
          data_hora: string
          duracao_minutos?: number
          local?: string | null
          link_video?: string | null
          entrevistadores?: string[] | null
          entrevistadores_nomes?: string[] | null
          status?: string
          parecer?: string | null
          observacoes?: string | null
          candidato_notificado?: boolean | null
          lembrete_enviado?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          processo_id?: string
          tipo?: string
          etapa?: string
          data_hora?: string
          duracao_minutos?: number
          local?: string | null
          link_video?: string | null
          entrevistadores?: string[] | null
          entrevistadores_nomes?: string[] | null
          status?: string
          parecer?: string | null
          observacoes?: string | null
          candidato_notificado?: boolean | null
          lembrete_enviado?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "entrevistas_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: false
            referencedRelation: "processos_seletivos"
            referencedColumns: ["id"]
          }
        ]
      }
      avaliacoes: {
        Row: {
          id: string
          processo_id: string
          avaliador_id: string | null
          entrevista_id: string | null
          etapa: string
          notas_tecnicas: Json | null
          notas_comportamentais: Json | null
          nota_geral: number | null
          pontos_fortes: string | null
          pontos_desenvolvimento: string | null
          parecer: string
          observacoes_gerais: string | null
          recomendacao: string | null
          data_avaliacao: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          processo_id: string
          avaliador_id?: string | null
          entrevista_id?: string | null
          etapa: string
          notas_tecnicas?: Json | null
          notas_comportamentais?: Json | null
          nota_geral?: number | null
          pontos_fortes?: string | null
          pontos_desenvolvimento?: string | null
          parecer: string
          observacoes_gerais?: string | null
          recomendacao?: string | null
          data_avaliacao?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          processo_id?: string
          avaliador_id?: string | null
          entrevista_id?: string | null
          etapa?: string
          notas_tecnicas?: Json | null
          notas_comportamentais?: Json | null
          nota_geral?: number | null
          pontos_fortes?: string | null
          pontos_desenvolvimento?: string | null
          parecer?: string
          observacoes_gerais?: string | null
          recomendacao?: string | null
          data_avaliacao?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "avaliacoes_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: false
            referencedRelation: "processos_seletivos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "avaliacoes_entrevista_id_fkey"
            columns: ["entrevista_id"]
            isOneToOne: false
            referencedRelation: "entrevistas"
            referencedColumns: ["id"]
          }
        ]
      }
      provas: {
        Row: {
          id: string
          titulo: string
          descricao: string | null
          categoria: string
          departamentos: string[] | null
          niveis_aplicaveis: string[] | null
          duracao_minutos: number
          pontuacao_maxima: number
          nota_minima: number
          questoes: Json | null
          total_questoes: number | null
          tags: string[] | null
          ativo: boolean | null
          total_aplicacoes: number | null
          media_notas: number | null
          criado_por: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          titulo: string
          descricao?: string | null
          categoria?: string
          departamentos?: string[] | null
          niveis_aplicaveis?: string[] | null
          duracao_minutos?: number
          pontuacao_maxima?: number
          nota_minima?: number
          questoes?: Json | null
          total_questoes?: number | null
          tags?: string[] | null
          ativo?: boolean | null
          total_aplicacoes?: number | null
          media_notas?: number | null
          criado_por?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          titulo?: string
          descricao?: string | null
          categoria?: string
          departamentos?: string[] | null
          niveis_aplicaveis?: string[] | null
          duracao_minutos?: number
          pontuacao_maxima?: number
          nota_minima?: number
          questoes?: Json | null
          total_questoes?: number | null
          tags?: string[] | null
          ativo?: boolean | null
          total_aplicacoes?: number | null
          media_notas?: number | null
          criado_por?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      resultados_provas: {
        Row: {
          id: string
          prova_id: string
          processo_id: string
          candidato_id: string
          nota: number
          percentual: number
          status: string
          respostas: Json | null
          tempo_gasto_minutos: number | null
          iniciado_em: string | null
          finalizado_em: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          prova_id: string
          processo_id: string
          candidato_id: string
          nota: number
          percentual: number
          status?: string
          respostas?: Json | null
          tempo_gasto_minutos?: number | null
          iniciado_em?: string | null
          finalizado_em?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          prova_id?: string
          processo_id?: string
          candidato_id?: string
          nota?: number
          percentual?: number
          status?: string
          respostas?: Json | null
          tempo_gasto_minutos?: number | null
          iniciado_em?: string | null
          finalizado_em?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resultados_provas_prova_id_fkey"
            columns: ["prova_id"]
            isOneToOne: false
            referencedRelation: "provas"
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
            foreignKeyName: "resultados_provas_candidato_id_fkey"
            columns: ["candidato_id"]
            isOneToOne: false
            referencedRelation: "candidatos"
            referencedColumns: ["id"]
          }
        ]
      }
      historico_etapas: {
        Row: {
          id: string
          processo_id: string
          etapa_anterior: string | null
          etapa_nova: string
          alterado_por: string | null
          observacao: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          processo_id: string
          etapa_anterior?: string | null
          etapa_nova: string
          alterado_por?: string | null
          observacao?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          processo_id?: string
          etapa_anterior?: string | null
          etapa_nova?: string
          alterado_por?: string | null
          observacao?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "historico_etapas_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: false
            referencedRelation: "processos_seletivos"
            referencedColumns: ["id"]
          }
        ]
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
    }
    Views: {
      v_pipeline: {
        Row: {
          id: string | null
          etapa_atual: string | null
          status: string | null
          match_score: number | null
          data_inscricao: string | null
          data_ultima_movimentacao: string | null
          dias_na_etapa: number | null
          candidato_id: string | null
          candidato_nome: string | null
          candidato_email: string | null
          candidato_foto: string | null
          cargo_atual: string | null
          vaga_id: string | null
          vaga_titulo: string | null
          vaga_departamento: string | null
          vaga_prioridade: string | null
        }
        Relationships: []
      }
      v_agenda_entrevistas: {
        Row: {
          id: string | null
          tipo: string | null
          etapa: string | null
          data_hora: string | null
          duracao_minutos: number | null
          local: string | null
          link_video: string | null
          status: string | null
          entrevistadores_nomes: string[] | null
          candidato_nome: string | null
          candidato_email: string | null
          candidato_foto: string | null
          vaga_titulo: string | null
          vaga_departamento: string | null
        }
        Relationships: []
      }
      v_vagas_kpis: {
        Row: {
          id: string | null
          titulo: string | null
          departamento: string | null
          status: string | null
          prioridade: string | null
          quantidade: number | null
          created_at: string | null
          dias_aberta: number | null
          total_candidatos: number | null
          em_processo: number | null
          contratados: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_user_roles: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"][]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
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
