import { notification } from "antd";

const sendNotification = (config: {
  title: string;
  content: string;
  autoClose?: AutoCloseType;
  closeDuration?: number;
  type: "success" | "info" | "error";
}) => {
  const {
    title,
    content,
    autoClose = AutoCloseType.AUTO_CLOSE,
    closeDuration = 10,
    type,
  } = config;
  switch (type) {
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
        message: title,
        description: content,
        duration:
          autoClose === AutoCloseType.DO_NOT_CLOSE ? null : closeDuration,
      });
  }
};

export enum AutoCloseType {
  DO_NOT_CLOSE = 1,
  AUTO_CLOSE = 2,
}

export default sendNotification;
