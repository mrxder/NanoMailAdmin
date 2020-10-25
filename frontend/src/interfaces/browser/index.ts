import Cookies from "js-cookie";
import { checkAuth } from "../server";

export const getAuthValCookie = (): string | undefined => {
  return Cookies.get("authHeadVal");
};

export const setAuthValCookie = (val: string): void => {
  Cookies.set("authHeadVal", val);
};

export const isAuthCookiePresentAndValid = async (): Promise<boolean> => {
  const authVal = getAuthValCookie();
  if (authVal) {
    const checkResult: boolean = await checkAuth(authVal);
    if (checkResult) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};
