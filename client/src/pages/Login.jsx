import { useTheme } from "@emotion/react";
import { Box, Container, Grid } from "@mui/material";
import { useState } from "react";
import LoginForm from "../components/LoginForm/LoginForm";
import RegistrationForm from "../components/RegistrationForm/RegistrationForm";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);

  const theme = useTheme();

  return (
    <Grid container sx={{ height: "100vh" }}>
      {/* Left side (Form) */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: theme.palette.mode === "dark" ? "black" : "#f5f5f5",
        }}>
        <Container
          component="main"
          sx={{
            color: "text.primary",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 4,
            maxWidth: "100%",
            overflow: "auto",
          }}>
          <Box
            component="img"
            src={theme.palette.mode === "dark" ? "/logo.png" : "/logo2.png"}
            alt="Logo"
            sx={{
              width: { xs: "120px", md: "180px" },
              height: { xs: "120px", md: "180px" },
            }}
          />
          {isLogin ? (
            <>
              <LoginForm setIsLogin={setIsLogin} />
            </>
          ) : (
            <>
              <RegistrationForm setIsLogin={setIsLogin} />
            </>
          )}
        </Container>
      </Grid>

      {/* Right side (Video) */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: { xs: "none", md: "block" },
          position: "relative",
          overflow: "hidden",
        }}>
        <video
          src="/video.mp4"
          autoPlay
          loop
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
      </Grid>
    </Grid>
  );
};

export default Login;
