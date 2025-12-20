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
    }
    Views: {
      [_ in never]: never
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
