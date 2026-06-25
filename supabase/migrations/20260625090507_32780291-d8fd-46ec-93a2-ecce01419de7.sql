
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.owns_studio(text) FROM PUBLIC, anon, authenticated;
ALTER FUNCTION public.touch_updated_at() SET search_path = public;
