import { Box, Drawer, Grid, IconButton, Skeleton } from "@mui/material";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import AdminSideBarSkeleton from "./AdminSideBarSkeleton.jsx";

const AdminSkeleton = () => {
  const [isMobile, setIsMobile] = useState(false);

  const handleMobile = () => {
    setIsMobile(!isMobile);
  };

  return (
    <>
      <Grid container minHeight={"100vh"}>
        <Box
          sx={{
            display: { xs: "block", md: "none" },
            position: "fixed",
            zIndex: 9999,
            backgroundColor: "black",
            width: "38px",
            borderRadius: "5px",
            right: "1rem",
            top: "1rem",
          }}>
          <IconButton onClick={handleMobile}>
            <FontAwesomeIcon icon={faBars} />
          </IconButton>
        </Box>

        <Grid item md={4} lg={3} sx={{ display: { xs: "none", md: "block" } }}>
          <AdminSideBarSkeleton />
        </Grid>

        <Grid item xs={12} md={8} lg={9} bgcolor={"background.default"}>
          <Skeleton variant="rectangular" height={"100vh"} />
        </Grid>
      </Grid>
      <Drawer open={isMobile} onClose={handleMobile}>
        <AdminSideBarSkeleton width={"50vw"} />
      </Drawer>
    </>
  );
};

export default AdminSkeleton;
