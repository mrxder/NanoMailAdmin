import {
  Box,
  ListItem,
  ListItemIcon,
  ListItemText,
  ThemeProvider,
  Typography,
} from "@material-ui/core";
import DomainIcon from "@material-ui/icons/Domain";
import React, {
  FunctionComponent,
  ReactElement,
  useEffect,
  useState,
} from "react";
import { useHistory } from "react-router-dom";
import {
  getAuthValCookie,
  isAuthCookiePresentAndValid,
} from "../../interfaces/browser";
import { Domain, getDomains } from "../../interfaces/server";

interface DomainProps {}

const Domains: FunctionComponent<DomainProps> = (props: DomainProps) => {
  const history = useHistory();
  const [domainsState, setDomains] = useState<Domain[]>([]);

  useEffect(() => {
    const didMount = async () => {
      isAuthCookiePresentAndValid().then((res) => {
        if (!res) {
          history.push("./login");
        }
      });

      const auhtVal = getAuthValCookie();
      if (auhtVal) {
        getDomains(auhtVal).then((domains) => {
          setDomains(domains);
        });
      } else {
        history.push("./login");
      }
    };
    didMount();
  }, []);

  const pushDomainToHistory = (domain: string) => {
    history.push("./elements?domain=" + domain);
  };

  const domainElements = domainsState.map((domain: Domain) => {
    return (
      <ListItem
        key={domain.id}
        button
        onClick={() => pushDomainToHistory(domain.domain)}
      >
        <ListItemIcon>
          <DomainIcon />
        </ListItemIcon>
        <ListItemText primary={domain.domain} />
      </ListItem>
    );
  });

  return (
    <Box width={1}>
      <Box width={1}>
        <Typography variant="h2" component="h1">
          Domains:
        </Typography>
        <Typography variant="body1" component="p">
          Select the Domain which you want to edit:
        </Typography>
      </Box>
      <Box width={1} marginTop="20px">
        {domainElements}
      </Box>
    </Box>
  );
};

export default Domains;
