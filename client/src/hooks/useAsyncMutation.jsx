import { useState } from "react";
import toast from "react-hot-toast";
import { getToastConfig } from "../lib/features";
import { useTheme } from "@emotion/react";

const useAsyncMutation = (mutationHook) => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false); // Start with `false` by default
  const [data, setData] = useState(null);
  const [mutate] = mutationHook();

  const executeMutation = async (toastMessage, name, ...args) => {
    setIsLoading(true); // Set loading to true when mutation starts
    const toastId = toast.loading(
      toastMessage || "Updating Data...",
      getToastConfig(theme)
    );

    try {
      const res = await mutate(...args);

      if (res?.data) {
        toast.success(`${res.data.message} successfully added to ${name}`, {
          id: toastId,
          ...getToastConfig(theme),
        });
        setData(res.data);
      } else {
        console.log(res?.error);
        toast.error(res?.error?.data?.message || "An error occurred", {
          id: toastId,
          ...getToastConfig(theme),
        });
      }
    } catch (error) {
      console.error("Error in mutation:", error); // Better error logging
      toast.error("An unexpected error occurred.", {
        id: toastId,
        ...getToastConfig(theme),
      });
    } finally {
      setIsLoading(false); // Ensure `isLoading` is set to false no matter what
    }
  };

  return [executeMutation, isLoading, data];
};

export default useAsyncMutation;
