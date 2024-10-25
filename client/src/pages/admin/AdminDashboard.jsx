import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faRocket } from "@fortawesome/free-solid-svg-icons"; // Corrected icon and import path
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import { Container, Grid, Skeleton } from "@mui/material";
import CircularChart from "../../components/specific/charts/CircularChart";
import LineChart from "../../components/specific/charts/LineChart";
import Widgets from "./Widgets";
import { useFetchData } from "6pp";
import { server } from "./../../constants/config";
import useErrors from "./../../hooks/useErrors";
import { useEffect } from "react";
const AdminDashboard = () => {
  const { data, loading, error, refetch } = useFetchData(
    `${server}/api/v1/admin/stats`,
    "dashboard-stats"
  );

  useEffect(() => {
    refetch();
  }, []);
  const { stats } = data || {};

  useErrors([{ isError: error, error }]);
  return loading ? (
    <Container>
      <Skeleton sx={{ marginTop: "0px", height: "500px" }} />
      <Grid
        container
        justifyContent={"space-between"}
        alignItems={"center"}
        sx={{ gap: { xs: "20px", md: "0px" } }}>
        <Grid item>
          <Skeleton variant="circular" width={400} height={400} />
        </Grid>
        <Grid item>
          <Skeleton height={350} width={150} />
        </Grid>
        <Grid item>
          <Skeleton height={350} width={150} />
        </Grid>
        <Grid item>
          <Skeleton height={350} width={150} />
        </Grid>
      </Grid>
    </Container>
  ) : (
    <>
      <Container>
        <LineChart value={stats?.messagesChart || []} />
        <Grid
          container
          justifyContent={"space-between"}
          alignItems={"center"}
          sx={{ gap: { xs: "20px", md: "0px" } }}>
          <Grid item>
            <CircularChart
              value={[stats?.singleChatCount || 0, stats?.groupChatCount || 0]}
            />
          </Grid>
          <Grid item>
            <Widgets
              data={stats?.userCount || 0}
              logo={<FontAwesomeIcon icon={faUser} />}
              text={"Users"}
              bgColor="#FF6F61"
            />
          </Grid>
          <Grid item>
            <Widgets
              data={stats?.chatCount || 0}
              logo={<FontAwesomeIcon icon={faRocket} />}
              text={"Chats"}
              bgColor="#FFBF00"
            />
          </Grid>
          <Grid item>
            <Widgets
              data={stats?.messageCount || 0}
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
