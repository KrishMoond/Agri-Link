// Auth helpers for localStorage
export const getAuthToken = () => localStorage.getItem('authToken');
export const setAuthToken = (token: string) => localStorage.setItem('authToken', token);
export const removeAuthToken = () => localStorage.removeItem('authToken');
export const getCurrentUser = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};
export const setCurrentUser = (user: any) => localStorage.setItem('currentUser', JSON.stringify(user));
export const removeCurrentUser = () => localStorage.removeItem('currentUser');
