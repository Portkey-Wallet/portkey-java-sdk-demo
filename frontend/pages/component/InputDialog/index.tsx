import React from "react";
import { BasicForm, FormRefModel } from "../BasicForm";
import { Modal } from "antd";
import assert from "assert";

export const callUpDialog = async (props: DialogProps) => {
  const { title, inputs, onConfirm } = props;
  const ref = React.createRef<FormRefModel>();
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
    Modal.confirm({
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

export interface DialogProps {
  title: string;
  inputs: Array<{
    label: string;
    name: string;
    defaultValue?: string;
    required?: boolean;
    requireMsg?: string;
  }>;
  onConfirm: (formInstance: any) => Promise<any>;
}
