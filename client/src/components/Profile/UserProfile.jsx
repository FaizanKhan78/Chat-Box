import {
  faBoxesStacked,
  faFile,
  faFilm,
  faPhotoFilm,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import {
  Avatar,
  Badge,
  Box,
  Container,
  Grid,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import IconBg from "../shared/Paper"; // Assuming IconBg is in the shared folder
import { useSelector } from "react-redux";

const UserProfile = () => {
  let videoCount = 0;
  let imageCount = 0;
  let audioCount = 0;
  const friendDetails = useSelector((state) => state.friendProfile);
  friendDetails.attachments.map((url) => {
    const type = url?.split(".")[3];
    if (type === "mp4") {
      videoCount++;
    } else if (type === "jpg") {
      imageCount++;
    } else if (type === "audio") {
      audioCount++;
    }
  });

  return (
    <Container
      component={"section"}
      sx={{
        display: "flex",
        height: "100%",
        flexDirection: "column",
        justifyContent: "start",
        alignItems: "center",
        gap: "15px",
      }}>
      <Tooltip title="Profile Photo">
        <Avatar
          alt={friendDetails.name}
          src={
            friendDetails.avatar
              ? friendDetails.avatar
              : "https://i.pinimg.com/564x/23/85/0c/23850cbe2a878e76896ec12a822239eb.jpg"
          }
          sx={{ width: "150px", height: "150px", objectFit: "cover" }}
        />
      </Tooltip>

      <Tooltip title="Title">
        <Typography
          sx={{
            fontSize: "22px",
            fontFamily: "hack",
            letterSpacing: "-1px",
            cursor: "pointer",
          }}>
          {friendDetails.name}
        </Typography>
      </Tooltip>

      <Tooltip title="Bio">
        <Typography
          sx={{
            fontFamily: "hack",
            letterSpacing: "-1px",
            cursor: "pointer",
          }}>
          {friendDetails.bio}
        </Typography>
      </Tooltip>

      {friendDetails?.groupChat && (
        <Tooltip title="Members">
          <Typography
            sx={{
              fontFamily: "hack",
              letterSpacing: "-1px",
              cursor: "pointer",
            }}>
            {friendDetails?.members?.length + " Members"}
          </Typography>
        </Tooltip>
      )}

      <Grid container spacing={2}>
        <Grid item xs={6} height="100px">
          <Badge
            color="secondary"
            overlap="circular"
            badgeContent=" "
            variant="dot">
            <Paper
              elevation={3}
              sx={{
                display: "flex",
                alignItems: "center",
                height: "100%",
                padding: "6px",
                cursor: "pointer",
                gap: "10px",
                background: "text.bgColor",
                paddingTop: "14px",
              }}>
              <FolderRoundedIcon />
              <Box sx={{ textAlign: "center" }}>
                All Files
                <Typography>{friendDetails.attachments?.length}</Typography>
              </Box>
            </Paper>
          </Badge>
        </Grid>

        <Grid item xs={6} height="100px">
          <Badge
            color="success"
            overlap="circular"
            badgeContent=" "
            variant="dot">
            <Paper
              sx={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                height: "100%",
                padding: "6px",
                cursor: "pointer",
                paddingTop: "14px",
                background: "text.bgColor",
              }}
              elevation={3}>
              <LinkRoundedIcon />
              <Box sx={{ textAlign: "center" }}>
                All Links
                <Typography>10</Typography>
              </Box>
            </Paper>
          </Badge>
        </Grid>
      </Grid>

      {/* <Stack width="100%" height="100%" gap={ 3 } sx={ { backgroundColor: "lightgray", borderRadius: "10px" } } padding={ 2 }> */}

      <IconBg
        icon={<FontAwesomeIcon icon={faFile} color="#5b36b7" />}
        bgColor="#D1E9F6"
        name={"Document"}
      />
      <IconBg
        icon={<FontAwesomeIcon icon={faPhotoFilm} color="#1ca801" />}
        count={imageCount}
        bgColor="#f2c55d"
        name={"Photos"}
      />
      <IconBg
        icon={<FontAwesomeIcon icon={faFilm} color="#fefefe" />}
        count={videoCount}
        bgColor="#7fd1fd"
        name={"Videos"}
      />
      <IconBg
        icon={<FontAwesomeIcon icon={faBoxesStacked} color="#ffffff" />}
        count={audioCount}
        bgColor="#d38b48"
        name={"Other"}
      />
      {/* </Stack> */}
    </Container>
  );
};

export default UserProfile;
