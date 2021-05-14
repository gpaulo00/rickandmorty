import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Remove from '@material-ui/icons/Delete';

import { useParams } from 'react-router';
import { Link as RouterLink } from "react-router-dom";
import axios from 'axios';

const useStyles = (theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
});

export default function LogationFormParent(props) {
  const { locationId } = useParams();
  const isNew = locationId === "new";

  return <StyledLocationForm {...props} isNew={isNew} locationId={locationId} />
}

class LocationForm extends React.Component {
  constructor(props) {
    super(props);
    const { locationId, isNew } = this.props;
    this.state = {
      name: '',
      tipe: '',
      dimension: '',
      url: '',
      msg: '',
      residents: [],
      loading: true,

      isNew,
      locationId,
    };
    
    this.handleItem = this.handleItem.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentDidMount() {
    const { isNew } = this.state;
    if (!isNew) {
      this._fetchData();
    } else {
      this.setState({ loading: false });
    }
  }

  _fetchData() {
    const { locationId } = this.state;
    return axios.get(`/api/location/${locationId}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-ApiKey': this.props.token,
      },
    }).then((res) => {
      const { name, type, dimension, url, residents } = res.data.data;
      this.setState({ name, tipe: type, dimension, url, residents, loading: false });
    }).catch((err) => {
      let message = err.message;
      if (err.response && err.response.data) {
        message = err.response.data.message;
      }
      this.setState({ msg: message, loading: false });
    });
  }

  handleItem(ev, item) {
    this.setState({ [item]: ev.target.value });
  }

  removeResident(id) {
    this.setState({ loading: true });
    const { locationId } = this.state;
    const prom = axios.delete(`/api/location/${locationId}/resident/${id}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-ApiKey': this.props.token,
      },
    }).then(() => {
      this._fetchData();
    }).catch((err) => {
      let message = err.message;
      if (err.response && err.response.data) {
        message = err.response.data.message;
      }
      this.setState({ msg: message, loading: false });
    });
  }

  handleSave(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    this.setState({ loading: true });

    const { name, tipe, dimension, url, isNew, locationId } = this.state;
    const { token } = this.props;
    const body = { name, type: tipe, dimension, url };

    const opts = { headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-ApiKey': token,
    } };

    let prom;
    if (isNew) {
      body.id = undefined;
      prom = axios.post("/api/location", body, opts);
    }
    else { prom = axios.put(`/api/location/${locationId}`, body, opts); }

    prom.then((res) => {
      let add = {};
      let msg = 'Lugar modificado!'
      if (isNew) {
        add = { isNew: false, locationId: res.data.data.id };
        msg = 'Lugar guardado!';
      }
      this.setState({ msg, loading: false, ...add });
    }).catch((err) => {
      let msg = err.message;
      if (err.response && err.response.data) {
        msg = err.response.data.message;
      }
      this.setState({ msg, loading: false });
    });
  }

  render() {
    const { classes } = this.props;
    const { name, tipe, dimension, url, msg, loading, residents } = this.state;

    const msgAlert = (
      msg && <Alert severity="info">{msg}</Alert>
    );

    return (
      <React.Fragment>
        <CssBaseline />
        <main>
          <Paper className={classes.paper}>
            <Typography component="h1" variant="h4" align="center">
              Lugar
            </Typography>
            {msgAlert}
            <form className={classes.form} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Nombre"
                name="name"
                value={name}
                onChange={(ev) => this.handleItem(ev, "name")}
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="type"
                label="Tipo"
                value={tipe}
                onChange={(ev) => this.handleItem(ev, "tipe")}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="dimension"
                label="Dimensión"
                value={dimension}
                onChange={(ev) => this.handleItem(ev, "dimension")}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="url"
                label="URL"
                value={url}
                onChange={(ev) => this.handleItem(ev, "url")}
              />

              <Typography component="h2" variant="h5" align="left">
                Residentes
              </Typography>

              {(residents.length === 0) && (
                <Typography component="h2" variant="h6" align="center">
                  No tiene residentes asociados!
                </Typography>
              )}
              <List component="nav" aria-label="main mailbox folders">
                {residents.map((item) => (
                  <ListItem key={item.id} button>
                    <ListItemIcon>
                      <Avatar alt={item.name} src={item.image} />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.name}
                    />
                    <Remove onClick={() => this.removeResident(item.id)} />
                  </ListItem>
                ))}
              </List>

              <Grid container direction="row-reverse" spacing={3}>
                <Grid item>
                  <Button
                    component={RouterLink}
                    to="/location"
                    variant="contained" color="primary"
                  >
                    Volver
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    className={classes.submit}
                    onClick={this.handleSave}
                  >
                    Guardar
                  </Button>
                </Grid>
              </Grid>
              {loading}
            </form>
          </Paper>
        </main>
      </React.Fragment>
    );
  }
}

const StyledLocationForm = withStyles(useStyles, { withTheme: true })(LocationForm);