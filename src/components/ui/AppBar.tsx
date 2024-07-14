import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Slide from "@mui/material/Slide";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../../atom/authAtom/userAtom";
import { useNavigate } from "react-router-dom";
import isUserInGameAtom from "../../atom/authAtom/isUserInGameAtom";
import { ThemeProvider } from "@emotion/react";

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
  children: React.ReactElement;
}

function HideOnScroll(props: Props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const navigate = useNavigate();
  const [user, setUser] = useRecoilState(userAtom);
  const isUserInGame = useRecoilValue(isUserInGameAtom);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleLogout = async () => {
    setAnchorElUser(null);
    setUser(null);
  };

  const handlaeNavigateToLogin = () => {
    navigate("/login");
  };
  if (!isUserInGame) {
    return (

        <AppBar
          position="static"
          sx={{
            backgroundColor: "black",
          }}
        >
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Typography
                variant="h6"
                noWrap
                component="button"
                onClick={() => navigate("/")}
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  backgroundColor: "transparent",
                  border: "0",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                Quiztical
              </Typography>

              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>

                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      handleCloseNavMenu();
                      navigate("/home");
                    }}
                  >
                    <Typography textAlign="center">Home</Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleCloseNavMenu();
                      navigate("/create");
                    }}
                  >
                    <Typography textAlign="center">Create Quiz</Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleCloseNavMenu();
                      navigate("/completed");
                    }}
                  >
                    <Typography textAlign="center">Completed</Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleCloseNavMenu();
                      navigate("/created");
                    }}
                  >
                    <Typography textAlign="center">Created</Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleCloseNavMenu();
                      navigate("/aboutus");
                    }}
                  >
                    <Typography textAlign="center">About Us</Typography>
                  </MenuItem>
                </Menu>
              </Box>

              <Typography
                variant="h5"
                noWrap
                component="button"
                onClick={() => navigate("/")}
                sx={{
                  mr: 2,
                  display: { xs: "flex", md: "none" },
                  flexGrow: 1,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                  backgroundColor: "transparent",
                  border: "0",
                  cursor: "pointer",
                }}
              >
                Quiztical
              </Typography>
              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                <Button
                  onClick={() => {
                    handleCloseNavMenu();
                    navigate("/home");
                  }}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  Home
                </Button>

                <Button
                  onClick={() => {
                    handleCloseNavMenu();
                    navigate("/completed");
                  }}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  Completed
                </Button>
                <Button
                  onClick={() => {
                    handleCloseNavMenu();
                    navigate("/created");
                  }}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  Created
                </Button>
                <Button
                  onClick={() => {
                    handleCloseNavMenu();
                    navigate("/aboutus");
                  }}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  About Us
                </Button>
              </Box>

              <Button
                variant="text"
                color="inherit"
                onClick={() => navigate("/create")}
                sx={{ display: { xs: "none", md: "flex" } }}
              >
                Create Quiz
              </Button>
              <Box sx={{ flexGrow: 0, marginLeft: "10px" }}>
                {user ? (
                    <Button
                    onClick={handleLogout}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    Logout
                  </Button>
                ) : (
                  <Button
                    onClick={handlaeNavigateToLogin}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    Login
                  </Button>
                )}
              
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
    );
  } else {
    return <></>;
  }
}
export default ResponsiveAppBar;
