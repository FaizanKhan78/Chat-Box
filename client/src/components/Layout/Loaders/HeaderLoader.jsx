import { Box, Grid, Skeleton } from "@mui/material";

const HeaderLoader = () =>
{
  return (
    <>
      <Grid container sx={ { padding: "1rem", alignItems: "center", gap: "10px" } }>
        <Grid item sm={ 3 } sx={ {
          display: {
            xs: "none", sm: "block",
          },
        } }>
          <Skeleton variant="rectangle" animation="wave" />
        </Grid>


        <Grid item xs={ 6 } sm={ 9 } md={ 6 }>
          <Box sx={ {
            display: { xs: "block", sm: "none" },
          } }>
            <Skeleton variant="circle" animation="wave" />
          </Box>

          <Box sx={ {
            display: { xs: "none", sm: "block" },
          } }>
            <Skeleton variant="rectangle" animation="wave" />
          </Box>
        </Grid>

        <Grid item sx={ {
          display: { xs: "none", md: "block" },
          flexGrow: 1, // Allow the third Grid item to take up remaining space
        } }>
          <Skeleton variant="rectangle" animation="wave" />
        </Grid>
      </Grid>
    </>
  );
};

export default HeaderLoader;