// import { atom, useAtom } from 'jotai';
// import { useEffect } from 'react';
// import { jwtDecode } from 'jwt-decode';
// import api from '../api';
// import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';

// // Atoms
// const isAuthenticatedAtom = atom<boolean | null>(null);

// // Hook for authentication logic
// export const useAuth = () => {
//   const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);

//   useEffect(() => {
//     const checkAuth = async () => {
//       const token = localStorage.getItem(ACCESS_TOKEN);
//       if (!token) return setIsAuthenticated(false);

//       try {
//         const decoded: any = jwtDecode(token);
//         const isExpiringSoon = decoded.exp * 1000 - Date.now() < 60 * 1000;

//         if (isExpiringSoon) await refreshAuthToken(setIsAuthenticated);
//         else setIsAuthenticated(true);
//       } catch {
//         setIsAuthenticated(false);
//       }
//     };

//     checkAuth();
//     const interval = setInterval(checkAuth, 5 * 60 * 1000);
//     return () => clearInterval(interval);
//   }, [setIsAuthenticated]);

//   const login = (accessToken: string, refreshToken: string) => {
//     localStorage.setItem(ACCESS_TOKEN, accessToken);
//     localStorage.setItem(REFRESH_TOKEN, refreshToken);
//     setIsAuthenticated(true);
//   };

//   const logout = () => {
//     localStorage.removeItem(ACCESS_TOKEN);
//     localStorage.removeItem(REFRESH_TOKEN);
//     setIsAuthenticated(false);
//   };

//   return { isAuthenticated, login, logout };
// };

// // Refresh token function
// const refreshAuthToken = async (setIsAuthenticated: (value: boolean) => void) => {
//   const refresh = localStorage.getItem(REFRESH_TOKEN);
//   if (!refresh) return setIsAuthenticated(false);

//   try {
//     const { status, data } = await api.tokenRefreshCreate({ refresh });
//     if (status === 200) {
//       localStorage.setItem(ACCESS_TOKEN, data.access);
//       setIsAuthenticated(true);
//     } else setIsAuthenticated(false);
//   } catch {
//     setIsAuthenticated(false);
//   }
// };
