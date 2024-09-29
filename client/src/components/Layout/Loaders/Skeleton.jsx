import { Grid } from "@mui/material";
import HeaderLoader from "./HeaderLoader";
import ProfileSkeleton from "./ProfileSkeleton";
import ChatSkeleton from "./ChatSkeleton";
import UserProfileSkeleton from "./UserProfileSkeleton";

const Skeleton = () =>
{
  return (
    <>
      <HeaderLoader />
      <Grid
        container
        height={ "calc(100vh-4rem)" }
      >
        <Grid item sm={ 3 } sx={ {
          display: { xs: "none", sm: "block" }
        } } height={ "100%" } >
          <ProfileSkeleton />
          <ChatSkeleton />
        </Grid>

        <Grid item xs={ 12 } sm={ 9 } md={ 6 } height={ "100%" } >
        </Grid>

        <Grid item sx={ {
          display: { xs: "none", md: "block" }
        } }>
          <UserProfileSkeleton />
        </Grid>
      </Grid>
    </>
  );
};

export default Skeleton;