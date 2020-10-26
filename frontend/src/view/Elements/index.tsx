import React, {
  FunctionComponent,
  ReactElement,
  useEffect,
  useState,
} from "react";
import { useHistory, useLocation } from "react-router-dom";
import AccountComponent from "../../components/AccountComponent";
import { getAuthValCookie } from "../../interfaces/browser";
import {
  getAccounts,
  Account,
  addAccount,
  updateAccount,
  deleteAccount,
  Alias,
  updateAlias,
  addAlias,
  getAliases,
  deleteAlias,
} from "../../interfaces/server";
import AddBoxIcon from "@material-ui/icons/AddBox";
import MailIcon from "@material-ui/icons/Mail";
import ForwardIcon from "@material-ui/icons/Forward";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { setEmitFlags } from "typescript";
import { Box, Button, ThemeProvider, Typography } from "@material-ui/core";
import AliasComponent from "../../components/AliasComponent";

interface ElementsProps {}
const Elements: FunctionComponent<ElementsProps> = (props: ElementsProps) => {
  const history = useHistory();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [aliases, setAliases] = useState<Alias[]>([]);

  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const domain = urlParams.get("domain");
  const auhtVal = getAuthValCookie();

  const loadAccounts = async () => {
    if (auhtVal && domain) {
      const accounts: Account[] = await getAccounts(domain, auhtVal);
      setAccounts(accounts);
    }
  };

  const loadAliases = async () => {
    if (auhtVal && domain) {
      const aliases: Alias[] = await getAliases(domain, auhtVal);
      setAliases(aliases);
    }
  };

  const checkLogin = () => {
    if (!auhtVal) {
      history.push("./login");
    }
  };

  useEffect(() => {
    checkLogin();
    loadAccounts();
    loadAliases();
  }, []);

  const onSaveAlias = async (alias: Alias) => {
    if (alias.id) {
      const result = await updateAlias(alias, auhtVal ?? "");
      return result;
    } else {
      const result = await addAlias(alias, auhtVal ?? "");
      loadAliases();
      return result;
    }
  };

  const onSaveAccount = async (account: Account) => {
    if (account.id) {
      const result = await updateAccount(account, auhtVal ?? "");
      return result;
    } else {
      const result = await addAccount(account, auhtVal ?? "");
      loadAccounts();
      return result;
    }
  };

  const onDeleteAlias = async (alias: Alias): Promise<boolean> => {
    const result = await deleteAlias(alias, auhtVal ?? "");
    await loadAliases();
    return result;
  };

  const onDeleteAccount = async (account: Account): Promise<boolean> => {
    const result = await deleteAccount(account, auhtVal ?? "");
    await loadAccounts();
    return result;
  };

  const accountElems = accounts.map((acc: Account) => {
    return (
      <AccountComponent
        key={acc.id}
        icon={<MailIcon />}
        domain={acc.domain}
        account={acc}
        onSave={onSaveAccount}
        onDelete={onDeleteAccount}
      ></AccountComponent>
    );
  });

  const aliasElems = aliases.map((ali: Alias) => {
    return (
      <AliasComponent
        key={ali.id}
        icon={<ForwardIcon />}
        domain={ali.source_domain}
        alias={ali}
        onSave={onSaveAlias}
        onDelete={onDeleteAlias}
      ></AliasComponent>
    );
  });

  return (
    <>
      <Box alignContent="left">
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => {
            history.push("./domains");
          }}
        >
          Back to domains
        </Button>
      </Box>
      <Box marginTop="70px">
        <Box>
          <Typography variant="h2" component="h1">
            Mail Accounts: {"(" + accounts.length + ")"}
          </Typography>
          {accountElems}
        </Box>
        <Box marginTop="20px">
          <Typography variant="h5" component="h1">
            Add new Mail Account:
          </Typography>
          <AccountComponent
            icon={<AddBoxIcon />}
            domain={domain ?? ""}
            onSave={onSaveAccount}
          ></AccountComponent>
        </Box>
      </Box>

      <Box marginTop="70px">
        <Box>
          <Typography variant="h2" component="h1">
            Aliases (redirection): {"(" + aliases.length + ")"}
          </Typography>
          {aliasElems}
        </Box>
        <Box marginTop="20px">
          <Typography variant="h5" component="h1">
            Add new alias:
          </Typography>
          <AliasComponent
            icon={<AddBoxIcon />}
            domain={domain ?? ""}
            onSave={onSaveAlias}
          ></AliasComponent>
        </Box>
      </Box>
    </>
  );
};

export default Elements;
