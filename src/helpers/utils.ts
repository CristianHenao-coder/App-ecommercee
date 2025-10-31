import { toast } from "react-toastify";

type AvailableTypes = "success" | "error" | "warning" | "info";
const defaultTime = 5000;

export const Notificaction = (
  text: string,
  type: AvailableTypes,
  closeTime?: number
) => {
  switch (type) {
    case "success":
      toast.success(text, {
        position: "top-right",
        autoClose: closeTime ?? defaultTime,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      break;

    case "error":
      toast.error(text, {
        position: "top-right",
        autoClose: closeTime ?? defaultTime,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      break;

    case "warning":
      toast.warn(text, {
        position: "top-right",
        autoClose: closeTime ?? defaultTime,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      break;
    case "info":
      toast.info(text, {
        position: "top-right",
        autoClose: closeTime ?? defaultTime,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      break;
    default:
      break;
  }
};