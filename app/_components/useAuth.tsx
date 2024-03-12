"use client"

import { useSession } from 'next-auth/react';

function useAuth() {
  const { data: session } = useSession();

  if (!session?.user) {
    return { isAuthorized: false, roles: [] }; 
  }

  const roles = session.user.role?.split(',') || [];
  const isAuthorized = roles.some(role => role === 'master' || role === 'admin');

  return { isAuthorized, roles };
}

export default useAuth;
