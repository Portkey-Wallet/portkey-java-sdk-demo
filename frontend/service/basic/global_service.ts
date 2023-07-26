import assert from "assert";
import { GETQuery } from "../config/network_config";
import {
  JavaClassTarget,
  JavaClassType,
  JavaMethodRecord,
  JavaParameter,
} from "../model/global";
import { CallContractMethodParams } from "../model/param_models";
import fetch from "node-fetch";
export class GlobalService {
  static async sendCentralQuery<T = string>(record: JavaMethodRecord) {
    const { target, method_name, special_call, parameters = [] } = record;
    const url = GETQuery("/api/central", [
      {
        name: "target",
        content: target,
      },
      {
        name: "method_name",
        content: method_name,
      },
      {
        name: "special_call",
        content: special_call ?? "null",
      },
      {
        name: "params",
        content:
          parameters.length > 0
            ? JSON.stringify(this.paramsCheck(parameters))
            : JSON.stringify([]),
        useBase64Encode: true,
      },
    ]);
    const response = await fetch(url);
    const result = (await response.json()) as T;
    return result;
  }

  static getBlockHeight = () => {
    return this.sendCentralQuery<string>({
      target: JavaClassTarget.CLIENT_SDK,
      method_name: "getBlockHeight",
    });
  };

  static getBlockByHash = (hash: string, includeTransactions?: boolean) => {
    return this.sendCentralQuery({
      target: JavaClassTarget.CLIENT_SDK,
      method_name: "getBlockByHash",
      parameters: [
        {
          type: JavaClassType.STRING,
          content: hash,
        },
        includeTransactions
          ? {
              type: JavaClassType.BOOLEAN,
              content: includeTransactions,
            }
          : null,
      ],
    });
  };

  static getBlockByHeight = (height: number, includeTransactions?: boolean) => {
    return this.sendCentralQuery({
      target: JavaClassTarget.CLIENT_SDK,
      method_name: "getBlockByHeight",
      parameters: [
        {
          type: JavaClassType.LONG,
          content: height,
        },
        includeTransactions
          ? {
              type: JavaClassType.BOOLEAN,
              content: includeTransactions,
            }
          : null,
      ],
    });
  };

  static getChainStatus = () => {
    return this.sendCentralQuery<{ ChainId: string }>({
      target: JavaClassTarget.CLIENT_SDK,
      method_name: "getChainStatus",
    });
  };

  static getContractFileDescriptorSet = (address: string) => {
    return this.sendCentralQuery({
      target: JavaClassTarget.CLIENT_SDK,
      method_name: "getContractFileDescriptorSet",
      parameters: [
        {
          type: JavaClassType.STRING,
          content: address,
        },
      ],
    });
  };

  static getTaskQueueStatus = () => {
    return this.sendCentralQuery({
      target: JavaClassTarget.CLIENT_SDK,
      method_name: "getTaskQueueStatus",
    });
  };

  static getTransactionPoolStatus = () => {
    return this.sendCentralQuery({
      target: JavaClassTarget.CLIENT_SDK,
      method_name: "getTransactionPoolStatus",
    });
  };

  static getTransactionResult = (transactionId: string) => {
    return this.sendCentralQuery({
      target: JavaClassTarget.CLIENT_SDK,
      method_name: "getTransactionResult",
      parameters: [
        {
          type: JavaClassType.STRING,
          content: transactionId,
        },
      ],
    });
  };

  static getTransactionResults = (
    blockHash: string,
    offset: number,
    limit: number
  ) => {
    return this.sendCentralQuery({
      target: JavaClassTarget.CLIENT_SDK,
      method_name: "getTransactionResults",
      parameters: [
        {
          type: JavaClassType.STRING,
          content: blockHash,
        },
        {
          type: JavaClassType.INTEGER,
          content: offset,
        },
        {
          type: JavaClassType.INTEGER,
          content: limit,
        },
      ],
    });
  };

  static getMerklePathByTransactionId = (transactionId: string) => {
    return this.sendCentralQuery({
      target: JavaClassTarget.CLIENT_SDK,
      method_name: "getMerklePathByTransactionId",
      parameters: [
        {
          type: JavaClassType.STRING,
          content: transactionId,
        },
      ],
    });
  };

