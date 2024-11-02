import { useState } from "react";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import EditProfileModal from "../shared/EditProfileModal";

const PersonalDetails = ({ user }) => {
  const [open, setOpen] = useState(false);

  const email = user?.email; // Ensure that user.email is defined

  // Check if email exists and contains an "@" symbol
  if (email && email.includes("@")) {
    // Get the part of the email before the "@" symbol
    var beforeAt = email.slice(0, email.indexOf("@"));
  }

  return (
    <Container
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "15px",
        padding: "30px",
        display: "flex",
        flexDirection: "column",
        gap: "30px",
        backgroundColor: "background.paper",
      }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={{ xs: 2, sm: 0 }}>
        <div>
          <Typography
            sx={{
              fontWeight: "bold",
              fontFamily: "Gilroy",
              fontSize: { xs: "24px", sm: "28px", md: "34px" },
            }}>
            Personal Info
          </Typography>
          {user.appAdmin && (
            <Chip
              size="medium"
              variant="filled"
              color="success"
              label="App Admin"
              sx={{
                fontWeight: "bold",
                fontFamily: "Gilroy",
                marginTop: { xs: 1, sm: 0 },
              }}
            />
          )}
        </div>

        <Button
          onClick={() => setOpen(true)}
          variant="outlined"
          sx={{
            borderColor: "text.secondary",
            color: "text.primary",
            width: "120px",
            height: "40px",
            borderRadius: "10px",
            padding: "5px",
            textTransform: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
          <FontAwesomeIcon icon={faPenToSquare} fontSize="18px" />
          <Typography>Edit</Typography>
        </Button>
      </Stack>

      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <Typography
            sx={{
              fontSize: "18px",
              fontFamily: "Gilroy",
              color: "text.secondary",
            }}>
            Full Name
          </Typography>
          <Typography
            sx={{
              fontSize: "24px",
              fontFamily: "Gilroy",
              fontWeight: "medium",
            }}>
            {user?.name}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            sx={{
              fontSize: "18px",
              fontFamily: "Gilroy",
              color: "text.secondary",
            }}>
            Bio
          </Typography>
          <Typography
            sx={{
              fontSize: "24px",
              fontFamily: "Gilroy",
              fontWeight: "medium",
            }}>
            {user?.bio}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            sx={{
              fontSize: "18px",
              fontFamily: "Gilroy",
              color: "text.secondary",
            }}>
            Email
          </Typography>
          <Typography
            sx={{
              fontSize: "24px",
              fontFamily: "Gilroy",
              fontWeight: "medium",
            }}>
            {beforeAt}...
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            sx={{
              fontSize: "18px",
              fontFamily: "Gilroy",
              color: "text.secondary",
            }}>
            Phone
          </Typography>
          <Typography
            sx={{
              fontSize: "24px",
              fontFamily: "Gilroy",
              fontWeight: "medium",
            }}>
            {user?.number}
          </Typography>
        </Grid>
      </Grid>

      <EditProfileModal open={open} setOpen={setOpen} />
    </Container>
  );
};

export default PersonalDetails;
