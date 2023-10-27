# REDUX-SAGA-CALL-API

> Redux saga with the action creator for calling api with XMLHttpRequests

## Prerequisites

For progects with `redux` and `redux-saga`, written on `typescript`

## Getting Started

## Installation

To install and set up the library, run:

```sh
$ npm install redux-saga-call-api
```

Or if you prefer using Yarn:

```sh
$ yarn add redux-saga-call-api
```

## Usage

#### Saga installation

Add `callApiSaga` to your root saga:

Example:

```tsx
import createSagaMiddleware from 'redux-saga';
import { callApiSaga } from 'redux-saga-call-api';

const sagaMiddleware = createSagaMiddleware();

function* rootSaga() {
  yield fork(callApiSaga);
  ...
}

sagaMiddleware.run(rootSaga);

```

Now you can use `callApi` action creator for calling api.
Create callApi hight order function to provide store to the callApi

```tsx
// callApi.ts
import { store } from "../store";
import { callApi as callApiImported } from "redux-saga-call-api";
import { CallApiRequest } from "redux-saga-call-api/lib/lib/types";

export const callApi = (data: CallApiRequest<unknown>) => {
  callApiImported(data, store);
};
```

Call api whereever you want inside your app, for example:

```tsx
import { HTTPRequestMethods } from "redux-saga-call-api/lib/lib/types";
import { callApi } from "./callApi.ts";

//GET
export const getData = async (id: string) => {
  callApi({
    actionTypes: [`GET_DATA_REQUEST`, `GET_DATA_SUCCESS`, `GET_DATA_FAILURE`],
    url: `${URI}/api/v1/data/${id}`,
    method: HTTPRequestMethods.GET,
  });
};

//POST
export const addData = async (data: DataType) => {
  callApi({
    actionTypes: [`ADD_DATA_REQUEST`, `ADD_DATA_SUCCESS`, `ADD_DATA_FAILURE`],
    url: `${URI}/api/v1/data`,
    method: HTTPRequestMethods.POST,
    data,
  });
};

// in component
export const AddDataPage: React.FunctionComponent = () => {
  const onSubmitHandle = (data: DataType) => {
    addData(data);
  };

  return <DataForm onSubmit={onSubmitHandle} />;
};
```

## Authors

- **Mikl Zhdanov** - _Initial work_ - [Mikl Zhdanov](https://github.com/miklnikl/redux-saga-call-api)

## License

MIT
