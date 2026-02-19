import { configuration } from "./lib/config";

export const ACCESS = ''
export const USER_STORAGE_KEY = 'user';
export const TODAY = new Date().toISOString().slice(0, 10);
export const TOMORROW = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
// export const LOGIN = `${configuration.IDP_URL}Access/Login?ReturnUrl=${configuration.BASE_URL}login`
// export const LOGOUT = `${configuration.IDP_URL}Home/Logout`
 export const AVATAR = `${configuration.AVATAR_URL}`