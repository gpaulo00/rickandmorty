import React from 'react';
import axios from 'axios';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Alert from '@material-ui/lab/Alert';
import Pagination from '@material-ui/lab/Pagination';
import CardContent from '@material-ui/core/CardContent';
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
});

class Characters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      loading: true,
      page: 1,
      errorMsg: null,
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

  async _fetchData() {
    // set loading
    if (!this.state.loading) this.setState({ loading: true });

    // fetch api
    try {
      const res = await axios.get(`/api/character?page=${this.state.page}`, {
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
        loading: false,
      });
    }
  }

  render() {
    const { classes } = this.props;
    const { data, loading, errorMsg, page } = this.state;

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
        <h2>Personajes ({itemSize})</h2>
  
        {loading && (
          <Box display="flex" justifyContent="center">
            <CircularProgress color="secondary" />
          </Box>
        )}
        {errorMsg && (
          <Alert severity="error">{errorMsg}</Alert>
        )}
        {pagination}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            {data && data.data.map((item, idx) => (
              <Grid key={idx} xs={3} item>
                <Card>
                  <img src={item.image} alt={item.name} title={item.name} />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      {item.name}
                    </Typography>
                  </CardContent>
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

export default withStyles(useStyles, { withTheme: true })(Characters);
