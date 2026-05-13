-- Função para criar candidato de forma transacional
CREATE OR REPLACE FUNCTION public.create_candidato_with_details(
    p_nome TEXT,
    p_email TEXT,
    p_telefone TEXT DEFAULT NULL,
    p_resumo TEXT DEFAULT NULL,
    p_habilidades TEXT[] DEFAULT NULL,
    p_experiencias JSONB DEFAULT NULL,
    p_formacao JSONB DEFAULT NULL,
    p_arquivo_curriculo TEXT DEFAULT NULL,
    p_fonte TEXT DEFAULT 'parser_curriculo',
    p_status TEXT DEFAULT 'novo'
) RETURNS public.candidatos AS $$
DECLARE
    v_candidato public.candidatos;
BEGIN
    INSERT INTO public.candidatos (
        nome, 
        email, 
        telefone, 
        resumo, 
        habilidades, 
        experiencias, 
        formacao, 
        arquivo_curriculo, 
        fonte, 
        status,
        created_at,
        updated_at
    ) VALUES (
        p_nome, 
        p_email, 
        p_telefone, 
        p_resumo, 
        p_habilidades, 
        p_experiencias, 
        p_formacao, 
        p_arquivo_curriculo, 
        p_fonte, 
        p_status,
        NOW(),
        NOW()
    ) RETURNING * INTO v_candidato;

    RETURN v_candidato;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Garantir que a função seja acessível por usuários autenticados
GRANT EXECUTE ON FUNCTION public.create_candidato_with_details(TEXT, TEXT, TEXT, TEXT, TEXT[], JSONB, JSONB, TEXT, TEXT, TEXT) TO authenticated;