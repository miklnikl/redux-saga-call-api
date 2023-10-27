import { CallApiAction, CallApiRequest } from "./types";
export declare const callApi: <data>(data: CallApiRequest<data>, store: {
    dispatch: ({ type, payload }: CallApiAction<data>) => void;
}) => void;
