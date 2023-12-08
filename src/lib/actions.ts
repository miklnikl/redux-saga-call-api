import { sagaStore } from "./saga";
import { CallApiRequest } from "./types";

export const callApi = <data>(data: CallApiRequest<data>) => {
  sagaStore.dispatch({
    type: data.actionTypes[0],
    payload: { isCallApiRequest: true, ...data },
  });
};
