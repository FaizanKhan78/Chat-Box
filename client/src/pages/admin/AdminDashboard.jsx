import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faRocket } from "@fortawesome/free-solid-svg-icons"; // Corrected icon and import path
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import { Container, Grid } from "@mui/material";
import CircularChart from "../../components/specific/charts/CircularChart";
import LineChart from "../../components/specific/charts/LineChart";
import Widgets from "./Widgets";
const AdminDashboard = () => {
  return (
    <>
      <Container>
        <LineChart value={[0, 12, 14, 16, 19, 220, 300]} />
        <Grid
          container
          justifyContent={"space-between"}
          alignItems={"center"}
          sx={{ gap: { xs: "20px", md: "0px" } }}>
          <Grid item>
            <CircularChart value={[20, 30]} />
          </Grid>
          <Grid item>
            <Widgets
              data={5}
              logo={<FontAwesomeIcon icon={faUser} />}
              text={"Users"}
              bgColor="#FF6F61"
            />
          </Grid>
          <Grid item>
            <Widgets
              data={150}
              logo={<FontAwesomeIcon icon={faRocket} />}
              text={"Chats"}
              bgColor="#FFBF00"
            />
          </Grid>
          <Grid item>
            <Widgets
              data={15}
              logo={<ForumRoundedIcon />}
              text={"Messages"}
              bgColor="#4B0082"
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default AdminDashboard;
