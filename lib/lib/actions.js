"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callApi = void 0;
const saga_1 = require("./saga");
const callApi = (data) => {
    saga_1.sagaStore.dispatch({
        type: data.actionTypes[0],
        payload: { isCallApiRequest: true, ...data },
    });
};
exports.callApi = callApi;
