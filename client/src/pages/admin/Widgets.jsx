import { Box, Grid, Paper } from "@mui/material";
const Widgets = ({ data, logo, text, bgColor }) => {
  return (
    <>
      <Grid item>
        <Paper
          sx={{
            padding: "30px",
            textAlign: "center",
            backgroundColor: bgColor,
          }}>
          <Box
            component={"div"}
            padding={"20px"}
            sx={{
              border: "2px solid black",
              borderRadius: "50%",
              height: "100px",
              width: "100px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
            {data}
          </Box>
          <Box
            sx={{
              display: "flex",
              marginTop: "10px",
              flexDirection: "column",
              alignItems: "center",
            }}>
            {logo}
            {text}
          </Box>
        </Paper>
      </Grid>
    </>
  );
};

export default Widgets;
