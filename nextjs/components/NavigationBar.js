import * as React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import useBearStore from "@/store/useBearStore";
import UserDisplay from "./UserDisplay";

const NavigationLayout = ({ children }) => {
  const router = useRouter();
  const appName = useBearStore((state) => state.appName);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleAuthClick = () => {
    if (user) {
      // Handle logout
      localStorage.removeItem('user');
      setUser(null);
      router.push('/signin');
    } else {
      router.push("/register");
    }
  };

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: "#d6e7f9" }}>
        <Toolbar>
          <Link href={"/"}>
            <img src={'https://i.postimg.cc/x13gF3Dk/prodogo2.png'} alt="Logo" width="30" height="30"/>
          </Link>
          
          <Typography
            variant="body1"
            sx={{
              fontSize: "22px",
              fontWeight: 500,
              color: "#053871",
              padding: "0 10px",
              fontFamily: "Prompt",
            }}>
            {appName}
          </Typography> 

          <NavigationLink href="/products" label="Products" />
          <NavigationLink href="/search" label="Search" />
          <NavigationLink href="/dashboard" label="Dashboard" />
          <div style={{ flexGrow: 1 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <UserDisplay />
            <Button
              color="inherit"
              onClick={handleAuthClick}
              startIcon={user ? <LogoutIcon sx={{ color: "#053871" }} /> : <PersonOutlineIcon sx={{ color: "#053871" }} />}
              sx={{ color: "#053871" }} 
            >
              {user ? "Logout" : "Sign In"}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <main>{children}</main>
    </>
  );
};

const NavigationLink = ({ href, label }) => {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <Typography
        variant="body1"
        sx={{
          fontSize: "16px",
          fontWeight: 500,
          color: "#053871",
          padding: "0 10px",
        }}>
        {label}
      </Typography>
    </Link>
  );
};

export default NavigationLayout;