import { useEffect } from "react";
import toast from "react-hot-toast";
import { getToastConfig } from "../lib/features";
import { useTheme } from "@emotion/react";

const useErrors = (errors = []) => {
  const theme = useTheme();
  useEffect(() => {
    errors.forEach(({ isError, error, fallback }) => {
      if (isError) {
        if (fallback) {
          fallback();
        } else {
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
