import { Typography } from "@mui/material";

const NotSelected = ({ message }) => {
  return (
    <>
      <Typography
        sx={{
          fontSize: "55px",
          color: "text.secondary",
          letterSpacing: "-1px",
          backgroundColor: "#0202028a",
          padding: "1rem",
          borderRadius: "15px",
        }}>
        {message}
      </Typography>
    </>
  );
};

export default NotSelected;
