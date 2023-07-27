import { ServiceResult } from "@/service/model/service_wrapper";
import { Button } from "antd";
import sendNotification, { AutoCloseType } from "../../hooks/sendNotification";

const addButton = (title: string, service: () => Promise<any>, key: any) => {
  return (
    <Button
      className="basic-button"
      onClick={() => callService(createServiceWrapper(service(), title))}
      key={key}
    >
      {title}
    </Button>
  );
};

const createServiceWrapper = async (
  callback: Promise<any>,
  title: string
): Promise<ServiceResult> => {
  const res = await callback;
  return {
    title,
    message: res,
  };
};

const callService = async (service: Promise<ServiceResult>) => {
  const MAX_LENGTH_LIMIT = 300;
  try {
    const res: ServiceResult = await service;
    console.log(
      `Service result:`,
      Object.assign({}, res, { timeStamp: Date.now() })
    );
    let logBody = JSON.stringify(res.message);
    if (!logBody || logBody.length === 0) {
      logBody = "the server returns ok but there's no message here";
    } else if (logBody.length > MAX_LENGTH_LIMIT) {
      logBody =
        logBody.slice(0, MAX_LENGTH_LIMIT) +
        "..." +
        "\n" +
        "   [there's too many characters here, please check the console for more details]";
    }
    sendNotification({
      title: res.title,
      content: logBody,
      type: "success",
    });
  } catch (e) {
    if (e === "user cancel") {
      return;
    }
    sendNotification({
      title: "service_failure",
      content:
        e instanceof Error
          ? e.message
          : typeof e === "string"
          ? e
          : JSON.stringify(e),
      type: "error",
    });
  }
};

export default addButton;
