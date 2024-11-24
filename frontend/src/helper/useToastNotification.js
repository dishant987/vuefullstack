import { useToast } from "vue-toast-notification";

export function useToastNotification() {
  const toast = useToast();

  const showSuccessToast = (message) => {
    toast.success(message, { position: "top-right" });
  };

  const showErrorToast = (message) => {
    toast.error(message, { position: "top-right" });
  };

  const showWarningToast = (message) => {
    toast.warning(message, { position: "top-right" });
  };

  const showInfoToast = (message) => {
    toast.info(message, { position: "top-right" });
  };

  return {
    showSuccessToast,
    showErrorToast,
    showWarningToast,
    showInfoToast,
  };
}
