import { callApi as actionCreator } from "./lib/actions";
import { callApiSaga as saga } from "./lib/saga";

export const callApiSaga = saga;
export const callApi = actionCreator;
