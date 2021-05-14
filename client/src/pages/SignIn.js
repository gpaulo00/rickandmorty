import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import axios from 'axios';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Gustavo Paulo. '}
      {new Date().getFullYear()}
    </Typography>
  );
}

const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      pass: '',
      loading: false,
      errorMsg: this.props.status === "AUTH" ? "Sesión expirada" : null,
      register: false,
      registerMsg: null,
    };

    this.setRegister = this.setRegister.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.handlePass = this.handlePass.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }
  setRegister() {
    this.setState({ register: true });
  }
  handleEmail(ev) {
    this.setState({
      email: ev.target.value,
    });
  }
  handlePass(ev) {
    this.setState({
      pass: ev.target.value,
    });
  }
  handleLogin(ev) {
    // set loading
    ev.preventDefault();
    ev.stopPropagation();
    this.setState({ loading: true });

    // send login or signup request
    const { register, email, pass: password } = this.state;
    const endpoint = register ? 'signup' : 'login';
    axios.post(`/api/${endpoint}`, { email, password }, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      let registerMsg = null;
      if (!register) { this.props.setToken(res.data['token']); }
      else { registerMsg = 'Usuario creado!'; }

      // set state
      this.setState({
        loading: false,
        register: false,
        registerMsg,
        email: '',
        pass: '',
      });
    }).catch((err) => {
      let message = err.message;
      if (err.response && err.response.data) {
        message = err.response.data.message;
      }
      this.setState({
        loading: false,
        errorMsg: message,
      });
    });
  }

  render() {
    const { classes } = this.props;
    const { register } = this.state;
    const loading = this.state.loading && (
      <Box display="flex" justifyContent="center">
        <CircularProgress color="secondary" />
      </Box>
    );
    const errMsg = (
      this.state.errorMsg &&
        <Alert severity="error">{this.state.errorMsg}</Alert>
    );
    const registerMsg = (
      this.state.registerMsg &&
        <Alert severity="success">{this.state.registerMsg}</Alert>
    );

    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {!register ? 'Inicio de Sesión' : 'Crear Cuenta'}
          </Typography>
          <form className={classes.form} noValidate>
            {errMsg}
            {registerMsg}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo Electrónico"
              name="email"
              value={this.state.email}
              onChange={this.handleEmail}
              autoComplete="email"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
              value={this.state.pass}
              onChange={this.handlePass}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={this.props.loading}
              className={classes.submit}
              onClick={this.handleLogin}
            >
              {!register ? 'Iniciar Sesión' : 'Registrarse'}
            </Button>

            {!register && (
              <Grid container justify="center" alignItems="center" spacing={3}>
                <Button
                  color="primary"
                  disabled={this.props.loading}
                  onClick={this.setRegister}
                >
                  Registrar
                </Button>
              </Grid>
            )}
            {loading}
          </form>
        </div>
        <Box mt={5}>
          <Copyright />
        </Box>
      </Container>
    );
  }
}

export default withStyles(styles, { withTheme: true })(SignIn);