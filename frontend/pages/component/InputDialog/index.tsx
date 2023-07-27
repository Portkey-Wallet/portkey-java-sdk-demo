import React from "react";
import { BasicForm, FormRefModel, InputConfig } from "../BasicForm";
import { Modal } from "antd";
import assert from "assert";

export const callUpDialog = async <T, R>(
  props: DialogProps<T, R>
): Promise<R> => {
  const { title, inputs, onConfirm } = props;
  const ref = React.createRef<FormRefModel<T>>();
  return new Promise((resolve, reject) => {
    const submit = async () => {
      try {
        const form = ref.current?.getFromInstance();
        const result = await form?.getFieldsValue();
        assert.ok(
          result && Object.keys(result).length > 0,
          "input is empty, maybe you don't need this callUpDialog() function"
        );
        const res = await onConfirm(result);
        resolve(res);
      } catch (e) {
        reject(e);
      }
    };
    Modal.info({
      title,
      content: (
        <div>
          <BasicForm inputs={inputs} formRef={ref} />
        </div>
      ),
      onOk: submit,
      onCancel: () => {
        reject("user cancel");
      },
    });
  });
};

export interface DialogProps<T, R = any> {
  title: string;
  inputs: Array<InputConfig<T>>;
  /**
   * receives the user input and start network request.
   *
   * @param formFieldRecord `{ [key in keyof T]: string }` an object with the same keys as the inputs, and the values are the user input
   * @returns a promise that resolves when the user clicks the ok button, and rejects when the user clicks the cancel button
   */
  onConfirm: (formFieldRecord: { [key in keyof T]: string }) => Promise<R>;
}
