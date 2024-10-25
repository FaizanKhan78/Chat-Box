import { useState } from "react";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Chip, Container, Stack, Typography } from "@mui/material";
import EditProfileModal from "../shared/EditProfileModal";
const PersonalDetails = ({ user }) => {
  const [open, setOpen] = useState(false);

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
        justifyContent={"space-between"}
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={{ xs: 2, sm: 0 }}>
        <div>
          <Typography
            sx={{
              fontWeight: "bold",
              fontFamily: "Gilroy",
              fontSize: { xs: "28px", sm: "34px" },
            }}>
            Personal Info
          </Typography>
          {user.appAdmin && (
            <Chip
              size="medium" // Use "small" or "medium"
              variant="filled" // Use "filled" or "outlined"
              color="success" // Use "error" for red color (danger equivalent)
              label="App Admin" // Added label prop for text inside the Chip
              sx={{
                fontWeight: "bold",
                fontFamily: "Gilroy",
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

      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems="flex-start"
        spacing={{ xs: 4, sm: 2 }}>
        <Box>
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
        </Box>
        <Box>
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
        </Box>
        <Box>
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
            {user?.email}
          </Typography>
        </Box>
        <Box>
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
        </Box>
      </Stack>

      <EditProfileModal open={open} setOpen={setOpen} />
    </Container>
  );
};

export default PersonalDetails;
