export declare const callApiSaga: () => Generator<import("redux-saga/effects").ForkEffect<never>, void, unknown>;
export declare const callApi: <data>(data: import("./lib/types").CallApiRequest<data>, store: {
    dispatch: ({ type, payload }: import("./lib/types").CallApiAction<data>) => void;
}) => void;
