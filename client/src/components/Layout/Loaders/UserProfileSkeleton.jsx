import { Container, Grid, Skeleton, } from "@mui/material";

const UserProfileSkeleton = () =>
{
  return (
    <Container component={ "section" } sx={ {
      display: "flex",
      height: "100%",
      flexDirection: "column",
      justifyContent: "start",
      alignItems: "center",
      gap: "20px"
    } }>
      <Skeleton variant="circular" width={ 150 } height={ 150 } animation="wave" />

      <Skeleton variant="text" width={ 180 } height={ 30 } animation="wave" />

      <Skeleton variant="text" width={ 100 } height={ 20 } animation="wave" />

      <Grid container spacing={ 2 }>
        <Grid item xs={ 6 } height="100px">
          <Skeleton variant="rounded" height={ 100 } width={ 100 } animation="wave" />
        </Grid>
        <Grid item xs={ 6 } height="100px">
          <Skeleton variant="rounded" height={ 100 } width={ 100 } animation="wave" />
        </Grid>
      </Grid>

      <Skeleton variant="rounded" width="100%" height={ 60 } animation="wave" />
      <Skeleton variant="rounded" width="100%" height={ 60 } animation="wave" />
      <Skeleton variant="rounded" width="100%" height={ 60 } animation="wave" />
      <Skeleton variant="rounded" width="100%" height={ 60 } animation="wave" />
    </Container>
  );
};

export default UserProfileSkeleton;
