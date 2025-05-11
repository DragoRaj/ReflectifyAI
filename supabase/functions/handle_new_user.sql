
-- Function to handle new user signup and correctly set their role and profile data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  default_role TEXT := 'student';
  user_role TEXT;
  first_name TEXT;
  last_name TEXT;
BEGIN
  -- Get role from user metadata, default to 'student' if not set
  user_role := COALESCE(
    (new.raw_user_meta_data->>'role')::TEXT, 
    default_role
  );

  -- Get first name and last name from metadata
  first_name := new.raw_user_meta_data->>'first_name';
  last_name := new.raw_user_meta_data->>'last_name';

  -- Insert profile data
  INSERT INTO public.profiles (id, email, role, first_name, last_name)
  VALUES (
    new.id, 
    new.email, 
    user_role::public.user_role, 
    first_name, 
    last_name
  );

  RETURN new;
END;
$$;

-- Create trigger to handle new user signups if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created' 
    AND tgrelid = 'auth.users'::regclass
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END
$$;
