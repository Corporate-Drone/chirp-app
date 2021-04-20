import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { NavLink, Link } from 'react-router-dom';

import { AuthContext } from '../../context/auth-context';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));


export default function ButtonAppBar() {
    const auth = useContext(AuthContext);
    const history = useHistory();
    const classes = useStyles();

    //logout user & redirect
    const logout = () => {
        auth.logout()
        history.push('/');
    }
    
    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Chirp
          </Typography>
                    <Button component={Link} color="inherit" to="/chirps">
                        Chirps
                    </Button>
                    {!auth.isLoggedIn &&
                        <Button component={Link} to="/auth/login" color="inherit">
                        Login
                        </Button>}
                    {!auth.isLoggedIn &&
                        <Button component={Link} to="/auth/register" color="inherit">
                        Register
                        </Button>}
                        {auth.isLoggedIn &&
                        <Button component={Link} to={auth.username}color="inherit">
                            Profile
                        </Button>}
                    {auth.isLoggedIn &&
                        <Button color="inherit" onClick={logout}>
                            Logout
                        </Button>}
                </Toolbar>
            </AppBar>
        </div>
    );
}