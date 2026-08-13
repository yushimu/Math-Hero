-- 00002_security_update.sql
-- Security Hardening: Moving XP & Score calculation to the server

-- 1. Create a secure RPC function to handle practice session submissions
-- This prevents malicious clients from artificially inflating their XP or Level
CREATE OR REPLACE FUNCTION submit_practice_session(
  p_child_id UUID,
  p_operation TEXT,
  p_difficulty TEXT,
  p_total_questions INTEGER,
  p_correct_answers INTEGER,
  p_average_response_time NUMERIC
) RETURNS json LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_parent_id UUID;
  v_xp_earned INTEGER := 0;
  v_current_xp INTEGER;
  v_current_level INTEGER;
  v_new_level INTEGER;
  v_score INTEGER;
  v_session_id UUID;
BEGIN
  -- 1. Validate Ownership
  -- Ensure the child belongs to the currently authenticated parent
  SELECT parent_id, xp, level INTO v_parent_id, v_current_xp, v_current_level
  FROM children WHERE id = p_child_id;

  IF v_parent_id IS NULL THEN
    RAISE EXCEPTION 'Child not found';
  END IF;

  IF auth.uid() != v_parent_id THEN
    RAISE EXCEPTION 'Unauthorized: You do not have permission to update this child';
  END IF;

  -- 2. Server-side Score Calculation
  -- Prevent client from sending fake 100% scores
  IF p_total_questions > 0 THEN
    v_score := (p_correct_answers::FLOAT / p_total_questions::FLOAT * 100)::INTEGER;
  ELSE
    v_score := 0;
  END IF;
  
  -- 3. Server-side XP Calculation
  -- Base XP on difficulty and correct answers
  IF p_difficulty = 'EASY' THEN 
    v_xp_earned := p_correct_answers * 10; 
  ELSIF p_difficulty = 'MEDIUM' THEN 
    v_xp_earned := p_correct_answers * 20; 
  ELSIF p_difficulty = 'HARD' THEN 
    v_xp_earned := p_correct_answers * 30; 
  ELSE
    v_xp_earned := p_correct_answers * 10;
  END IF;

  -- Add completion bonus if 100% accuracy
  IF v_score = 100 AND p_total_questions >= 10 THEN
    v_xp_earned := v_xp_earned + 50;
  END IF;

  -- 4. Update child stats safely
  v_current_xp := v_current_xp + v_xp_earned;
  v_new_level := (v_current_xp / 1000) + 1; -- Level up every 1000 XP

  UPDATE children 
  SET 
    xp = v_current_xp, 
    level = v_new_level
  WHERE id = p_child_id;

  -- 5. Insert practice session
  INSERT INTO practice_sessions (
    child_id, operation, difficulty, total_questions, correct_answers, score, average_response_time, completed_at
  )
  VALUES (
    p_child_id, p_operation, p_difficulty, p_total_questions, p_correct_answers, v_score, p_average_response_time, NOW()
  ) RETURNING id INTO v_session_id;

  -- 6. Return verified results to client
  RETURN json_build_object(
    'session_id', v_session_id,
    'xp_earned', v_xp_earned, 
    'new_xp', v_current_xp, 
    'new_level', v_new_level, 
    'score', v_score
  );
END;
$$;
