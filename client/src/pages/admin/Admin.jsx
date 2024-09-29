import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Drawer, Grid, IconButton } from "@mui/material";
import AdminSideBar from "./AdminSideBar";
import { useState } from "react";
import { Outlet } from "react-router-dom"; // Import Outlet to render nested routes

const Admin = () => {
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
            {isMobile ? (
              <FontAwesomeIcon icon={faXmark} />
            ) : (
              <FontAwesomeIcon icon={faBars} />
            )}
          </IconButton>
        </Box>

        <Grid item md={4} lg={3} sx={{ display: { xs: "none", md: "block" } }}>
          <AdminSideBar />
        </Grid>

        <Grid item xs={12} md={8} lg={9} bgcolor={"background.admin"}>
          <Outlet />
        </Grid>
      </Grid>
      {/* https://mui.com/toolpad/core/react-dashboard-layout/ add this layout to admin dashboard */}
      <Drawer open={isMobile} onClose={handleMobile}>
        <AdminSideBar width={"50vw"} />
      </Drawer>
    </>
  );
};

export default Admin;
