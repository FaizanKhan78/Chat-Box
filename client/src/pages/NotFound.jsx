import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" style={{ textAlign: "center", padding: "40px" }}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh">
        <ErrorOutlineIcon style={{ fontSize: 80, color: "#f44336" }} />
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          404 - Page Not Found
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Oops! The page you&apos;re looking for doesn&apos;t exist.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate("/")}
          sx={{
            marginTop: "20px",
            fontSize: "20px",
            fontWeight: "600",
            fontFamily: "Gilroy",
            letterSpacing: "1.5px",
          }}>
          Go to Homepage
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
