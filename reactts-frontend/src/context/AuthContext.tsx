import { createContext } from 'react';
import type { AuthContextType } from '../context/AuthProvider';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
