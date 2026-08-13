-- CODING MATH LEVELS
CREATE TABLE coding_math_levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT,
  total_questions INTEGER NOT NULL DEFAULT 5,
  passing_score INTEGER NOT NULL DEFAULT 80,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: coding_math_levels (Read-only for authenticated users)
ALTER TABLE coding_math_levels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view coding math levels" ON coding_math_levels FOR SELECT USING (auth.role() = 'authenticated');


-- CODING MATH QUESTIONS
CREATE TABLE coding_math_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level_id UUID REFERENCES coding_math_levels(id) ON DELETE CASCADE NOT NULL,
  question_type TEXT NOT NULL,
  question_text TEXT NOT NULL,
  question_data JSONB, -- For options or specific config
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  difficulty TEXT,
  points INTEGER DEFAULT 10,
  time_limit INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: coding_math_questions (Read-only for authenticated users)
ALTER TABLE coding_math_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view coding math questions" ON coding_math_questions FOR SELECT USING (auth.role() = 'authenticated');


-- CODING MATH SESSIONS
CREATE TABLE coding_math_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  level_id UUID REFERENCES coding_math_levels(id) ON DELETE CASCADE NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL,
  accuracy NUMERIC,
  average_time NUMERIC,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- RLS: coding_math_sessions
ALTER TABLE coding_math_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parents can manage their children's coding math sessions" ON coding_math_sessions FOR ALL USING (
  child_id IN (SELECT id FROM children WHERE parent_id = auth.uid())
);


-- CODING MATH ANSWERS
CREATE TABLE coding_math_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES coding_math_sessions(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES coding_math_questions(id) ON DELETE SET NULL,
  user_answer TEXT,
  is_correct BOOLEAN NOT NULL,
  response_time INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: coding_math_answers
ALTER TABLE coding_math_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parents can manage their children's coding math answers" ON coding_math_answers FOR ALL USING (
  session_id IN (
    SELECT cms.id FROM coding_math_sessions cms
    JOIN children c ON cms.child_id = c.id
    WHERE c.parent_id = auth.uid()
  )
);


-- CODING MATH PROGRESS
CREATE TABLE coding_math_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  level_id UUID REFERENCES coding_math_levels(id) ON DELETE CASCADE NOT NULL,
  best_score INTEGER DEFAULT 0,
  best_accuracy NUMERIC DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  unlocked BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(child_id, level_id)
);

-- RLS: coding_math_progress
ALTER TABLE coding_math_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parents can manage their children's coding math progress" ON coding_math_progress FOR ALL USING (
  child_id IN (SELECT id FROM children WHERE parent_id = auth.uid())
);
