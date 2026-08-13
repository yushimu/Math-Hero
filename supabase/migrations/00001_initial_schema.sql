-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT CHECK (role IN ('parent', 'admin')) DEFAULT 'parent',
  name TEXT,
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);


-- CHILDREN
CREATE TABLE children (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT,
  grade TEXT,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Children
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
-- Parent can manage their own children
CREATE POLICY "Parents can manage their children" ON children FOR ALL USING (auth.uid() = parent_id);


-- PRACTICE SESSIONS
CREATE TABLE practice_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  operation TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  score INTEGER NOT NULL,
  average_response_time NUMERIC,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- RLS: Practice Sessions
ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parents can manage their children's sessions" ON practice_sessions FOR ALL USING (
  child_id IN (SELECT id FROM children WHERE parent_id = auth.uid())
);


-- ANSWERS
CREATE TABLE answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES practice_sessions(id) ON DELETE CASCADE NOT NULL,
  question_id TEXT,
  user_answer INTEGER,
  correct_answer INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  response_time INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Answers
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parents can manage their children's answers" ON answers FOR ALL USING (
  session_id IN (
    SELECT ps.id FROM practice_sessions ps
    JOIN children c ON ps.child_id = c.id
    WHERE c.parent_id = auth.uid()
  )
);


-- ACHIEVEMENTS (Dictionary Table)
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  requirement TEXT NOT NULL
);

-- RLS: Achievements (Read-only for all authenticated users)
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view achievements" ON achievements FOR SELECT USING (auth.role() = 'authenticated');


-- CHILD ACHIEVEMENTS
CREATE TABLE child_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(child_id, achievement_id)
);

-- RLS: Child Achievements
ALTER TABLE child_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parents can view their children's achievements" ON child_achievements FOR ALL USING (
  child_id IN (SELECT id FROM children WHERE parent_id = auth.uid())
);


-- TRIGGER FOR NEW USERS
-- Automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'avatar_url', 'parent');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
