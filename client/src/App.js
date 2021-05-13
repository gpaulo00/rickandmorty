import { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link as RouterLink,
} from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import PlaceIcon from '@material-ui/icons/Place';
import AccountIcon from '@material-ui/icons/AccountBox';
import PlayIcon from '@material-ui/icons/PlayCircleFilled';

import './App.css';
import SignIn from './pages/SignIn.js';

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function App() {
  const classes = useStyles();
  const [token, setToken] = useState();

  if (!token) {
    return <SignIn setToken={setToken}></SignIn>;
  }
  return (
    <Router>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Rick and Morty
            </Typography>
            <Button color="inherit">Salir</Button>
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <Toolbar />
          <div className={classes.drawerContainer}>
            <List>
              <Link component={RouterLink} to="/">
                <ListItem button>
                  <ListItemIcon><PlaceIcon /></ListItemIcon>
                  <ListItemText primary="Lugares" />
                </ListItem>
              </Link>
              <Link component={RouterLink} to="/character">
                <ListItem button>
                  <ListItemIcon><AccountIcon /></ListItemIcon>
                  <ListItemText primary="Personajes" />
                </ListItem>
              </Link>
              <Link component={RouterLink} to="/episode">
                <ListItem button>
                  <ListItemIcon><PlayIcon /></ListItemIcon>
                  <ListItemText primary="Episodios" />
                </ListItem>
              </Link>
            </List>
          </div>
        </Drawer>

        <main className={classes.content}>
          <Toolbar />
          <Switch>
            <Route path="/episode">
              <div>episode</div>
            </Route>
            <Route path="/character">
              <div>character</div>
            </Route>
            <Route path="/">
              <div>locations</div>
            </Route>
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;
