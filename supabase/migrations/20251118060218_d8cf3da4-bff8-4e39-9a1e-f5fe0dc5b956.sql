-- Create interview_sessions table
CREATE TABLE public.interview_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  overall_score INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create interview_questions table
CREATE TABLE public.interview_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text TEXT NOT NULL,
  category TEXT NOT NULL,
  time_limit INTEGER NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create interview_responses table
CREATE TABLE public.interview_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.interview_sessions(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES public.interview_questions(id) ON DELETE CASCADE NOT NULL,
  audio_text TEXT NOT NULL,
  is_correct BOOLEAN,
  score INTEGER,
  feedback TEXT,
  answered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for interview_sessions
CREATE POLICY "Users can view their own sessions"
  ON public.interview_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions"
  ON public.interview_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions"
  ON public.interview_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for interview_questions (public read)
CREATE POLICY "Anyone can view questions"
  ON public.interview_questions FOR SELECT
  USING (true);

-- RLS Policies for interview_responses
CREATE POLICY "Users can view their own responses"
  ON public.interview_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.interview_sessions
      WHERE id = session_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own responses"
  ON public.interview_responses FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.interview_sessions
      WHERE id = session_id AND user_id = auth.uid()
    )
  );

-- Insert sample interview questions
INSERT INTO public.interview_questions (question_text, category, time_limit, order_index) VALUES
  ('Tell me about yourself and your background.', 'Introduction', 120, 1),
  ('What are your greatest strengths?', 'Behavioral', 90, 2),
  ('Describe a challenging situation you faced and how you handled it.', 'Behavioral', 120, 3),
  ('Why do you want to work for our company?', 'Motivation', 90, 4),
  ('Where do you see yourself in five years?', 'Career Goals', 60, 5);

-- Create indexes
CREATE INDEX idx_sessions_user_id ON public.interview_sessions(user_id);
CREATE INDEX idx_responses_session_id ON public.interview_responses(session_id);
CREATE INDEX idx_questions_order ON public.interview_questions(order_index);