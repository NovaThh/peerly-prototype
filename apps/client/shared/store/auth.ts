let loggedInUserId: string | null = null;

export const isLoggedIn = () => loggedInUserId !== null;

export const getLoggedInUserId = () => loggedInUserId;

export const login = (userId: string) => {
  loggedInUserId = userId;
};

export const logout = () => {
  loggedInUserId = null;
};