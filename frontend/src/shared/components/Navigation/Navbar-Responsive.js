import {
    AppBar,
    Toolbar,
    Typography,
    makeStyles,
    Button,
    IconButton,
    Drawer,

    MenuItem,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";

import { AuthContext } from '../../context/auth-context';

let headersData = [];

const useStyles = makeStyles(() => ({
    header: {
        backgroundColor: "#400CCC",
        paddingRight: "79px",
        paddingLeft: "118px",
        "@media (max-width: 900px)": {
            paddingLeft: 0,
        },
    },
    logo: {
        fontFamily: "Work Sans, sans-serif",
        fontWeight: 600,
        color: "#FFFEFE",
        textAlign: "left",
    },
    menuButton: {
        fontFamily: "Open Sans, sans-serif",
        fontWeight: 700,
        size: "18px",
        marginLeft: "38px",
    },
    toolbar: {
        display: "flex",
        justifyContent: "space-between",
    },
    drawerContainer: {
        padding: "20px 30px",
    },
}));

export default function Header() {
    const auth = useContext(AuthContext);
    const history = useHistory();
    const { header, logo, menuButton, toolbar, drawerContainer } = useStyles();

    const handleDrawerOpen = () =>
    setState((prevState) => ({ ...prevState, drawerOpen: true }));

    const handleDrawerClose = () =>
        setState((prevState) => ({ ...prevState, drawerOpen: false }));

    //logout user & redirect
    const logout = () => {
        if (drawerOpen) {
            handleDrawerClose()
        }
        auth.logout()
        history.push('/');
    }

    const toProfile = () => {
        if (drawerOpen) {
            handleDrawerClose()
        }
        history.push(`/${auth.username}`)
    }


    const [state, setState] = useState({
        mobileView: false,
        drawerOpen: false,
    });

    const { mobileView, drawerOpen } = state;

    useEffect(() => {
        const setResponsiveness = () => {
            return window.innerWidth < 900
                ? setState((prevState) => ({ ...prevState, mobileView: true }))
                : setState((prevState) => ({ ...prevState, mobileView: false }));
        };

        setResponsiveness();

        window.addEventListener("resize", () => setResponsiveness());
    }, []);

    const displayDesktop = () => {
        return (
            <Toolbar className={toolbar}>
                {chirpLogo}
                <div>
                    {auth.isLoggedIn && <Button component={Link} color="inherit" to="/chirps" onClick={handleDrawerClose}>
                        Chirps
                    </Button>}
                    {!auth.isLoggedIn &&
                        <Button component={Link} to="/auth/login" color="inherit">
                            Login
                        </Button>}
                    {!auth.isLoggedIn &&
                        <Button component={Link} to="/auth/register" color="inherit">
                            Register
                        </Button>}
                    {auth.isLoggedIn &&
                        <Button component={Link} onClick={toProfile} color="inherit">
                            Profile
                        </Button>}
                    {auth.isLoggedIn &&
                        <Button color="inherit" onClick={logout}>
                            Logout
                        </Button>}</div>
            </Toolbar>
        );
    };

    const displayMobile = () => {
        return (
            <Toolbar>
                <IconButton
                    {...{
                        edge: "start",
                        color: "inherit",
                        "aria-label": "menu",
                        "aria-haspopup": "true",
                        onClick: handleDrawerOpen,
                    }}
                >
                    <MenuIcon />
                </IconButton>

                <Drawer
                    {...{
                        anchor: "left",
                        open: drawerOpen,
                        onClose: handleDrawerClose,
                    }}
                >
                    <div className={drawerContainer}>

                        {auth.isLoggedIn && <Button component={Link} color="inherit" to="/chirps" onClick={handleDrawerClose}>
                            Chirps
                    </Button>}
                        {!auth.isLoggedIn &&
                            <Button component={Link} to="/auth/login" color="inherit" onClick={handleDrawerClose}>
                                Login
                        </Button>}
                        {!auth.isLoggedIn &&
                            <Button component={Link} to="/auth/register" color="inherit" onClick={handleDrawerClose}>
                                Register
                        </Button>}
                        {auth.isLoggedIn &&
                            <Button component={Link} onClick={toProfile} color="inherit">
                                Profile
                        </Button>}
                        {auth.isLoggedIn &&
                            <Button color="inherit" onClick={logout}>
                                Logout
                        </Button>}</div>
                </Drawer>

                <div>{chirpLogo}</div>
            </Toolbar>
        );
    };

    const chirpLogo = (
        <Typography variant="h6" component="h1" className={logo}>
            Chirp
        </Typography>
    );

    return (
        <header>
            <AppBar className={header}>
                {mobileView ? displayMobile() : displayDesktop()}
            </AppBar>
        </header>
    );
}