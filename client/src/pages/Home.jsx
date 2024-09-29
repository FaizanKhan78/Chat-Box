import { Container } from "@mui/material";
import NotSelected from "../components/shared/NotSelected";

const Home = () => {
  return (
    <>
      <Container
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <NotSelected message={"No Chat Selected"} />
      </Container>
    </>
  );
};

export default Home;
