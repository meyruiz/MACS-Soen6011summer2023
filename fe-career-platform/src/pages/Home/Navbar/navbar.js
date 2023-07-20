import { AppBar, Box, IconButton, Link, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import React, { useEffect } from "react";

export default function Navbar() {
  // const [auth, setAuth] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [user, setUser] = React.useState(false);
  const [isEmployer, setIsEmployer] = React.useState(false);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    window.location.href = "/candidate/profile";
  }

  const handleLogout = () => {
    setUser(false);
    setIsEmployer(false);
    localStorage.clear();
    window.location.href = '/'
    window.location.reload();
  }

  const userEmail = () => {
    return localStorage.getItem("userEmail");
  }

  const userRole = () => {
    return localStorage.getItem("userRole");
  }

  useEffect(() => {
    const loggedInUserID = localStorage.getItem("userid");
    const loggedInUserEmail = localStorage.getItem("userEmail");  
    const loggedInUserRole = localStorage.getItem("userRole");
    // console.log('loggedInUser -- ',loggedInUserID);
    // console.log('loggedInUser -- ',loggedInUserEmail);
    // console.log('loggedInUser -- ',loggedInUserRole);
    if (loggedInUserID && loggedInUserEmail && loggedInUserRole) {
      setUser(true);
      if(loggedInUserRole === "Employer"){
        setIsEmployer(true)
      }
    }
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link underline="none"
                  color="inhert"
                  component="button"
                  variant="h4"
                  href="/">CSA</Link>
          </Typography>
          {/* User doesn't login */}
          {!user && (
            <div>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                  href="/login">
                    Login
                </IconButton>
            </div>
          )}
          {isEmployer && (
            <div>
              <IconButton
                size="large"
                // onClick={handleMenu}
                color="inherit"
                href="/employer/jobposting"
              >
                JobPosting
              </IconButton>
            </div>
          )}
          {/* User logined */}
          {user && (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                Hello, {userEmail()} ({userRole()})
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {!isEmployer && 
                  <MenuItem onClick={handleProfile}>Profile</MenuItem> 
                }
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};