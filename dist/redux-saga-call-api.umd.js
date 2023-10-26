(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.reduxSagaCallApi = factory());
})(this, (function () { 'use strict';

    const callApi = (data, store) => {
        store.dispatch({
            type: data.actionTypes[0],
            payload: Object.assign({ isCallApiRequest: true }, data),
        });
    };

    var createSymbol = function createSymbol(name) {
      return "@@redux-saga/" + name;
    };
    var IO =
    /*#__PURE__*/
    createSymbol('IO');
    var MULTICAST =
    /*#__PURE__*/
    createSymbol('MULTICAST');

    var undef = function undef(v) {
      return v === null || v === undefined;
    };
    var notUndef = function notUndef(v) {
      return v !== null && v !== undefined;
    };
    var func = function func(f) {
      return typeof f === 'function';
    };
    var string = function string(s) {
      return typeof s === 'string';
    };
    var array = Array.isArray;
    var object = function object(obj) {
      return obj && !array(obj) && typeof obj === 'object';
    };
    var pattern = function pattern(pat) {
      return pat && (string(pat) || symbol(pat) || func(pat) || array(pat) && pat.every(pattern));
    };
    var channel = function channel(ch) {
      return ch && func(ch.take) && func(ch.close);
    };
    var stringableFunc = function stringableFunc(f) {
      return func(f) && f.hasOwnProperty('toString');
    };
    var symbol = function symbol(sym) {
      return Boolean(sym) && typeof Symbol === 'function' && sym.constructor === Symbol && sym !== Symbol.prototype;
    };
    var multicast = function multicast(ch) {
      return channel(ch) && ch[MULTICAST];
    };
    var effect = function effect(eff) {
      return eff && eff[IO];
    };

    if (process.env.NODE_ENV !== 'production' && typeof Proxy !== 'undefined') ;
    function check(value, predicate, error) {
      if (!predicate(value)) {
        throw new Error(error);
      }
    }

    var kThrow = function kThrow(err) {
      throw err;
    };

    var kReturn = function kReturn(value) {
      return {
        value: value,
        done: true
      };
    };

    function makeIterator(next, thro, name) {
      if (thro === void 0) {
        thro = kThrow;
      }

      if (name === void 0) {
        name = 'iterator';
      }

      var iterator = {
        meta: {
          name: name
        },
        next: next,
        throw: thro,
        return: kReturn,
        isSagaIterator: true
      };

      if (typeof Symbol !== 'undefined') {
        iterator[Symbol.iterator] = function () {
          return iterator;
        };
      }

      return iterator;
    }

    var TAKE = 'TAKE';
    var PUT = 'PUT';
    var FORK = 'FORK';

    var makeEffect = function makeEffect(type, payload) {
      var _ref;

      return _ref = {}, _ref[IO] = true, _ref.combinator = false, _ref.type = type, _ref.payload = payload, _ref;
    };
    function take(patternOrChannel, multicastPattern) {
      if (patternOrChannel === void 0) {
        patternOrChannel = '*';
      }

      if (process.env.NODE_ENV !== 'production' && arguments.length) {
        check(arguments[0], notUndef, 'take(patternOrChannel): patternOrChannel is undefined');
      }

      if (pattern(patternOrChannel)) {
        if (notUndef(multicastPattern)) {
          /* eslint-disable no-console */
          console.warn("take(pattern) takes one argument but two were provided. Consider passing an array for listening to several action types");
        }

        return makeEffect(TAKE, {
          pattern: patternOrChannel
        });
      }

      if (multicast(patternOrChannel) && notUndef(multicastPattern) && pattern(multicastPattern)) {
        return makeEffect(TAKE, {
          channel: patternOrChannel,
          pattern: multicastPattern
        });
      }

      if (channel(patternOrChannel)) {
        if (notUndef(multicastPattern)) {
          /* eslint-disable no-console */
          console.warn("take(channel) takes one argument but two were provided. Second argument is ignored.");
        }

        return makeEffect(TAKE, {
          channel: patternOrChannel
        });
      }

      if (process.env.NODE_ENV !== 'production') {
        throw new Error("take(patternOrChannel): argument " + patternOrChannel + " is not valid channel or a valid pattern");
      }
    }
    function put(channel$1, action) {
      if (process.env.NODE_ENV !== 'production') {
        if (arguments.length > 1) {
          check(channel$1, notUndef, 'put(channel, action): argument channel is undefined');
          check(channel$1, channel, "put(channel, action): argument " + channel$1 + " is not a valid channel");
          check(action, notUndef, 'put(channel, action): argument action is undefined');
        } else {
          check(channel$1, notUndef, 'put(action): argument action is undefined');
        }
      }

      if (undef(action)) {
        action = channel$1; // `undefined` instead of `null` to make default parameter work

        channel$1 = undefined;
      }

      return makeEffect(PUT, {
        channel: channel$1,
        action: action
      });
    }

    var validateFnDescriptor = function validateFnDescriptor(effectName, fnDescriptor) {
      check(fnDescriptor, notUndef, effectName + ": argument fn is undefined or null");

      if (func(fnDescriptor)) {
        return;
      }

      var context = null;
      var fn;

      if (array(fnDescriptor)) {
        context = fnDescriptor[0];
        fn = fnDescriptor[1];
        check(fn, notUndef, effectName + ": argument of type [context, fn] has undefined or null `fn`");
      } else if (object(fnDescriptor)) {
        context = fnDescriptor.context;
        fn = fnDescriptor.fn;
        check(fn, notUndef, effectName + ": argument of type {context, fn} has undefined or null `fn`");
      } else {
        check(fnDescriptor, func, effectName + ": argument fn is not function");
        return;
      }

      if (context && string(fn)) {
        check(context[fn], func, effectName + ": context arguments has no such method - \"" + fn + "\"");
        return;
      }

      check(fn, func, effectName + ": unpacked fn argument (from [context, fn] or {context, fn}) is not a function");
    };

    function getFnCallDescriptor(fnDescriptor, args) {
      var context = null;
      var fn;

      if (func(fnDescriptor)) {
        fn = fnDescriptor;
      } else {
        if (array(fnDescriptor)) {
          context = fnDescriptor[0];
          fn = fnDescriptor[1];
        } else {
          context = fnDescriptor.context;
          fn = fnDescriptor.fn;
        }

        if (context && string(fn) && func(context[fn])) {
          fn = context[fn];
        }
      }

      return {
        context: context,
        fn: fn,
        args: args
      };
    }
    function fork(fnDescriptor) {
      if (process.env.NODE_ENV !== 'production') {
        validateFnDescriptor('fork', fnDescriptor);
        check(fnDescriptor, function (arg) {
          return !effect(arg);
        }, 'fork: argument must not be an effect');
      }

      for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }

      return makeEffect(FORK, getFnCallDescriptor(fnDescriptor, args));
    }

    var done = function done(value) {
      return {
        done: true,
        value: value
      };
    };

    var qEnd = {};
    function safeName(patternOrChannel) {
      if (channel(patternOrChannel)) {
        return 'channel';
      }

      if (stringableFunc(patternOrChannel)) {
        return String(patternOrChannel);
      }

      if (func(patternOrChannel)) {
        return patternOrChannel.name;
      }

      return String(patternOrChannel);
    }
    function fsmIterator(fsm, startState, name) {
      var stateUpdater,
          errorState,
          effect,
          nextState = startState;

      function next(arg, error) {
        if (nextState === qEnd) {
          return done(arg);
        }

        if (error && !errorState) {
          nextState = qEnd;
          throw error;
        } else {
          stateUpdater && stateUpdater(arg);
          var currentState = error ? fsm[errorState](error) : fsm[nextState]();
          nextState = currentState.nextState;
          effect = currentState.effect;
          stateUpdater = currentState.stateUpdater;
          errorState = currentState.errorState;
          return nextState === qEnd ? done(arg) : effect;
        }
      }

      return makeIterator(next, function (error) {
        return next(null, error);
      }, name);
    }

    function takeEvery(patternOrChannel, worker) {
      for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      var yTake = {
        done: false,
        value: take(patternOrChannel)
      };

      var yFork = function yFork(ac) {
        return {
          done: false,
          value: fork.apply(void 0, [worker].concat(args, [ac]))
        };
      };

      var action,
          setAction = function setAction(ac) {
        return action = ac;
      };

      return fsmIterator({
        q1: function q1() {
          return {
            nextState: 'q2',
            effect: yTake,
            stateUpdater: setAction
          };
        },
        q2: function q2() {
          return {
            nextState: 'q1',
            effect: yFork(action)
          };
        }
      }, 'q1', "takeEvery(" + safeName(patternOrChannel) + ", " + worker.name + ")");
    }

    var validateTakeEffect = function validateTakeEffect(fn, patternOrChannel, worker) {
      check(patternOrChannel, notUndef, fn.name + " requires a pattern or channel");
      check(worker, notUndef, fn.name + " requires a saga parameter");
    };

    function takeEvery$1(patternOrChannel, worker) {
      if (process.env.NODE_ENV !== 'production') {
        validateTakeEffect(takeEvery$1, patternOrChannel, worker);
      }

      for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      return fork.apply(void 0, [takeEvery, patternOrChannel, worker].concat(args));
    }

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
        yield takeEvery$1("*", fetchData);
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

    return index;

}));
