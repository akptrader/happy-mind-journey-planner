
-- Create users profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create medications table
CREATE TABLE public.medications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  time TEXT,
  taken BOOLEAN DEFAULT FALSE,
  taken_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create mood entries table
CREATE TABLE public.mood_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  mood INTEGER NOT NULL CHECK (mood >= 1 AND mood <= 10),
  energy INTEGER CHECK (energy >= 1 AND energy <= 10),
  anxiety INTEGER CHECK (anxiety >= 1 AND anxiety <= 10),
  notes TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create health metrics table
CREATE TABLE public.health_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  metric_type TEXT NOT NULL,
  value NUMERIC NOT NULL,
  unit TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create exercise entries table
CREATE TABLE public.exercise_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  exercise_type TEXT NOT NULL,
  duration INTEGER NOT NULL,
  intensity INTEGER CHECK (intensity >= 1 AND intensity <= 10),
  notes TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create diet entries table
CREATE TABLE public.diet_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  food_name TEXT NOT NULL,
  calories INTEGER,
  meal_type TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create work productivity entries table
CREATE TABLE public.work_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  difficulty INTEGER NOT NULL CHECK (difficulty >= 1 AND difficulty <= 5),
  energy INTEGER NOT NULL CHECK (energy >= 1 AND energy <= 5),
  notes TEXT,
  date DATE DEFAULT CURRENT_DATE
);

-- Create supplements table
CREATE TABLE public.supplements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  taken BOOLEAN DEFAULT FALSE,
  taken_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create checklist items table
CREATE TABLE public.checklist_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('medication', 'meals', 'selfcare')),
  time TEXT,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diet_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for medications
CREATE POLICY "Users can view own medications" ON public.medications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own medications" ON public.medications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own medications" ON public.medications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own medications" ON public.medications FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for mood entries
CREATE POLICY "Users can view own mood entries" ON public.mood_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own mood entries" ON public.mood_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own mood entries" ON public.mood_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own mood entries" ON public.mood_entries FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for health metrics
CREATE POLICY "Users can view own health metrics" ON public.health_metrics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own health metrics" ON public.health_metrics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own health metrics" ON public.health_metrics FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own health metrics" ON public.health_metrics FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for exercise entries
CREATE POLICY "Users can view own exercise entries" ON public.exercise_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own exercise entries" ON public.exercise_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own exercise entries" ON public.exercise_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own exercise entries" ON public.exercise_entries FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for diet entries
CREATE POLICY "Users can view own diet entries" ON public.diet_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own diet entries" ON public.diet_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own diet entries" ON public.diet_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own diet entries" ON public.diet_entries FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for work entries
CREATE POLICY "Users can view own work entries" ON public.work_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own work entries" ON public.work_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own work entries" ON public.work_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own work entries" ON public.work_entries FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for supplements
CREATE POLICY "Users can view own supplements" ON public.supplements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own supplements" ON public.supplements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own supplements" ON public.supplements FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own supplements" ON public.supplements FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for checklist items
CREATE POLICY "Users can view own checklist items" ON public.checklist_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own checklist items" ON public.checklist_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own checklist items" ON public.checklist_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own checklist items" ON public.checklist_items FOR DELETE USING (auth.uid() = user_id);

-- Create trigger to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
