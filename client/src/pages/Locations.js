import React from 'react';
import axios from 'axios';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Alert from '@material-ui/lab/Alert';
import Pagination from '@material-ui/lab/Pagination';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = (theme) => ({
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '15px',
    marginBottom: '15px',
  },
  createButton: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

class Episodes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      loading: true,
      page: 1,
      errorMsg: null,
      successMsg: null,
    };

    this._handlePageChange = this._handlePageChange.bind(this);
  }

  componentDidMount() {
    this._fetchData();
  }

  _handlePageChange(event, value) {
    this.setState({
      page: value,
      loading: true,
      data: null,
    }, () => {
      this._fetchData();
    });
  }

  async _fetchData(successMsg = null) {
    // set loading
    if (!this.state.loading) this.setState({ loading: true });

    // fetch api
    try {
      const res = await axios.get(`/api/location?page=${this.state.page}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-ApiKey': this.props.token,
        },
      });
      this.setState({
        data: res.data,
        loading: false,
        errorMsg: null,
        successMsg: successMsg ? successMsg : null,
      });
    } catch (err) {
      let message = err.message;
      if (err.response && err.response.status === 401) {
        this.props.onExpire();
      }
      if (err.response && err.response.data) {
        message = err.response.data.message;
      }
      this.setState({
        errorMsg: message,
        successMsg: null,
        loading: false,
      });
    }
  }

  async _removeItem(target) {
    // set loading
    if (!this.state.loading) this.setState({ loading: true });

    // fetch api
    try {
      const res = await axios.delete(`/api/location/${target}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-ApiKey': this.props.token,
        },
      });
      this._fetchData(res.data.message);
    } catch (err) {
      let message = err.message;
      if (err.response && err.response.status === 401) {
        this.props.onExpire();
      }
      if (err.response && err.response.data) {
        message = err.response.data.message;
      }
      this.setState({
        errorMsg: message,
        loading: false,
      });
    }
  }

  render() {
    const { classes } = this.props;
    const { data, loading, errorMsg, successMsg, page } = this.state;

    // pagination
    let pagination;
    let itemSize = '?';
    if (data) {
      pagination = (
        <Pagination
          page={page}
          className={classes.pagination}
          count={data.info.totalPages}
          color="secondary"
          disabled={loading}
          onChange={this._handlePageChange}
        />
      );

      itemSize = data.info.total;
    }

    return (
      <div>
        <Grid container justify="between" align="center" spacing={3}>
          <Grid item xs={6}>
            <Grid container direction="row" justify="flex-start" alignItems="flex-start">
              <h2>Lugares ({itemSize})</h2>
            </Grid>
          </Grid>

          <Grid item xs={6} className={classes.createButton}>
            <Button variant="contained" color="primary">Nuevo</Button>
          </Grid>
        </Grid>
  
        {loading && (
          <Box display="flex" justifyContent="center">
            <CircularProgress color="secondary" />
          </Box>
        )}
        {errorMsg && (
          <Alert severity="error">{errorMsg}</Alert>
        )}
        {successMsg && (
          <Alert severity="success">{successMsg}</Alert>
        )}
        {pagination}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            {data && data.data.map((item) => (
              <Grid key={item.id} xs={3} item>
                <Card>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      {item.name}
                    </Typography>
                    <Typography color="textSecondary">
                      {item.type} {item.dimension !== "unknown" && (
                        <span>en {item.dimension}</span>
                      )}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">Editar</Button>
                    <Button size="small" onClick={() => this._removeItem(item.id) }>Eliminar</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
        {pagination}
      </div>
    );
  }
}

export default withStyles(useStyles, { withTheme: true })(Episodes);
