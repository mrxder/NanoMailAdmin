import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Input,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import EditIcon from "@material-ui/icons/Edit";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import React, {
  FunctionComponent,
  MouseEvent,
  ReactElement,
  useState,
} from "react";
import { Account } from "../../interfaces/server";

interface AccountComponentProps {
  domain: string;
  icon: ReactElement;
  onSave: (account: Account) => Promise<boolean>;
  onDelete?: (account: Account) => Promise<boolean>;
  account?: Account;
}

const useStyles = makeStyles((theme) => ({
  input: {
    marginLeft: theme.spacing(2),
  },

  text: {
    display: "block",
    marginLeft: "20px",
    marginTop: "6px",
  },
}));

const AccountComponent: FunctionComponent<AccountComponentProps> = ({
  domain,
  icon,
  onSave,
  onDelete,
  account,
}: AccountComponentProps) => {
  const [oldAccount, setOldAccount] = useState<Account | undefined>(account);
  const [name, setName] = useState<string>(account?.username ?? "");
  const [password, setPassword] = useState<string>(account?.password ?? "");
  const [quoata, setQuota] = useState<string>(account?.quota ?? "2024");
  const [enabled, setEnabled] = useState<string>(account?.enabled ?? "1");

  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);

  const [editUsername, setEditUsername] = useState<boolean>(
    account ? false : true
  );
  const [edit, setEdit] = useState<boolean>(account ? false : true);
  const [highliteErrorFields, setHighliteErrorFields] = useState<boolean>(
    false
  );

  const reset = () => {
    setName("");
    setPassword("");
    setHighliteErrorFields(false);
  };

  const checkSave = async (x: React.MouseEvent<HTMLButtonElement>) => {
    if (name.length > 0 && password.length > 0 && quoata.length > 0) {
      const onSaveResult = await onSave({
        id: oldAccount?.id,
        username: name,
        domain: domain,
        password: password,
        quota: quoata,
        enabled: enabled,
        sendonly: "0",
      });
      if (onSaveResult) {
        if (!oldAccount) {
          reset();
        } else {
          setEdit(false);
        }
      }
    } else {
      setHighliteErrorFields(true);
    }
  };

  const checkDelete = async (x: React.MouseEvent<HTMLButtonElement>) => {
    if (oldAccount && onDelete) {
      const result = await onDelete(oldAccount);
    }
    setDeleteOpen(false);
  };

  const classes = useStyles();
  return (
    <ListItem>
      <ListItemIcon>{icon}</ListItemIcon>
      <TextField
        margin="normal"
        label="Name"
        variant="filled"
        value={name}
        onChange={(x) => {
          setName(x.target.value);
        }}
        disabled={!editUsername}
        error={name.length === 0 && highliteErrorFields ? true : false}
      />
      <div className={classes.text}>
        <Typography>{"@" + domain}</Typography>
      </div>
      <TextField
        className={classes.input}
        type="password"
        margin="normal"
        label="Password"
        variant="filled"
        value={password}
        onChange={(x) => setPassword(x.target.value)}
        disabled={!edit}
        error={password.length === 0 && highliteErrorFields ? true : false}
      />
      <TextField
        className={classes.input}
        type="number"
        margin="normal"
        label="Storage MB"
        variant="filled"
        value={quoata}
        onChange={(x) => {
          setQuota(x.target.value);
        }}
        disabled={!edit}
        error={quoata.length === 0 && highliteErrorFields ? true : false}
      />
      <FormControlLabel
        control={<Checkbox color="primary" />}
        label="Enabled"
        labelPlacement="top"
        checked={enabled == "1" ? true : false}
        onChange={(x, check) => {
          setEnabled(check ? "1" : "0");
        }}
        disabled={!edit}
      />
      <Box visibility={edit ? "" : "hidden"}>
        <Button
          color="primary"
          type="submit"
          size="large"
          startIcon={<SaveIcon />}
          onClick={checkSave}
        >
          Save
        </Button>
      </Box>
      <Box visibility={edit ? "hidden" : ""}>
        <Button
          startIcon={<EditIcon />}
          onClick={(x) => {
            setEdit(true);
          }}
        >
          Edit
        </Button>
        <Button
          color="secondary"
          startIcon={<DeleteForeverIcon />}
          onClick={() => {
            setDeleteOpen(true);
          }}
        >
          Delete
        </Button>
      </Box>

      <Dialog
        open={deleteOpen}
        keepMounted
        onClose={() => setDeleteOpen(false)}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          {"Delete Account " + name + "@" + domain + " ?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Do you really want to delete this account?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)} color="primary">
            Keep account
          </Button>
          <Button color="secondary" size="small" onClick={checkDelete}>
            DELETE
          </Button>
        </DialogActions>
      </Dialog>
    </ListItem>
  );
};

export default AccountComponent;
