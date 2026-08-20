-- Drop the savings_goals table and related data since we're replacing with percentage-based system
DROP TABLE IF EXISTS public.savings_goals;

-- Create a simpler savings_settings table for percentage-based savings
CREATE TABLE public.savings_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  savings_percentage NUMERIC NOT NULL DEFAULT 30,
  month DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, month)
);

-- Enable RLS
ALTER TABLE public.savings_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own savings settings" 
ON public.savings_settings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own savings settings" 
ON public.savings_settings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own savings settings" 
ON public.savings_settings 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own savings settings" 
ON public.savings_settings 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_savings_settings_updated_at
BEFORE UPDATE ON public.savings_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();