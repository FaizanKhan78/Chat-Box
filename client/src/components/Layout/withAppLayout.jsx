import { Grid } from "@mui/material";
import Title from "../shared/Title";
import Header from "./Header";
import Chat from "../Chats/Chat";
import Profile from "../Profile/Profile";
import UserProfile from "../Profile/UserProfile";
import { useLocation } from "react-router-dom";
import { useTheme } from "@emotion/react";

const withAppLayout = (WrapComponent) => {
  return function WithAppLayoutComponent(props) {
    const location = useLocation();
    const theme = useTheme();
    return (
      <>
        <Title />
        <Header />
        <Grid container height={"calc(100vh-4rem)"}>
          <Grid
            item
            sm={3}
            sx={{
              display: { xs: "none", sm: "block" },
            }}
            height={"100%"}>
            <Profile />
            <Chat />
          </Grid>

          <Grid
            item
            xs={12}
            sm={9}
            md={location.pathname === "/setting" ? 9 : 6}
            height={"calc(100vh-4rem)"}
            sx={{
              boxSizing: "border-box",
              padding: "1rem",
              bgcolor: "text.bgColor",
              overflowX: "hidden",
              overflowY: "auto",
              borderRadius: "10px",
              height: { xs: "89vh" },
              backgroundColor: theme.palette.mode
                ? "background.admin"
                : "background.main",
            }}>
            {<WrapComponent {...props} />}
          </Grid>

          <Grid
            item
            sx={{
              display: {
                xs: "none",
                md: location.pathname === "/setting" ? "none" : "block",
              },
              flexGrow: 1,
            }}
            md={location.pathname === "/setting" ? 0 : 3}>
            <UserProfile />
          </Grid>
        </Grid>
      </>
    );
  };
};

export default withAppLayout;
