export enum HTTPRequestMethods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export type CallApiAction<data> = {
  type: string;
  payload: CallApiRequest<data>;
};

export type CallApiRequest<data> = {
  isCallApiRequest?: boolean;
  actionTypes: string[];
  url: string;
  method: HTTPRequestMethods;
  data?: data;
};

export type Store = {
  dispatch: ({ type, payload }: CallApiAction<any>) => void;
};