  static getChainId = () => {
    return this.sendCentralQuery({
      target: JavaClassTarget.CLIENT_SDK,
      method_name: "getChainId",
    });
  };

  // static removePeer = (address: string) => {
  //   return this.sendCentralQuery({
  //     target: JavaClassTarget.CLIENT_SDK,
  //     name: "removePeer",
  //     parameters: [
  //       {
  //         type: JavaClassType.STRING,
  //         content: address,
  //       },
  //     ],
  //   });
  // };

  static getPeers = (withMetrics: boolean) => {
    return this.sendCentralQuery({
      target: JavaClassTarget.CLIENT_SDK,
      method_name: "getPeers",
      parameters: [
        {
          type: JavaClassType.WRAPPED_BOOLEAN,
          content: withMetrics,
        },
      ],
    });
  };

  static getNetworkInfo = () => {
    return this.sendCentralQuery({
      target: JavaClassTarget.CLIENT_SDK,
      method_name: "getNetworkInfo",
    });
  };

  static callContractMethod = ({
    contractName,
    methodName,
    privateKey,
    isViewMethod,
    params,
  }: CallContractMethodParams) => {
    return this.sendCentralQuery({
      target: JavaClassTarget.CLIENT_SDK,
      method_name: "callContractMethod",
      parameters: [
        {
          type: JavaClassType.STRING,
          content: contractName,
        },
        {
          type: JavaClassType.STRING,
          content: methodName,
        },
        {
          type: JavaClassType.STRING,
          content: privateKey,
        },
        {
          type: JavaClassType.BOOLEAN,
          content: isViewMethod,
        },
        {
          type: JavaClassType.STRING,
          content: params ?? "",
        },
      ],
    });
  };

  static isConnected = () => {
    return this.sendCentralQuery({
      target: JavaClassTarget.CLIENT_SDK,
      method_name: "isConnected",
    });
  };

  static generateKeyPairInfo = () => {
    return this.sendCentralQuery({
      target: JavaClassTarget.CLIENT_SDK,
      method_name: "generateKeyPairInfo",
    });
  };

  static getFormattedAddress = (privateKey: string, address: string) => {
    return this.sendCentralQuery({
      target: JavaClassTarget.CLIENT_SDK,
      method_name: "getFormattedAddress",
      parameters: [
        {
          type: JavaClassType.STRING,
          content: privateKey,
        },
        {
          type: JavaClassType.STRING,
          content: address,
        },
      ],
    });
  };

  static getAddressFromPubKey = (pubKey: string) => {
    return this.sendCentralQuery({
      target: JavaClassTarget.CLIENT_SDK,
      method_name: "getAddressFromPubKey",
      parameters: [
        {
          type: JavaClassType.STRING,
          content: pubKey,
        },
      ],
    });
  };

  static getAddressFromPrivateKey = (privateKey: string) => {
    return this.sendCentralQuery({
      target: JavaClassTarget.CLIENT_SDK,
      method_name: "getAddressFromPrivateKey",
      parameters: [
        {
          type: JavaClassType.STRING,
          content: privateKey,
        },
      ],
    });
  };

  static paramsCheck = (
    params: Array<JavaParameter | null>
  ): Array<JavaParameter> => {
    const checkAndThrow = (assertType: string, content: any) => {
      assert.equal(
        typeof content,
        assertType,
        "you are using wrong type of parameter: expected " +
          assertType +
          ", but got " +
          typeof content
      );
    };
    return params
      .filter((a) => !!a)
      .map((item, index) => {
        if (!item) throw new Error("param contains null");
        switch (item.type) {
          case JavaClassType.INTEGER:
          case JavaClassType.LONG:
            checkAndThrow("number", item.content);
            break;
          case JavaClassType.BOOLEAN:
          case JavaClassType.WRAPPED_BOOLEAN:
            checkAndThrow("boolean", item.content);
            break;
          case JavaClassType.STRING:
          default:
            checkAndThrow("string", item.content);
        }
        return Object.assign({}, item, { position: index + 1 });
      });
  };
}
