export interface LogItem {
  message: string;
  timeStamp: string;
}

export const logColumnSetting = [
  {
    title: "message",
    dataIndex: "message",
    key: "message",
  },
  {
    title: "timeStamp",
    dataIndex: "timeStamp",
    key: "timeStamp",
  },
];
