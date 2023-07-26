import { notification } from "antd";

const sendNotification = (config: {
  title: string;
  content: string;
  autoClose: boolean;
  type: "success" | "info" | "error";
}) => {
  switch (config.type) {
    case "error":
      notification.error({
        message: config.title,
        description: config.content,
        duration: null,
      });
      break;

    case "success":
    case "info":
    default:
      notification.info({
        message: config.title,
        description: config.content,
        duration: config.autoClose ? 10 : null,
      });
  }
};

export default sendNotification;
