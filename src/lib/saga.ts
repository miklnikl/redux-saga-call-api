import { put, takeEvery } from "redux-saga/effects";
import { CallApiAction, Store } from "./types";
import { apiRequest } from "./utils";

export let sagaStore: Store = {
  dispatch: () => {
    console.warn("sagaStore is not defined");
  },
};

export const callApiSaga = function* (store: Store) {
  sagaStore = store;
  yield takeEvery("*", fetchData);
};

function* fetchData(request: CallApiAction<any>) {
  if (!request.payload?.isCallApiRequest || !request.payload?.actionTypes) {
    return;
  }
  try {
    const payload: Object = yield apiRequest(request.payload);
    yield put({ type: request.payload.actionTypes[1], payload });
  } catch (error) {
    yield put({ type: request.payload.actionTypes[2], error });
  }
}
