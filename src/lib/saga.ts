import { put, takeEvery } from "redux-saga/effects";
import { CallApiAction } from "./types";
import { apiRequest } from "./utils";

export const callApiSaga = function* () {
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
