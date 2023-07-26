const local_port = 8190;
export const host_url = `http://localhost:${local_port}`;

export const GETQuery = (
  apiPath: string,
  params: Array<{
    name: string;
    content: string | number;
    useBase64Encode?: boolean;
  }>
) => {
  return (
    apiPath +
    "?" +
    params
      .map((item) => {
        return `${item.name}=${
          item.useBase64Encode &&
          typeof item.content === "string" &&
          item.content.length > 0
            ? window.btoa(item.content)
            : item.content
        }`;
      })
      .join("&")
  );
};
