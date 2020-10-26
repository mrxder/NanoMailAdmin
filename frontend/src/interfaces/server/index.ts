import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { request } from "http";
const sha512: any = require("sha512crypt-node");

const buf2hex = (buffer: ArrayBuffer): string => {
  return Array.prototype.map
    .call(new Uint8Array(buffer), (x) => ("00" + x.toString(16)).slice(-2))
    .join("");
};

export const createAuthValue = async (
  username: string,
  password: string
): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const passwdDigestArray = await crypto.subtle.digest("SHA-512", data);
  const passwdDigest = buf2hex(passwdDigestArray);

  return username + ":" + passwdDigest;
};

const urlCreator = (res: string, action: string, domain?: string): string => {
  return (
    process.env.REACT_APP_BACKEND_BASE_URL +
    "index.php?res=" +
    res +
    "&action=" +
    action +
    (domain ? "&domain=" + domain : "")
  );
};

export const checkAuth = async (authValue: string): Promise<boolean> => {
  const url = urlCreator("domain", "get");
  const reqConfig: AxiosRequestConfig = {
    headers: { Auth: authValue },
  };
  try {
    const response = await axios.get(url, reqConfig);
    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
};

export interface Domain {
  id: string;
  domain: string;
}

export const getDomains = async (authValue: string): Promise<Domain[]> => {
  const url = urlCreator("domains", "get");
  const reqConfig: AxiosRequestConfig = {
    headers: { Auth: authValue },
  };

  const response: AxiosResponse<Domain[]> = await axios.get(url, reqConfig);
  if (response.status === 200 && response.data.length > 0) {
    return response.data;
  } else {
    return [];
  }
};

export interface Account {
  id?: string;
  username: string;
  domain: string;
  password: string;
  quota: string;
  enabled: string;
  sendonly: string;
}

const checkAndHashAccountPw = (acc: Account) => {
  const prefix = acc.password.substr(0, 14);
  if (prefix && prefix !== "{SHA512-CRYPT}") {
    acc.password = "{SHA512-CRYPT}" + sha512.sha512crypt(acc.password, "a");
  }
};

export const getAccounts = async (
  domain: string,
  authVal: string
): Promise<Account[]> => {
  const url = urlCreator("accounts", "get", domain);
  const reqConfig: AxiosRequestConfig = {
    headers: { Auth: authVal },
  };

  const response: AxiosResponse<Account[]> = await axios.get(url, reqConfig);
  if (response.status === 200 && response.data.length > 0) {
    return response.data;
  } else {
    return [];
  }
};

export const addAccount = async (
  account: Account,
  authVal: string
): Promise<boolean> => {
  checkAndHashAccountPw(account);
  const url = urlCreator("accounts", "insert");
  const reqConfig: AxiosRequestConfig = {
    headers: { Auth: authVal },
  };
  const response: AxiosResponse = await axios.post(url, account, reqConfig);
  if (response.status === 200) {
    return true;
  } else {
    return false;
  }
};

export const updateAccount = async (
  account: Account,
  authVal: string
): Promise<boolean> => {
  checkAndHashAccountPw(account);
  const url = urlCreator("accounts", "update");
  const reqConfig: AxiosRequestConfig = {
    headers: { Auth: authVal },
  };
  const response: AxiosResponse = await axios.post(url, account, reqConfig);
  if (response.status === 200) {
    return true;
  } else {
    return false;
  }
};

export const deleteAccount = async (
  account: Account,
  authVal: string
): Promise<boolean> => {
  const url = urlCreator("accounts", "delete");
  const reqConfig: AxiosRequestConfig = {
    headers: { Auth: authVal },
  };
  const response: AxiosResponse = await axios.post(url, account, reqConfig);
  if (response.status === 200) {
    return true;
  } else {
    return false;
  }
};

export interface Alias {
  id?: string;
  source_username: string;
  source_domain: string;
  destination_username: string;
  destination_domain: string;
  enabled: string;
}

export const getAliases = async (
  domain: string,
  authVal: string
): Promise<Alias[]> => {
  const url = urlCreator("aliases", "get", domain);
  const reqConfig: AxiosRequestConfig = {
    headers: { Auth: authVal },
  };

  const response: AxiosResponse<Alias[]> = await axios.get(url, reqConfig);
  if (response.status === 200 && response.data.length > 0) {
    return response.data;
  } else {
    return [];
  }
};

export const addAlias = async (
  alias: Alias,
  authVal: string
): Promise<boolean> => {
  const url = urlCreator("aliases", "insert");
  const reqConfig: AxiosRequestConfig = {
    headers: { Auth: authVal },
  };
  const response: AxiosResponse = await axios.post(url, alias, reqConfig);
  console.log(response);
  if (response.status === 200) {
    return true;
  } else {
    return false;
  }
};

export const updateAlias = async (
  alias: Alias,
  authVal: string
): Promise<boolean> => {
  const url = urlCreator("aliases", "update");
  const reqConfig: AxiosRequestConfig = {
    headers: { Auth: authVal },
  };
  const response: AxiosResponse = await axios.post(url, alias, reqConfig);
  if (response.status === 200) {
    return true;
  } else {
    return false;
  }
};

export const deleteAlias = async (
  alias: Alias,
  authVal: string
): Promise<boolean> => {
  const url = urlCreator("aliases", "delete");
  const reqConfig: AxiosRequestConfig = {
    headers: { Auth: authVal },
  };
  const response: AxiosResponse = await axios.post(url, alias, reqConfig);
  if (response.status === 200) {
    return true;
  } else {
    return false;
  }
};
