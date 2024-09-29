import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

const NetflixIntro = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        backgroundColor: "black",
        overflow: "hidden", // Ensures that the text is masked
      }}>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden", // Masking the text reveal
          width: "fit-content",
        }}>
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          style={{ display: "flex", alignItems: "center" }}>
          <Box component={"img"} src="/Chat_box.png" sx={{ width: "250px" }} />

          {/* Animated Text with Color Change */}
          <motion.div
            className="text-animation"
            transition={{ duration: 2, ease: "easeInOut" }}>
            <Typography
              variant="h1"
              sx={{
                fontWeight: "bold",
                fontSize: "4rem",
                whiteSpace: "nowrap", // Ensures the text stays on one line
                fontFamily: "myFont",
              }}>
              Chat Box
            </Typography>
          </motion.div>
        </motion.div>
      </Box>
    </Box>
  );
};

export default NetflixIntro;
