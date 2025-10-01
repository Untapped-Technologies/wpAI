-- Create chat_history table for permanent storage
CREATE TABLE IF NOT EXISTS public.chat_history (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  path TEXT,
  share_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON public.chat_history(user_id);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_chat_history_created_at ON public.chat_history(created_at DESC);

-- Create index on updated_at for sorting
CREATE INDEX IF NOT EXISTS idx_chat_history_updated_at ON public.chat_history(updated_at DESC);

-- Enable Row Level Security
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own chats
CREATE POLICY "Users can view their own chats"
  ON public.chat_history
  FOR SELECT
  USING (auth.uid()::text = user_id);

-- Create policy to allow users to insert their own chats
CREATE POLICY "Users can insert their own chats"
  ON public.chat_history
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Create policy to allow users to update their own chats
CREATE POLICY "Users can update their own chats"
  ON public.chat_history
  FOR UPDATE
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- Create policy to allow users to delete their own chats
CREATE POLICY "Users can delete their own chats"
  ON public.chat_history
  FOR DELETE
  USING (auth.uid()::text = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_chat_history_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_chat_history_updated_at
  BEFORE UPDATE ON public.chat_history
  FOR EACH ROW
  EXECUTE FUNCTION public.update_chat_history_updated_at();

