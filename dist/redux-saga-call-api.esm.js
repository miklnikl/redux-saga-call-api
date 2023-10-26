import { takeEvery, put } from 'redux-saga/effects';

const callApi = (data, store) => {
    store.dispatch({
        type: data.actionTypes[0],
        payload: Object.assign({ isCallApiRequest: true }, data),
    });
};

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

const apiRequest = ({ url, method, data }) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        throw new Error('Response wasn`t ok!');
    }
    return yield response.json();
});

const callApiSaga = function* () {
    yield takeEvery("*", fetchData);
};
function* fetchData(request) {
    var _a, _b;
    if (!((_a = request.payload) === null || _a === void 0 ? void 0 : _a.isCallApiRequest) || !((_b = request.payload) === null || _b === void 0 ? void 0 : _b.actionTypes)) {
        return;
    }
    try {
        const payload = yield apiRequest(request.payload);
        yield put({ type: request.payload.actionTypes[1], payload });
    }
    catch (error) {
        yield put({ type: request.payload.actionTypes[2], error });
    }
}

var index = {
    callApiSaga,
    callApi,
};

export { index as default };
