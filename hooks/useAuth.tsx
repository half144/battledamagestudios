// hooks/useAuth.tsx
import { useEffect, useState } from 'react';
import { supabase, Profile } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar a sessão atual
    const checkSession = async () => {
      setLoading(true);
      
      try {
        const { data: sessionData, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }
        
        if (sessionData?.session) {
          setUser(sessionData.session.user);
          
          // Buscar dados do perfil
          const { data: profileData, error: profileError } = await supabase
            .from('profile')
            .select('*')
            .eq('id', sessionData.session.user.id)
            .single();
            
          if (profileError) {
            console.error('Error fetching profile:', profileError);
            setProfile(null);
          } else {
            setProfile(profileData);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setUser(null);
        setProfile(null);
      }
      
      setLoading(false);
    };

    // Verificar a sessão atual
    checkSession();

    // Configurar listener para mudanças na autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setUser(session.user);
        
        // Buscar dados do perfil
        const { data: profileData, error: profileError } = await supabase
          .from('profile')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          setProfile(null);
        } else {
          setProfile(profileData);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      
      setLoading(false);
    });

    // Cleanup
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [router]);

  // Definindo isAdmin: só é true se tiver um profile com role 'admin'
  const isAdmin = profile?.role === 'admin';

  console.log("Auth state:", { user, profile, isAdmin, loading });

  return { user, profile, isAdmin, loading };
}