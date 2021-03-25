import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { NavLink } from 'react-router-dom';

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
    const classes = useStyles();

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
                    {/* <Button color="inherit">Login</Button>
                    <Button color="inherit">Register</Button> */}
                    <Button color="inherit">
                        <NavLink to="/chirps">Chirps</NavLink>
                    </Button>
                    {!auth.isLoggedIn &&
                        <Button color="inherit">
                            <NavLink to="/auth/login">Login</NavLink>
                        </Button>}
                    {!auth.isLoggedIn &&
                        <Button color="inherit">
                            <NavLink to="/auth/register">Register</NavLink>
                        </Button>}
                    {auth.isLoggedIn &&
                        <Button color="inherit" onClick={auth.logout}>
                            Logout
                        </Button>}
                </Toolbar>
            </AppBar>
        </div>
    );
}