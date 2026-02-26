
import React, { useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import UserContext from "../utils/UserContext";

export default function Header() {
  const navigate = useNavigate();
  const {loggedInUser, setIsLogin} = useContext(UserContext);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            MyRepo
          </Typography>
         
          <Button
            onClick={() => {
              loggedInUser === false && navigate("/login")
            }}
            color="inherit"
          >
            DashBoard
          </Button>
          {loggedInUser === false &&  <Button
            onClick={() => {
              navigate("/signup");
            }}
            color="inherit"
          >
            SignUp
          </Button>}
         
          {loggedInUser ? (
            <Button
              onClick={() => {
                setIsLogin(false);
                navigate("/");
                toast.success("Logged Out Successfully")
              }}
              color="inherit"
            >
              Logout
            </Button>
          ) : (
            <Button
              onClick={() => {
                navigate("/login");
              }}
              color="inherit"
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
