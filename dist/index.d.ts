import { ForkEffect } from 'redux-saga/effects';

declare type CallApiAction<data> = {
    type: string;
    payload: CallApiRequest<data>;
};

declare type CallApiRequest<data> = {
    isCallApiRequest?: boolean;
    actionTypes: string[];
    url: string;
    method: HTTPRequestMethods;
    data?: data;
};

declare const _default: {
    callApiSaga: () => Generator<ForkEffect<never>, void, unknown>;
    callApi: <data>(data: CallApiRequest<data>, store: {
        dispatch: ({ type, payload }: CallApiAction<data>) => void;
    }) => void;
};
export default _default;

declare enum HTTPRequestMethods {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    DELETE = "DELETE"
}

export { }
