export declare const callApiSaga: (store: import("./lib/types").Store) => Generator<import("redux-saga/effects").ForkEffect<never>, void, unknown>;
export declare const callApi: <data>(data: import("./lib/types").CallApiRequest<data>) => void;
