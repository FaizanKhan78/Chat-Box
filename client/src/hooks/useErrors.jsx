import { useEffect } from "react";
import toast from "react-hot-toast";
import { getToastConfig } from "../lib/features";
import { useTheme } from "@emotion/react";
import { useNavigate } from "react-router-dom";

const useErrors = (errors = []) => {
  const theme = useTheme();
  const navigate = useNavigate();
  useEffect(() => {
    errors.forEach(({ isError, error, fallback }) => {
      if (isError) {
        if (fallback) {
          fallback();
        } else {
          if (error === "Only Admin Can access this route") {
            toast.error(error || "Something went wrong", getToastConfig(theme));
            navigate("/setting");
            return;
          }
          toast.error(
            error?.data?.message || "Something went wrong",
            getToastConfig(theme)
          );
        }
      }
    });
  }, [errors, theme]);
};

export default useErrors;
