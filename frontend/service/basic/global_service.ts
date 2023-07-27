import assert from "assert";
import {
  GETQuery,
  central_servlet_path,
  host_url,
} from "../config/network_config";
import {
  JavaClassTarget,
  JavaClassType,
  JavaMethodRecord,
  JavaParameter,
  SpecialJavaCall,
} from "../model/global";
import { CallContractMethodParams } from "../model/param_models";
import fetch from "node-fetch";

export class GlobalService {
  private static instance: GlobalService;
  private static withHost = false;
  private constructor() {}

  static init(withHost?: boolean) {
    if (!GlobalService.instance) {
      GlobalService.instance = new GlobalService();
    }
    GlobalService.withHost = withHost ?? false;
  }

  static getInstance(): GlobalService {
    if (!GlobalService.instance) {
      GlobalService.init();
    }
    return GlobalService.instance;
  }

  async sendCentralQuery<T = string>(record: JavaMethodRecord) {
    const {
      target,
      method_name,
      special_call,
      parameters = [],
      convertResultAsRawString,
    } = record;
    const url = GETQuery(
      GlobalService.withHost
        ? host_url + central_servlet_path
        : central_servlet_path,
      [
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
      ]
    );
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Error: ${response.statusText ?? "internal error"}, status:${
          response.status
        }, see the detailed info in the console.`
      );
    }
    try {
      const result = convertResultAsRawString
        ? ((await response.text()) as T)
        : ((await response.json()) as T);
      return result;
    } catch (e) {
      if (e instanceof SyntaxError) {
        throw new Error(
          "The response is not a valid JSON string," +
            " consider using convertResultAsRawString=true to convert it as string."
        );
      }
    }
  }

  initAElfClient = (
    url: string,
    version: string = "1.0",
    userName: string = "",
    password: string = ""
  ) => {
    return this.sendCentralQuery({
      target: JavaClassTarget.CLIENT_SDK,
      method_name: "initAelfClient",
      special_call: SpecialJavaCall.INIT_AELF_CLIENT,
      convertResultAsRawString: true,
      parameters: [
        {
          type: JavaClassType.STRING,
          content: url,
        },
        {
          type: JavaClassType.STRING,
          content: version,
        },
        {
          type: JavaClassType.STRING,
          content: userName,
        },
        {
          type: JavaClassType.STRING,
          content: password,
        },
      ],
    });
  };

  getBlockHeight = () => {
    return this.sendCentralQuery<string>({
      target: JavaClassTarget.CLIENT_SDK,
      method_name: "getBlockHeight",
    });
  };

  getBlockByHash = (hash: string, includeTransactions?: boolean) => {
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

  getBlockByHeight = (height: number, includeTransactions?: boolean) => {
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

  getChainStatus = () => {
    return this.sendCentralQuery<{ ChainId: string }>({
      target: JavaClassTarget.CLIENT_SDK,
      method_name: "getChainStatus",
    });
  };

  getContractFileDescriptorSet = (address: string) => {
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

  getTaskQueueStatus = () => {
    return this.sendCentralQuery({
      target: JavaClassTarget.CLIENT_SDK,
      method_name: "getTaskQueueStatus",
    });
  };

  getTransactionPoolStatus = () => {
    return this.sendCentralQuery({
      target: JavaClassTarget.CLIENT_SDK,
      method_name: "getTransactionPoolStatus",
    });
  };

  getTransactionResult = (transactionId: string) => {
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

  getTransactionResults = (
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

  getMerklePathByTransactionId = (transactionId: string) => {
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

  getChainId = () => {
    return this.sendCentralQuery({
      target: JavaClassTarget.CLIENT_SDK,
      method_name: "getChainId",
    });
  };

  //  removePeer = (address: string) => {
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

  getPeers = (withMetrics: boolean) => {
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

  getNetworkInfo = () => {
    return this.sendCentralQuery({
      target: JavaClassTarget.CLIENT_SDK,
      method_name: "getNetworkInfo",
    });
  };

  callContractMethod = ({
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

  isConnected = () => {
    return this.sendCentralQuery({
      target: JavaClassTarget.CLIENT_SDK,
      method_name: "isConnected",
    });
  };

  generateKeyPairInfo = () => {
    return this.sendCentralQuery({
      target: JavaClassTarget.CLIENT_SDK,
      method_name: "generateKeyPairInfo",
    });
  };

  getFormattedAddress = (privateKey: string, address: string) => {
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

  getAddressFromPubKey = (pubKey: string) => {
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

  getAddressFromPrivateKey = (privateKey: string) => {
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

  paramsCheck = (params: Array<JavaParameter | null>): Array<JavaParameter> => {
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
