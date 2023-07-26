import { Form, FormInstance, Input } from "antd";
import { useImperativeHandle } from "react";

const { Item } = Form;

export const BasicForm = (props: {
  inputs: Array<{
    label: string;
    name: string;
    defaultValue?: string;
    required?: boolean;
    requireMsg?: string;
  }>;
  formRef: any;
}) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [form] = Form.useForm();
  const { inputs, formRef } = props;
  useImperativeHandle(
    formRef,
    (): FormRefModel => ({
      getFromInstance: () => {
        return form;
      },
    })
  );
  return (
    <div>
      <Form form={form} name="basic">
        {inputs.map((input, index) => (
          <Item
            key={index}
            label={input.label}
            name={input.name}
            initialValue={input.defaultValue ?? ""}
            rules={[
              {
                required: input.required,
                message: input.requireMsg,
              },
            ]}
          >
            <Input />
          </Item>
        ))}
      </Form>
    </div>
  );
};

export interface FormRefModel {
  getFromInstance: () => FormInstance<any>;
}
