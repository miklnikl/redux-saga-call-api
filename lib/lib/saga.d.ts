import { Store } from "./types";
export declare let sagaStore: Store;
export declare const callApiSaga: (store: Store) => Generator<import("redux-saga/effects").ForkEffect<never>, void, unknown>;
