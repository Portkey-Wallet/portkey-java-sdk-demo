export enum JavaClassType {
  INTEGER = 0,
  LONG = 1,
  BOOLEAN = 2,
  STRING = 3,
  OBJECT = 4,
  WRAPPED_BOOLEAN = 5,
}

const JavaModelPackageNamePrefix = "io.aelf.schemas.";
const ProtobufGeneratedPackageNamePrefix = "io.aelf.protobuf.generated.";

export interface JavaParameter {
  position?: number;
  type: JavaClassType;
  javaReflectClassName?: SpecialJavaReflectClassName;
  content: JavaParameterContent;
}

export enum SpecialJavaReflectClassName {
  SendTransactionsInput = JavaModelPackageNamePrefix + "SendTransactionsInput",
  AddPeerInput = JavaModelPackageNamePrefix + "AddPeerInput",
  CalculateTransactionFeeInput = JavaModelPackageNamePrefix +
    "CalculateTransactionFeeInput",
  CreateRawTransactionInput = JavaModelPackageNamePrefix +
    "CreateRawTransactionInput",
  ExecuteRawTransactionDto = JavaModelPackageNamePrefix +
    "ExecuteRawTransactionDto",
  SendRawTransactionInput = JavaModelPackageNamePrefix +
    "SendRawTransactionInput",
}

export interface SendTransactionsInput {
  rawTransactions: string;
}

export interface AddPeerInput {
  address: string;
}

export interface CreateRawTransactionInput {
  From: string;
  To: string;
  RefBlockNumber: number;
  RefBlockHash: string;
  MethodName: string;
  Params: string;
}

export interface SendRawTransactionInput {
  Transaction: string;
  Signature: string;
  ReturnTransaction: boolean;
}

export interface ExecuteRawTransactionDto {
  RawTransaction: string;
  Signature: string;
}

export interface CalculateTransactionFeeInput {
  RawTransaction: string;
}

export type SpecialJavaReflectClass =
  | SendTransactionsInput
  | AddPeerInput
  | CalculateTransactionFeeInput
  | CreateRawTransactionInput
  | ExecuteRawTransactionDto
  | SendRawTransactionInput;

export type JavaParameterContent =
  | SpecialJavaReflectClass
  | number
  | string
  | boolean;

export interface JavaMethodRecord {
  target: JavaClassTarget;
  method_name: string;
  special_call?: SpecialJavaCall;
  parameters?: Array<JavaParameter | null>;
}

export enum SpecialJavaCall {
  CREATE_ENDLESS_LOOP = "createEndlessLoop",
  CREATE_ASYNC_CALL = "createAsyncCall",
}

export enum JavaClassTarget {
  CLIENT_SDK,
  NETWORK_SDK,
  CONVERTER,
}
