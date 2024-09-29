import { Grid, IconButton, Paper, Skeleton, } from "@mui/material";

const ChatSkeleton = () =>
{
  return (
    <div style={ { padding: "10px 20px 0px 20px" } }>
      <Skeleton variant="rectangular" width="100%" height={ 40 } sx={ { borderRadius: "15px", marginBottom: "1rem" } } animation="wave" />

      <Grid container sx={ { alignItems: "center", marginTop: "1rem" } }>
        <Grid item xs={ 6 }>
          <Skeleton width="50%" height={ 30 } animation="wave" />
        </Grid>

        <Grid item xs={ 2 }>
          <IconButton>
            <Skeleton variant="circular" width={ 40 } height={ 40 } animation="wave" />
          </IconButton>
        </Grid>

        <Grid item xs={ 2 }>
          <Paper sx={ { width: "fit-content", borderRadius: "50%", backgroundColor: "#e5e5e5" } } elevation={ 4 }>
            <IconButton>
              <Skeleton variant="circular" width={ 40 } height={ 40 } animation="wave" />
            </IconButton>
          </Paper>
        </Grid>

        <Grid item xs={ 2 }>
          <IconButton>
            <Skeleton variant="circular" width={ 40 } height={ 40 } animation="wave" />
          </IconButton>
        </Grid>
      </Grid>

      {/* Simulate Chat List Loading */ }
      <div style={ { marginTop: "2rem" } }>
        { [ ...Array( 5 ) ].map( ( _, index ) => (
          <Skeleton key={ index } variant="rectangular" width="100%" height={ 60 } sx={ { marginBottom: "1rem", borderRadius: "10px" } } animation="wave" />
        ) ) }
      </div>
    </div>
  );
};

export default ChatSkeleton;
