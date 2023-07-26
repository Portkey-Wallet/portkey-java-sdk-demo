export interface CallContractMethodParams {
  contractName: string;
  methodName: string;
  privateKey: string;
  params?: string;
  isViewMethod: boolean;
}
