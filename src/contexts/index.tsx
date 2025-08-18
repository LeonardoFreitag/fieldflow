import React, { type ReactNode } from 'react';
import { AuthContextProvider } from './AuthContext';

interface CombinedAuthProviderProps {
  children: ReactNode;
}

export const CombinedAuthProvider = ({
  children,
}: CombinedAuthProviderProps) => {
  return <AuthContextProvider>{children}</AuthContextProvider>;
};
