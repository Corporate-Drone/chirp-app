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
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';
import PeopleIcon from '@material-ui/icons/People';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import "./Navbar-Responsive.css";

import { AuthContext } from '../../context/auth-context';

const useStyles = makeStyles(() => ({
    header: {
        backgroundColor: "#1DA1F2",
        position: "static",
        "@media (max-width: 900px)": {
            paddingLeft: 0,
        },
    },
    logo: {
        // fontFamily: "Work Sans, sans-serif",
        fontWeight: 600,
        color: "#FFF",
        textAlign: "left",
    },
    // menuButton: {
    //     fontFamily: "Open Sans, sans-serif",
    //     fontWeight: 700,
    //     size: "18px",
    //     marginLeft: "38px",
    // },
    toolbar: {
        display: "flex",
        justifyContent: "space-between",
    },
    drawerContainer: {
        display: "flex",
        flexDirection: "column",
        padding: "20px 50px",
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
                        <HomeIcon />
                    </Button>}
                    {!auth.isLoggedIn &&
                        <Button component={Link} to="/auth/login" color="inherit" style={{ fontFamily: 'Segoe UI' }}>
                            Login
                        </Button>}
                    {!auth.isLoggedIn &&
                        <Button component={Link} to="/auth/register" color="inherit" style={{ fontFamily: 'Segoe UI' }}>
                            Register
                        </Button>}
                    {auth.isLoggedIn &&
                        <Button component={Link} to={`/${auth.username}`} onClick={toProfile} color="inherit">
                            <PersonIcon />
                        </Button>}
                    {auth.isLoggedIn &&
                        <Button component={Link} to="/users" color="inherit">
                            <PeopleIcon />
                        </Button>}
                    {auth.isLoggedIn &&
                        <Button color="inherit" onClick={logout}>
                            <ExitToAppIcon />
                        </Button>}</div>
            </Toolbar>
        );
    };

    const displayMobile = () => {
        return (
            <Toolbar>
                <Drawer
                    {...{
                        anchor: "left",
                        open: drawerOpen,
                        onClose: handleDrawerClose,
                    }}
                >
                    <div className={drawerContainer}>

                        {auth.isLoggedIn && <Button component={Link} color="inherit" to="/chirps" onClick={handleDrawerClose} style={{ fontFamily: 'Segoe UI' }}>
                            Chirps
                    </Button>}
                        {!auth.isLoggedIn &&
                            <Button component={Link} to="/auth/login" color="inherit" onClick={handleDrawerClose} style={{ fontFamily: 'Segoe UI' }}>
                                Login
                        </Button>}
                        {!auth.isLoggedIn &&
                            <Button component={Link} to="/auth/register" color="inherit" onClick={handleDrawerClose} style={{ fontFamily: 'Segoe UI' }}>
                                Register
                        </Button>}
                        {auth.isLoggedIn &&
                            <Button component={Link} to={`/${auth.username}`} onClick={toProfile} color="inherit" style={{ fontFamily: 'Segoe UI' }}>
                                Profile
                        </Button>}
                        {auth.isLoggedIn &&
                            <Button component={Link} to="/users" color="inherit" onClick={handleDrawerClose} style={{ fontFamily: 'Segoe UI' }}>
                                Users
                        </Button>}
                        {auth.isLoggedIn &&
                            <Button color="inherit" onClick={logout} style={{ fontFamily: 'Segoe UI' }}>
                                Logout
                        </Button>}</div>
                </Drawer>

                <div className="hamburger">
                    <div className="hamburger-logo">{chirpLogo}</div>
                    <IconButton
                        {...{
                            color: "inherit",
                            "aria-label": "menu",
                            "aria-haspopup": "true",
                            onClick: handleDrawerOpen,
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                </div>

            </Toolbar>
        );
    };

    const chirpLogo = (
        <Typography variant="h6" component="h1" className={logo}>
            <Link to={"/chirps"} className="logo-name">
                Chirp
            </Link>

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