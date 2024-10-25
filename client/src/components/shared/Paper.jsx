import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Paper, Typography, Container, Tooltip } from "@mui/material";

const IconBg = ({ icon, bgColor = "blue", name, count }) => {
  console.log(count);
  return (
    <>
      <Tooltip title={name} placement="right">
        <Container
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            cursor: "pointer",
            borderRadius: "5px",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,.1)",
            },
          }}>
          <Paper
            elevation={0}
            sx={{
              padding: "5px 10px",
              borderRadius: "5px",
              backgroundColor: bgColor,
            }}>
            {icon}
          </Paper>

          <Box
            component={"strong"}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}>
            {name}
            <Box>
              <Typography>{count} files</Typography>
            </Box>
          </Box>
          <FontAwesomeIcon icon={faArrowRight} />
        </Container>
      </Tooltip>
    </>
  );
};

export default IconBg;
