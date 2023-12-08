"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callApiSaga = exports.sagaStore = void 0;
const effects_1 = require("redux-saga/effects");
const utils_1 = require("./utils");
// c let sagaStore?: Store;
exports.sagaStore = {
    dispatch: () => {
        console.warn("sagaStore is not defined");
    },
};
const callApiSaga = function* (store) {
    console.log("callApiSaga1");
    exports.sagaStore = store;
    yield (0, effects_1.takeEvery)("*", fetchData);
};
exports.callApiSaga = callApiSaga;
function* fetchData(request) {
    if (!request.payload?.isCallApiRequest || !request.payload?.actionTypes) {
        return;
    }
    try {
        const payload = yield (0, utils_1.apiRequest)(request.payload);
        yield (0, effects_1.put)({ type: request.payload.actionTypes[1], payload });
    }
    catch (error) {
        yield (0, effects_1.put)({ type: request.payload.actionTypes[2], error });
    }
}
