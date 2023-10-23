import { CallApiAction, CallApiRequest } from "./types";

export const callApi = <data>(
  data: CallApiRequest<data>,
  store: {
    dispatch: ({ type, payload }: CallApiAction<data>) => void;
  }
) => {
  store.dispatch({
    type: data.actionTypes[0],
    payload: { isCallApiRequest: true, ...data },
  });
};
