"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callApi = void 0;
const callApi = (data, store) => {
    store.dispatch({
        type: data.actionTypes[0],
        payload: { isCallApiRequest: true, ...data },
    });
};
exports.callApi = callApi;
