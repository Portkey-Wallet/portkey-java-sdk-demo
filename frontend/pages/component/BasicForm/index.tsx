import { Form, FormInstance, Input } from "antd";
import { useImperativeHandle } from "react";

const { Item } = Form;

export const BasicForm = <T,>(props: {
  inputs: Array<InputConfig<T>>;
  formRef: any;
}) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [form] = Form.useForm();
  const { inputs, formRef } = props;
  useImperativeHandle(
    formRef,
    (): FormRefModel<T> => ({
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
            name={input.name as any}
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

export interface StringKeyMap {
  [key: string]: string;
}

export interface InputConfig<V> {
  /**
   * shown on the left side of the input
   */
  label: string;
  /**
   * type: `keyof V`
   *
   * used as the unique key of the input, should be unique in the whole form
   */
  name: keyof V;
  /**
   * default value of the input
   * @optional
   */
  defaultValue?: string;
  /**
   * whether the input is required
   * @optional
   */
  required?: boolean;
  /**
   * if the input is required, the message shown when the input is empty
   * @optional
   */
  requireMsg?: string;
}

export interface FormRefModel<K> {
  getFromInstance: () => FormInstance<{ [key in keyof K]: string }>;
}
