import {
  Skeleton,
  Stack,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const AdminSideBarSkeleton = ({ width = "100vw" }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Stack
      width={width}
      direction={"column"}
      p={isSmallScreen ? "1rem" : "2rem"}
      spacing={"2rem"}
      sx={{
        backgroundColor: "background.paper",
        height: "100%",
        color: "text.primary",
      }}>
      <Typography variant="h5" color="primary.main">
        <Skeleton width="20%" />
      </Typography>
      <Divider sx={{ backgroundColor: "divider" }} />
      <Stack spacing={"1rem"}>
        {[...Array(5)].map((_, index) => (
          <Stack
            key={index}
            direction={"row"}
            alignItems={"center"}
            spacing={"1rem"}
            padding={".75rem"}
            sx={{
              width: { xs: "100%", md: "calc(100vw - 79vw)" },
              borderRadius: "50px",
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "light"
                    ? theme.palette.action.hover
                    : theme.palette.action.selected,
                borderRadius: "50px",
                transform: "scale(1.05)",
              },
            }}>
            <Skeleton
              variant="circular"
              width={40}
              height={40}
              sx={{ fontSize: "1.6rem" }}
            />
            <Skeleton width="60%" height={30} />
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export default AdminSideBarSkeleton;
