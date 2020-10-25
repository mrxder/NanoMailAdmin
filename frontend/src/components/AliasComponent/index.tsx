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
import { Alias } from "../../interfaces/server";

interface AliasComponentProps {
  domain: string;
  icon: ReactElement;
  onSave: (alias: Alias) => Promise<boolean>;
  onDelete?: (alias: Alias) => Promise<boolean>;
  alias?: Alias;
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

const AliasComponent: FunctionComponent<AliasComponentProps> = ({
  domain,
  icon,
  onSave,
  onDelete,
  alias,
}: AliasComponentProps) => {
  const [oldAlias, setOldAlias] = useState<Alias | undefined>(alias);
  const [source_username, setSource_username] = useState<string>(
    alias?.source_username ?? ""
  );
  const [destination_username, setDestination_username] = useState<string>(
    alias?.destination_username ?? ""
  );
  const [destination_domain, setDestination_domain] = useState<string>(
    alias?.destination_domain ?? ""
  );
  const [enabled, setEnabled] = useState<string>(alias?.enabled ?? "1");

  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(alias ? false : true);
  const [highliteErrorFields, setHighliteErrorFields] = useState<boolean>(
    false
  );

  const reset = () => {
    setSource_username("");
    setDestination_username("");
    setDestination_domain("");
    setHighliteErrorFields(false);
  };

  const checkSave = async (x: React.MouseEvent<HTMLButtonElement>) => {
    if (
      source_username.length > 0 &&
      destination_username.length > 0 &&
      destination_domain.length > 0
    ) {
      const onSaveResult = await onSave({
        id: oldAlias?.id,
        source_username: source_username,
        source_domain: domain,
        destination_username: destination_username,
        destination_domain: destination_domain,
        enabled: enabled,
      });
      if (onSaveResult) {
        if (!oldAlias) {
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
    if (oldAlias && onDelete) {
      const result = await onDelete(oldAlias);
    }
    setDeleteOpen(false);
  };

  const classes = useStyles();
  return (
    <ListItem>
      <ListItemIcon>{icon}</ListItemIcon>
      <TextField
        margin="normal"
        label="Source Username"
        variant="filled"
        value={source_username}
        onChange={(x) => {
          setSource_username(x.target.value);
        }}
        disabled={!edit}
        error={
          source_username.length === 0 && highliteErrorFields ? true : false
        }
      />
      <div className={classes.text}>
        <Typography>{"@" + domain}</Typography>
      </div>
      <TextField
        className={classes.input}
        margin="normal"
        label="Destination Username"
        variant="filled"
        value={destination_username}
        onChange={(x) => setDestination_username(x.target.value)}
        disabled={!edit}
        error={
          destination_username.length === 0 && highliteErrorFields
            ? true
            : false
        }
      />
      <div className={classes.text}>
        <Typography>@</Typography>
      </div>
      <TextField
        className={classes.input}
        margin="normal"
        label="Destination Domain"
        variant="filled"
        value={destination_domain}
        onChange={(x) => {
          setDestination_domain(x.target.value);
        }}
        disabled={!edit}
        error={
          destination_domain.length === 0 && highliteErrorFields ? true : false
        }
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
          {"Delete Alias " + source_username + "@" + domain + " ?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {" Do you really want to delete this alias from " +
              source_username +
              "@" +
              domain +
              " to " +
              destination_username +
              "@" +
              destination_domain +
              "?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)} color="primary">
            Keep alias
          </Button>
          <Button color="secondary" size="small" onClick={checkDelete}>
            DELETE
          </Button>
        </DialogActions>
      </Dialog>
    </ListItem>
  );
};

export default AliasComponent;
