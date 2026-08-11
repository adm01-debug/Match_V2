CREATE OR REPLACE FUNCTION public.apply_for_job(
    p_candidato_id UUID,
    p_vaga_id UUID,
    p_notas TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_candidatura_id UUID;
    v_vaga_titulo TEXT;
BEGIN
    -- 1. Verificar se já existe candidatura ativa
    IF EXISTS (SELECT 1 FROM public.candidaturas WHERE candidato_id = p_candidato_id AND vaga_id = p_vaga_id AND deleted_at IS NULL) THEN
        RETURN jsonb_build_object('success', false, 'message', 'Candidato já aplicado para esta vaga');
    END IF;

    -- 2. Criar a candidatura
    INSERT INTO public.candidaturas (candidato_id, vaga_id, status, notas)
    VALUES (p_candidato_id, p_vaga_id, 'novo', p_notas)
    RETURNING id INTO v_candidatura_id;

    -- 3. Criar registro no histórico de etapas
    INSERT INTO public.historico_etapas (candidato_id, vaga_id, etapa_anterior, etapa_nova, responsavel_id)
    VALUES (p_candidato_id, p_vaga_id, NULL, 'novo', auth.uid());

    -- 4. Criar notificação
    SELECT titulo INTO v_vaga_titulo FROM public.vagas WHERE id = p_vaga_id;
    
    INSERT INTO public.notifications (user_id, title, message, type)
    VALUES (
        (SELECT recrutador_id FROM public.vagas WHERE id = p_vaga_id),
        'Nova Candidatura',
        'Novo candidato aplicado para a vaga: ' || v_vaga_titulo,
        'system'
    );

    RETURN jsonb_build_object(
        'success', true,
        'candidatura_id', v_candidatura_id
    );
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'message', SQLERRM);
END;
$$;
