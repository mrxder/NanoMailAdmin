import React, {
  FunctionComponent,
  useState,
  useEffect,
  ReactElement,
  MouseEvent,
} from "react";
import Cookies from "js-cookie";
import { useHistory } from "react-router-dom";

import { createAuthValue, checkAuth } from "../../interfaces/server/index";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { CircularProgress } from "@material-ui/core";
import { setAuthValCookie } from "../../interfaces/browser";

interface LoginProps {}
interface LoginState {
  clicks: number;
}

const useStyles = makeStyles((theme) => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Login: FunctionComponent<LoginProps> = (props: LoginProps) => {
  const history = useHistory();

  const [clicks, setClicks] = useState<LoginState>({ clicks: 5 });
  const [mount, setMount] = useState<number>(0);

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoginError, setIsLoginError] = useState<boolean>(false);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmitClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setIsLoading(true);
    const authVal: string = await createAuthValue(username, password);
    const isAuthValid: boolean = await checkAuth(authVal);
    if (isAuthValid) {
      setAuthValCookie(authVal);
      history.push("./domains");
    } else {
      setIsLoginError(true);
      setIsLoading(false);
      setUsername("");
      setPassword("");
    }
  };

  /* Did mount */
  useEffect(() => {}, [mount]);

  const classes = useStyles();

  return (
    <>
      <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>

      <TextField
        error={isLoginError}
        helperText={isLoginError ? "Wrong username" : ""}
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="username"
        label="Username"
        name="username"
        autoComplete="username"
        value={username}
        onChange={handleUsernameChange}
        autoFocus
      />
      <TextField
        error={isLoginError}
        helperText={isLoginError ? "Wrong password" : ""}
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        value={password}
        onChange={handlePasswordChange}
      />
      {/*
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          */}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
        onClick={handleSubmitClick}
        disabled={isLoading}
      >
        Sign In
      </Button>

      <Box display={isLoading ? "block" : "none"}>
        <CircularProgress />
      </Box>
      {/*
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
           */}
    </>
  );
};

export default Login;
