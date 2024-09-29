import { Box, Container, IconButton, Paper, Typography, Skeleton } from "@mui/material";
import SettingsSharpIcon from '@mui/icons-material/SettingsSharp';

const ProfileSkeleton = () =>
{
  return (
    <div style={ { padding: "0 10px" } }>
      <Container component={ "section" } sx={ {
        display: "flex",
        alignItems: "start",
        justifyContent: "space-between"
      } }>
        <Paper sx={ {
          width: { md: "100px" },
          height: { md: "100px" },
          borderRadius: "50%"
        } } elevation={ 4 }>
          <Skeleton
            variant="circular"
            width={ 100 }
            height={ 100 }
          />
        </Paper>
        <IconButton>
          <Skeleton variant="circular" animation="wave">
            <SettingsSharpIcon />
          </Skeleton>
        </IconButton>
      </Container>

      <Typography
        sx={ {
          marginTop: "20px",
        } }
      >
        <Skeleton width="60%" animation="wave" />
      </Typography>

      <Box sx={ { width: "full", display: "flex", justifyContent: "center", marginTop: "1rem" } }>
        <Skeleton variant="rectangular" width={ 150 } height={ 40 } animation="wave" />
      </Box>
    </div>
  );
};

export default ProfileSkeleton;
