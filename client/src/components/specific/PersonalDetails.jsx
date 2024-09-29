import { useState } from "react";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import EditProfileModal from "../shared/EditProfileModal";

const PersonalDetails = () => {
  const [open, setOpen] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "Faizan Khan",
    email: "faizankhan@gmail.com",
    phone: "(+91) 9665228837",
    gender: "male",
    bio: "kjsbdufvjsajvfucjhvuyvjsdyuvj ckhvsajkjvjyskjvjhsvhj v",
  });

  const handleSave = (updatedData) => {
    setPersonalInfo(updatedData);
  };

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
        <Typography
          sx={{
            fontWeight: "bold",
            fontFamily: "Gilroy",
            fontSize: { xs: "28px", sm: "34px" },
          }}>
          Personal Info
        </Typography>

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
            {personalInfo.fullName}
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
            {personalInfo.email}
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
            {personalInfo.phone}
          </Typography>
        </Box>
      </Stack>

      <EditProfileModal
        open={open}
        setOpen={setOpen}
        initialData={personalInfo}
        onSave={handleSave}
      />
    </Container>
  );
};

export default PersonalDetails;
