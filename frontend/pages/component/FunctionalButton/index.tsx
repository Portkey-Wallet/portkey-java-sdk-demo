import { ServiceResult } from "@/service/model/service_wrapper";
import { Button } from "antd";
import sendNotification from "../../hooks/sendNotification";

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
  try {
    const res: ServiceResult = await service;
    console.log(
      `Service result:`,
      Object.assign({}, res, { timeStamp: Date.now() })
    );
    sendNotification({
      title: res.title,
      content: JSON.stringify(res.message),
      autoClose: false,
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
      autoClose: false,
      type: "error",
    });
  }
};

export default addButton;
