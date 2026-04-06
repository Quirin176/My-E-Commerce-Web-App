// import { useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';

// export const useAuth = () => {
//   const context = useContext(AuthContext);
  
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
  
//   return context;
// };

import { useAuthStore } from "../../store/useAuthStore";

// Drop-in replacement — every component calling useAuth() needs zero changes
export const useAuth = () => useAuthStore();