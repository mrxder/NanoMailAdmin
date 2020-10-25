import React, { FunctionComponent } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Container from "@material-ui/core/Container";

import Login from "./view/Login";
import {
  Link,
  Typography,
  Box,
  makeStyles,
  CssBaseline,
} from "@material-ui/core";
import Domains from "./view/Domains";
import Eelements from "./view/Elements";

const Copyright: FunctionComponent = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"MailAdmin Copyright © "}
      <Link color="inherit" href="https://www.keim.dev/">
        keim.dev
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "left",
    width: "100%",
  },
}));

const App: FunctionComponent = () => {
  const classes = useStyles();

  return (
    <Container>
      <CssBaseline />
      <div className={classes.paper}>
        <Router>
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/domains">
              <Domains />
            </Route>
            <Route path="/elements">
              <Eelements />
            </Route>
            <Route path="/" exact>
              <h1>Check and forward?</h1>
            </Route>
          </Switch>
        </Router>
        <Box mt={8}>
          <Copyright />
        </Box>
      </div>
    </Container>
  );
};

export default App;
