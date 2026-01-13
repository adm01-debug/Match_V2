-- =============================================
-- GAMIFICATION SYSTEM TABLES
-- Tabelas para persistência do sistema de gamificação
-- =============================================

-- Tabela principal de gamificação do usuário
CREATE TABLE public.user_gamification (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_active_date DATE,
  total_actions INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de conquistas desbloqueadas pelo usuário
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  xp_earned INTEGER DEFAULT 0,
  UNIQUE(user_id, achievement_id)
);

-- Tabela de transações de XP (histórico)
CREATE TABLE public.xp_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  amount INTEGER NOT NULL,
  action TEXT NOT NULL,
  description TEXT,
  multiplier NUMERIC(3,2) DEFAULT 1.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de badges
CREATE TABLE public.user_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  badge_id TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Índices para performance
CREATE INDEX idx_user_gamification_user_id ON public.user_gamification(user_id);
CREATE INDEX idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX idx_xp_transactions_user_id ON public.xp_transactions(user_id);
CREATE INDEX idx_xp_transactions_created_at ON public.xp_transactions(created_at DESC);
CREATE INDEX idx_user_badges_user_id ON public.user_badges(user_id);

-- Enable RLS
ALTER TABLE public.user_gamification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_gamification
CREATE POLICY "Users can view their own gamification data"
ON public.user_gamification FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own gamification data"
ON public.user_gamification FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own gamification data"
ON public.user_gamification FOR UPDATE
USING (auth.uid() = user_id);

-- RLS Policies for user_achievements
CREATE POLICY "Users can view their own achievements"
ON public.user_achievements FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements"
ON public.user_achievements FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for xp_transactions
CREATE POLICY "Users can view their own XP transactions"
ON public.xp_transactions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own XP transactions"
ON public.xp_transactions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_badges
CREATE POLICY "Users can view their own badges"
ON public.user_badges FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own badges"
ON public.user_badges FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_user_gamification_updated_at
BEFORE UPDATE ON public.user_gamification
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Função para calcular nível baseado no XP
CREATE OR REPLACE FUNCTION public.calculate_level_from_xp(xp_amount INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF xp_amount >= 5500 THEN RETURN 10;
  ELSIF xp_amount >= 4000 THEN RETURN 9;
  ELSIF xp_amount >= 3000 THEN RETURN 8;
  ELSIF xp_amount >= 2200 THEN RETURN 7;
  ELSIF xp_amount >= 1500 THEN RETURN 6;
  ELSIF xp_amount >= 1000 THEN RETURN 5;
  ELSIF xp_amount >= 600 THEN RETURN 4;
  ELSIF xp_amount >= 300 THEN RETURN 3;
  ELSIF xp_amount >= 100 THEN RETURN 2;
  ELSE RETURN 1;
  END IF;
END;
$$;

-- Função para adicionar XP e atualizar nível
CREATE OR REPLACE FUNCTION public.add_user_xp(
  p_user_id UUID,
  p_amount INTEGER,
  p_action TEXT,
  p_description TEXT DEFAULT NULL,
  p_multiplier NUMERIC DEFAULT 1.00
)
RETURNS TABLE(new_xp INTEGER, new_level INTEGER, leveled_up BOOLEAN)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_xp INTEGER;
  v_current_level INTEGER;
  v_final_amount INTEGER;
  v_new_xp INTEGER;
  v_new_level INTEGER;
BEGIN
  -- Calculate final XP with multiplier
  v_final_amount := ROUND(p_amount * p_multiplier);
  
  -- Get or create user gamification record
  INSERT INTO user_gamification (user_id, xp, level)
  VALUES (p_user_id, 0, 1)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Get current values
  SELECT xp, level INTO v_current_xp, v_current_level
  FROM user_gamification
  WHERE user_id = p_user_id;
  
  -- Calculate new values
  v_new_xp := v_current_xp + v_final_amount;
  v_new_level := calculate_level_from_xp(v_new_xp);
  
  -- Update gamification
  UPDATE user_gamification
  SET 
    xp = v_new_xp,
    level = v_new_level,
    total_actions = total_actions + 1,
    updated_at = now()
  WHERE user_id = p_user_id;
  
  -- Log transaction
  INSERT INTO xp_transactions (user_id, amount, action, description, multiplier)
  VALUES (p_user_id, v_final_amount, p_action, p_description, p_multiplier);
  
  -- Return results
  new_xp := v_new_xp;
  new_level := v_new_level;
  leveled_up := v_new_level > v_current_level;
  RETURN NEXT;
END;
$$;

-- Função para atualizar streak
CREATE OR REPLACE FUNCTION public.update_user_streak(p_user_id UUID)
RETURNS TABLE(new_streak INTEGER, streak_bonus INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_last_active DATE;
  v_today DATE := CURRENT_DATE;
  v_current_streak INTEGER;
  v_longest_streak INTEGER;
  v_new_streak INTEGER;
  v_bonus INTEGER := 0;
BEGIN
  -- Get or create user gamification record
  INSERT INTO user_gamification (user_id, xp, level)
  VALUES (p_user_id, 0, 1)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Get current values
  SELECT last_active_date, streak, longest_streak 
  INTO v_last_active, v_current_streak, v_longest_streak
  FROM user_gamification
  WHERE user_id = p_user_id;
  
  -- Calculate new streak
  IF v_last_active = v_today THEN
    -- Already active today
    new_streak := v_current_streak;
    streak_bonus := 0;
    RETURN NEXT;
    RETURN;
  ELSIF v_last_active = v_today - 1 THEN
    -- Consecutive day
    v_new_streak := v_current_streak + 1;
  ELSE
    -- Streak broken
    v_new_streak := 1;
  END IF;
  
  -- Calculate bonus for milestones
  IF v_new_streak = 7 THEN
    v_bonus := 100; -- Weekly streak bonus
  ELSIF v_new_streak = 30 THEN
    v_bonus := 500; -- Monthly streak bonus
  END IF;
  
  -- Update record
  UPDATE user_gamification
  SET 
    streak = v_new_streak,
    longest_streak = GREATEST(v_longest_streak, v_new_streak),
    last_active_date = v_today,
    updated_at = now()
  WHERE user_id = p_user_id;
  
  -- Add bonus XP if applicable
  IF v_bonus > 0 THEN
    PERFORM add_user_xp(p_user_id, v_bonus, 'streak_bonus', 
      CASE WHEN v_new_streak = 7 THEN 'Bônus de streak semanal' 
           ELSE 'Bônus de streak mensal' END);
  END IF;
  
  new_streak := v_new_streak;
  streak_bonus := v_bonus;
  RETURN NEXT;
END;
$$;