import { GlobalService } from "@/service/basic/global_service";
import { callUpDialog } from "../InputDialog";

export const buttonList: Array<{
  title: string;
  service: () => Promise<any>;
}> = [
  {
    title: "isConnected",
    service: () => GlobalService.isConnected(),
  },
  {
    title: "getBlockHeight",
    service: () => GlobalService.getBlockHeight(),
  },
  {
    title: "getBlockByHash",
    service: () =>
      callUpDialog({
        title: "getBlockByHash",
        inputs: [
          {
            label: "blockHash",
            name: "blockHash",
          },
          {
            label: "includeTransactions (1=true, 0/nothing=false)",
            name: "includeTransactions",
          },
        ],
        onConfirm: async (instance) => {
          const { blockHash, includeTransactions } = instance;
          return GlobalService.getBlockByHash(
            blockHash,
            includeTransactions === "1"
          );
        },
      }),
  },
  {
    title: "getBlockByHeight",
    service: () =>
      callUpDialog({
        title: "getBlockByHeight",
        inputs: [
          {
            label: "blockHeight",
            name: "blockHeight",
          },
          {
            label: "includeTransactions (1=true, 0/nothing=false)",
            name: "includeTransactions",
          },
        ],
        onConfirm: async (instance) => {
          const { blockHeight, includeTransactions } = instance;
          return GlobalService.getBlockByHeight(
            Number(blockHeight),
            includeTransactions === "1"
          );
        },
      }),
  },
  {
    title: "getChainStatus",
    service: () => GlobalService.getChainStatus(),
  },
  {
    title: "getContractFileDescriptorSet",
    service: () =>
      callUpDialog({
        title: "getContractFileDescriptorSet",
        inputs: [
          {
            label: "contractAddress",
            name: "contractAddress",
          },
        ],
        onConfirm: async (instance) => {
          const { contractAddress } = instance;
          return GlobalService.getContractFileDescriptorSet(contractAddress);
        },
      }),
  },
  {
    title: "getTaskQueueStatus",
    service: () => GlobalService.getTaskQueueStatus(),
  },
  {
    title: "getTransactionPoolStatus",
    service: () => GlobalService.getTransactionPoolStatus(),
  },
  {
    title: "getTransactionResult",
    service: () =>
      callUpDialog({
        title: "getTransactionResult",
        inputs: [
          {
            label: "transactionId",
            name: "transactionId",
          },
        ],
        onConfirm: async (instance) => {
          const { transactionId } = instance;
          return GlobalService.getTransactionResult(transactionId);
        },
      }),
  },
  {
    title: "getTransactionResults",
    service: () =>
      callUpDialog({
        title: "getTransactionResults",
        inputs: [
          {
            label: "blockHash",
            name: "blockHash",
          },
          {
            label: "offset",
            name: "offset",
            defaultValue: "0",
          },
          {
            label: "limit",
            name: "limit",
            defaultValue: "10",
          },
        ],
        onConfirm: async (instance) => {
          const { blockHash, offset, limit } = instance;
          return GlobalService.getTransactionResults(
            blockHash,
            Number(offset),
            Number(limit)
          );
        },
      }),
  },
  {
    title: "getMerklePathByTransactionId",
    service: () =>
      callUpDialog({
        title: "getMerklePathByTransactionId",
        inputs: [
          {
            label: "transactionId",
            name: "transactionId",
          },
        ],
        onConfirm: async (instance) => {
          const { transactionId } = instance;
          return GlobalService.getMerklePathByTransactionId(transactionId);
        },
      }),
  },
  {
    title: "getChainId",
    service: () => GlobalService.getChainId(),
  },
  {
    title: "getPeers",
    service: () =>
      callUpDialog({
        title: "getPeers",
        inputs: [
          {
            label: "withMetrics (1=true, 0/nothing=false)",
            name: "withMetrics",
          },
        ],
        onConfirm: async (instance) => {
          const { withMetrics } = instance;
          return GlobalService.getPeers(withMetrics === "1");
        },
      }),
  },
  {
    title: "getNetworkInfo",
    service: () => GlobalService.getNetworkInfo(),
  },
  {
    title: "callContractMethod",
    service: () =>
      callUpDialog({
        title: "callContractMethod",
        inputs: [
          {
            label: "contractName",
            name: "contractName",
            defaultValue: "AElf.ContractNames.Token",
          },
          {
            label: "methodName",
            name: "methodName",
            defaultValue: "GetPrimaryTokenSymbol",
          },
          {
            label: "privateKey",
            name: "privateKey",
            defaultValue:
              "cd86ab6347d8e52bbbe8532141fc59ce596268143a308d1d40fedf385528b458",
          },
          {
            label: "isViewMethod (1=true, 0/nothing=false)",
            name: "isViewMethod",
            defaultValue: "1",
          },
          {
            label: "params",
            name: "params",
          },
        ],
        onConfirm: async (instance) => {
          const { contractName, methodName, privateKey, isViewMethod, params } =
            instance;
          return GlobalService.callContractMethod({
            contractName,
            methodName,
            privateKey,
            isViewMethod: isViewMethod === "1",
            params,
          });
        },
      }),
  },
  {
    title: "getFormattedAddress",
    service: () =>
      callUpDialog({
        title: "getFormattedAddress",
        inputs: [
          {
            label: "privateKey",
            name: "privateKey",
            defaultValue:
              "cd86ab6347d8e52bbbe8532141fc59ce596268143a308d1d40fedf385528b458",
          },
          {
            label: "address",
            name: "address",
            defaultValue:
              "cd86ab6347d8e52bbbe8532141fc59ce596268143a308d1d40fedf385528b458",
          },
        ],
        onConfirm: async (instance) => {
          const { privateKey, address } = instance;
          return GlobalService.getFormattedAddress(privateKey, address);
        },
      }),
  },
  {
    title: "generateKeyPairInfo",
    service: () => GlobalService.generateKeyPairInfo(),
  },
  {
    title: "getAddressFromPubKey",
    service: () =>
      callUpDialog({
        title: "getAddressFromPubKey",
        inputs: [
          {
            label: "publicKey",
            name: "publicKey",
            defaultValue:
              "04166cf4be901dee1c21f3d97b9e4818f229bec72a5ecd56b5c4d6ce7abfc3c87e25c36fd279db721acf4258fb489b4a4406e6e6e467935d06990be9d134e5741c",
          },
        ],
        onConfirm: async (instance) => {
          const { publicKey } = instance;
          return GlobalService.getAddressFromPubKey(publicKey);
        },
      }),
  },
  {
    title: "getAddressFromPrivateKey",
    service: () =>
      callUpDialog({
        title: "getAddressFromPrivateKey",
        inputs: [
          {
            label: "privateKey",
            name: "privateKey",
            defaultValue:
              "cd86ab6347d8e52bbbe8532141fc59ce596268143a308d1d40fedf385528b458",
          },
        ],
        onConfirm: async (instance) => {
          const { privateKey } = instance;
          return GlobalService.getAddressFromPrivateKey(privateKey);
        },
      }),
  },
];
