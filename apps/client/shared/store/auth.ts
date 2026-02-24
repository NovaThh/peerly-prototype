//TODO: check this again after we have backend
export let isLoggedIn = false;

export const login = () => {
  isLoggedIn = true;
};

export const logout = () => {
  isLoggedIn = false;
};