/**
 * @license React
 * react-server.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";
"production" !== process.env.NODE_ENV &&
  ((module.exports = function ($$$config) {
    function objectName(object) {
      return Object.prototype.toString
        .call(object)
        .replace(/^\[object (.*)\]$/, function (m, p0) {
          return p0;
        });
    }
    function describeKeyForErrorMessage(key) {
      var encodedKey = JSON.stringify(key);
      return '"' + key + '"' === encodedKey ? key : encodedKey;
    }
    function describeValueForErrorMessage(value) {
      switch (typeof value) {
        case "string":
          return JSON.stringify(
            10 >= value.length ? value : value.slice(0, 10) + "..."
          );
        case "object":
          if (isArrayImpl(value)) return "[...]";
          if (null !== value && value.$$typeof === CLIENT_REFERENCE_TAG)
            return "client";
          value = objectName(value);
          return "Object" === value ? "{...}" : value;
        case "function":
          return value.$$typeof === CLIENT_REFERENCE_TAG
            ? "client"
            : (value = value.displayName || value.name)
              ? "function " + value
              : "function";
        default:
          return String(value);
      }
    }
    function describeElementType(type) {
      if ("string" === typeof type) return type;
      switch (type) {
        case REACT_SUSPENSE_TYPE:
          return "Suspense";
        case REACT_SUSPENSE_LIST_TYPE:
          return "SuspenseList";
      }
      if ("object" === typeof type)
        switch (type.$$typeof) {
          case REACT_FORWARD_REF_TYPE:
            return describeElementType(type.render);
          case REACT_MEMO_TYPE:
            return describeElementType(type.type);
          case REACT_LAZY_TYPE:
            var payload = type._payload;
            type = type._init;
            try {
              return describeElementType(type(payload));
            } catch (x) {}
        }
      return "";
    }
    function describeObjectForErrorMessage(objectOrArray, expandedName) {
      var objKind = objectName(objectOrArray);
      if ("Object" !== objKind && "Array" !== objKind) return objKind;
      var start = -1,
        length = 0;
      if (isArrayImpl(objectOrArray))
        if (jsxChildrenParents.has(objectOrArray)) {
          var type = jsxChildrenParents.get(objectOrArray);
          objKind = "<" + describeElementType(type) + ">";
          for (var i = 0; i < objectOrArray.length; i++) {
            var value = objectOrArray[i];
            value =
              "string" === typeof value
                ? value
                : "object" === typeof value && null !== value
                  ? "{" + describeObjectForErrorMessage(value) + "}"
                  : "{" + describeValueForErrorMessage(value) + "}";
            "" + i === expandedName
              ? ((start = objKind.length),
                (length = value.length),
                (objKind += value))
              : (objKind =
                  15 > value.length && 40 > objKind.length + value.length
                    ? objKind + value
                    : objKind + "{...}");
          }
          objKind += "</" + describeElementType(type) + ">";
        } else {
          objKind = "[";
          for (type = 0; type < objectOrArray.length; type++)
            0 < type && (objKind += ", "),
              (i = objectOrArray[type]),
              (i =
                "object" === typeof i && null !== i
                  ? describeObjectForErrorMessage(i)
                  : describeValueForErrorMessage(i)),
              "" + type === expandedName
                ? ((start = objKind.length),
                  (length = i.length),
                  (objKind += i))
                : (objKind =
                    10 > i.length && 40 > objKind.length + i.length
                      ? objKind + i
                      : objKind + "...");
          objKind += "]";
        }
      else if (objectOrArray.$$typeof === REACT_ELEMENT_TYPE)
        objKind = "<" + describeElementType(objectOrArray.type) + "/>";
      else {
        if (objectOrArray.$$typeof === CLIENT_REFERENCE_TAG) return "client";
        if (jsxPropsParents.has(objectOrArray)) {
          objKind = jsxPropsParents.get(objectOrArray);
          objKind = "<" + (describeElementType(objKind) || "...");
          type = Object.keys(objectOrArray);
          for (i = 0; i < type.length; i++) {
            objKind += " ";
            value = type[i];
            objKind += describeKeyForErrorMessage(value) + "=";
            var _value2 = objectOrArray[value];
            var _substr2 =
              value === expandedName &&
              "object" === typeof _value2 &&
              null !== _value2
                ? describeObjectForErrorMessage(_value2)
                : describeValueForErrorMessage(_value2);
            "string" !== typeof _value2 && (_substr2 = "{" + _substr2 + "}");
            value === expandedName
              ? ((start = objKind.length),
                (length = _substr2.length),
                (objKind += _substr2))
              : (objKind =
                  10 > _substr2.length && 40 > objKind.length + _substr2.length
                    ? objKind + _substr2
                    : objKind + "...");
          }
          objKind += ">";
        } else {
          objKind = "{";
          type = Object.keys(objectOrArray);
          for (i = 0; i < type.length; i++)
            0 < i && (objKind += ", "),
              (value = type[i]),
              (objKind += describeKeyForErrorMessage(value) + ": "),
              (_value2 = objectOrArray[value]),
              (_value2 =
                "object" === typeof _value2 && null !== _value2
                  ? describeObjectForErrorMessage(_value2)
                  : describeValueForErrorMessage(_value2)),
              value === expandedName
                ? ((start = objKind.length),
                  (length = _value2.length),
                  (objKind += _value2))
                : (objKind =
                    10 > _value2.length && 40 > objKind.length + _value2.length
                      ? objKind + _value2
                      : objKind + "...");
          objKind += "}";
        }
      }
      return void 0 === expandedName
        ? objKind
        : -1 < start && 0 < length
          ? ((objectOrArray = " ".repeat(start) + "^".repeat(length)),
            "\n  " + objKind + "\n  " + objectOrArray)
          : "\n  " + objKind;
    }
    function getComponentNameFromType(type) {
      if (null == type) return null;
      if ("function" === typeof type)
        return type.$$typeof === REACT_CLIENT_REFERENCE
          ? null
          : type.displayName || type.name || null;
      if ("string" === typeof type) return type;
      switch (type) {
        case REACT_FRAGMENT_TYPE:
          return "Fragment";
        case REACT_PORTAL_TYPE:
          return "Portal";
        case REACT_PROFILER_TYPE:
          return "Profiler";
        case REACT_STRICT_MODE_TYPE:
          return "StrictMode";
        case REACT_SUSPENSE_TYPE:
          return "Suspense";
        case REACT_SUSPENSE_LIST_TYPE:
          return "SuspenseList";
      }
      if ("object" === typeof type)
        switch (
          ("number" === typeof type.tag &&
            console.error(
              "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
            ),
          type.$$typeof)
        ) {
          case REACT_CONTEXT_TYPE:
            return (type.displayName || "Context") + ".Provider";
          case REACT_CONSUMER_TYPE:
            return (type._context.displayName || "Context") + ".Consumer";
          case REACT_FORWARD_REF_TYPE:
            var innerType = type.render;
            type = type.displayName;
            type ||
              ((type = innerType.displayName || innerType.name || ""),
              (type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef"));
            return type;
          case REACT_MEMO_TYPE:
            return (
              (innerType = type.displayName || null),
              null !== innerType
                ? innerType
                : getComponentNameFromType(type.type) || "Memo"
            );
          case REACT_LAZY_TYPE:
            innerType = type._payload;
            type = type._init;
            try {
              return getComponentNameFromType(type(innerType));
            } catch (x) {}
        }
      return null;
    }
    function popToNearestCommonAncestor(prev, next) {
      if (prev !== next) {
        prev.context._currentValue2 = prev.parentValue;
        prev = prev.parent;
        var parentNext = next.parent;
        if (null === prev) {
          if (null !== parentNext)
            throw Error(
              "The stacks must reach the root at the same time. This is a bug in React."
            );
        } else {
          if (null === parentNext)
            throw Error(
              "The stacks must reach the root at the same time. This is a bug in React."
            );
          popToNearestCommonAncestor(prev, parentNext);
        }
        next.context._currentValue2 = next.value;
      }
    }
    function popAllPrevious(prev) {
      prev.context._currentValue2 = prev.parentValue;
      prev = prev.parent;
      null !== prev && popAllPrevious(prev);
    }
    function pushAllNext(next) {
      var parentNext = next.parent;
      null !== parentNext && pushAllNext(parentNext);
      next.context._currentValue2 = next.value;
    }
    function popPreviousToCommonLevel(prev, next) {
      prev.context._currentValue2 = prev.parentValue;
      prev = prev.parent;
      if (null === prev)
        throw Error(
          "The depth must equal at least at zero before reaching the root. This is a bug in React."
        );
      prev.depth === next.depth
        ? popToNearestCommonAncestor(prev, next)
        : popPreviousToCommonLevel(prev, next);
    }
    function popNextToCommonLevel(prev, next) {
      var parentNext = next.parent;
      if (null === parentNext)
        throw Error(
          "The depth must equal at least at zero before reaching the root. This is a bug in React."
        );
      prev.depth === parentNext.depth
        ? popToNearestCommonAncestor(prev, parentNext)
        : popNextToCommonLevel(prev, parentNext);
      next.context._currentValue2 = next.value;
    }
    function switchContext(newSnapshot) {
      var prev = currentActiveSnapshot;
      prev !== newSnapshot &&
        (null === prev
          ? pushAllNext(newSnapshot)
          : null === newSnapshot
            ? popAllPrevious(prev)
            : prev.depth === newSnapshot.depth
              ? popToNearestCommonAncestor(prev, newSnapshot)
              : prev.depth > newSnapshot.depth
                ? popPreviousToCommonLevel(prev, newSnapshot)
                : popNextToCommonLevel(prev, newSnapshot),
        (currentActiveSnapshot = newSnapshot));
    }
    function warnOnInvalidCallback(callback) {
      if (null !== callback && "function" !== typeof callback) {
        var key = String(callback);
        didWarnOnInvalidCallback.has(key) ||
          (didWarnOnInvalidCallback.add(key),
          console.error(
            "Expected the last optional `callback` argument to be a function. Instead received: %s.",
            callback
          ));
      }
    }
    function warnNoop(publicInstance, callerName) {
      publicInstance =
        ((publicInstance = publicInstance.constructor) &&
          getComponentNameFromType(publicInstance)) ||
        "ReactClass";
      var warningKey = publicInstance + "." + callerName;
      didWarnAboutNoopUpdateForComponent[warningKey] ||
        (console.error(
          "Can only update a mounting component. This usually means you called %s() outside componentWillMount() on the server. This is a no-op.\n\nPlease check the code for the %s component.",
          callerName,
          publicInstance
        ),
        (didWarnAboutNoopUpdateForComponent[warningKey] = !0));
    }
    function pushTreeContext(baseContext, totalChildren, index) {
      var baseIdWithLeadingBit = baseContext.id;
      baseContext = baseContext.overflow;
      var baseLength = 32 - clz32(baseIdWithLeadingBit) - 1;
      baseIdWithLeadingBit &= ~(1 << baseLength);
      index += 1;
      var length = 32 - clz32(totalChildren) + baseLength;
      if (30 < length) {
        var numberOfOverflowBits = baseLength - (baseLength % 5);
        length = (
          baseIdWithLeadingBit &
          ((1 << numberOfOverflowBits) - 1)
        ).toString(32);
        baseIdWithLeadingBit >>= numberOfOverflowBits;
        baseLength -= numberOfOverflowBits;
        return {
          id:
            (1 << (32 - clz32(totalChildren) + baseLength)) |
            (index << baseLength) |
            baseIdWithLeadingBit,
          overflow: length + baseContext
        };
      }
      return {
        id: (1 << length) | (index << baseLength) | baseIdWithLeadingBit,
        overflow: baseContext
      };
    }
    function clz32Fallback(x) {
      x >>>= 0;
      return 0 === x ? 32 : (31 - ((log(x) / LN2) | 0)) | 0;
    }
    function noop$2() {}
    function trackUsedThenable(thenableState, thenable, index) {
      index = thenableState[index];
      void 0 === index
        ? thenableState.push(thenable)
        : index !== thenable &&
          (thenable.then(noop$2, noop$2), (thenable = index));
      switch (thenable.status) {
        case "fulfilled":
          return thenable.value;
        case "rejected":
          throw thenable.reason;
        default:
          "string" === typeof thenable.status
            ? thenable.then(noop$2, noop$2)
            : ((thenableState = thenable),
              (thenableState.status = "pending"),
              thenableState.then(
                function (fulfilledValue) {
                  if ("pending" === thenable.status) {
                    var fulfilledThenable = thenable;
                    fulfilledThenable.status = "fulfilled";
                    fulfilledThenable.value = fulfilledValue;
                  }
                },
                function (error) {
                  if ("pending" === thenable.status) {
                    var rejectedThenable = thenable;
                    rejectedThenable.status = "rejected";
                    rejectedThenable.reason = error;
                  }
                }
              ));
          switch (thenable.status) {
            case "fulfilled":
              return thenable.value;
            case "rejected":
              throw thenable.reason;
          }
          suspendedThenable = thenable;
          throw SuspenseException;
      }
    }
    function getSuspendedThenable() {
      if (null === suspendedThenable)
        throw Error(
          "Expected a suspended thenable. This is a bug in React. Please file an issue."
        );
      var thenable = suspendedThenable;
      suspendedThenable = null;
      return thenable;
    }
    function is(x, y) {
      return (x === y && (0 !== x || 1 / x === 1 / y)) || (x !== x && y !== y);
    }
    function testStringCoercion(value) {
      return "" + value;
    }
    function resolveCurrentlyRenderingComponent() {
      if (null === currentlyRenderingComponent)
        throw Error(
          "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem."
        );
      isInHookUserCodeInDev &&
        console.error(
          "Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. You can only call Hooks at the top level of your React function. For more information, see https://react.dev/link/rules-of-hooks"
        );
      return currentlyRenderingComponent;
    }
    function createHook() {
      if (0 < numberOfReRenders)
        throw Error("Rendered more hooks than during the previous render");
      return { memoizedState: null, queue: null, next: null };
    }
    function createWorkInProgressHook() {
      null === workInProgressHook
        ? null === firstWorkInProgressHook
          ? ((isReRender = !1),
            (firstWorkInProgressHook = workInProgressHook = createHook()))
          : ((isReRender = !0), (workInProgressHook = firstWorkInProgressHook))
        : null === workInProgressHook.next
          ? ((isReRender = !1),
            (workInProgressHook = workInProgressHook.next = createHook()))
          : ((isReRender = !0), (workInProgressHook = workInProgressHook.next));
      return workInProgressHook;
    }
    function getThenableStateAfterSuspending() {
      var state = thenableState;
      thenableState = null;
      return state;
    }
    function resetHooksState() {
      isInHookUserCodeInDev = !1;
      currentlyRenderingKeyPath =
        currentlyRenderingRequest =
        currentlyRenderingTask =
        currentlyRenderingComponent =
          null;
      didScheduleRenderPhaseUpdate = !1;
      firstWorkInProgressHook = null;
      numberOfReRenders = 0;
      workInProgressHook = renderPhaseUpdates = null;
    }
    function readContext(context) {
      isInHookUserCodeInDev &&
        console.error(
          "Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo()."
        );
      return context._currentValue2;
    }
    function basicStateReducer(state, action) {
      return "function" === typeof action ? action(state) : action;
    }
    function useReducer(reducer, initialArg, init) {
      reducer !== basicStateReducer && (currentHookNameInDev = "useReducer");
      currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
      workInProgressHook = createWorkInProgressHook();
      if (isReRender) {
        init = workInProgressHook.queue;
        initialArg = init.dispatch;
        if (null !== renderPhaseUpdates) {
          var firstRenderPhaseUpdate = renderPhaseUpdates.get(init);
          if (void 0 !== firstRenderPhaseUpdate) {
            renderPhaseUpdates.delete(init);
            init = workInProgressHook.memoizedState;
            do {
              var action = firstRenderPhaseUpdate.action;
              isInHookUserCodeInDev = !0;
              init = reducer(init, action);
              isInHookUserCodeInDev = !1;
              firstRenderPhaseUpdate = firstRenderPhaseUpdate.next;
            } while (null !== firstRenderPhaseUpdate);
            workInProgressHook.memoizedState = init;
            return [init, initialArg];
          }
        }
        return [workInProgressHook.memoizedState, initialArg];
      }
      isInHookUserCodeInDev = !0;
      reducer =
        reducer === basicStateReducer
          ? "function" === typeof initialArg
            ? initialArg()
            : initialArg
          : void 0 !== init
            ? init(initialArg)
            : initialArg;
      isInHookUserCodeInDev = !1;
      workInProgressHook.memoizedState = reducer;
      reducer = workInProgressHook.queue = { last: null, dispatch: null };
      reducer = reducer.dispatch = dispatchAction.bind(
        null,
        currentlyRenderingComponent,
        reducer
      );
      return [workInProgressHook.memoizedState, reducer];
    }
    function useMemo(nextCreate, deps) {
      currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
      workInProgressHook = createWorkInProgressHook();
      deps = void 0 === deps ? null : deps;
      if (null !== workInProgressHook) {
        var prevState = workInProgressHook.memoizedState;
        if (null !== prevState && null !== deps) {
          a: {
            var JSCompiler_inline_result = prevState[1];
            if (null === JSCompiler_inline_result)
              console.error(
                "%s received a final argument during this render, but not during the previous render. Even though the final argument is optional, its type cannot change between renders.",
                currentHookNameInDev
              ),
                (JSCompiler_inline_result = !1);
            else {
              deps.length !== JSCompiler_inline_result.length &&
                console.error(
                  "The final argument passed to %s changed size between renders. The order and size of this array must remain constant.\n\nPrevious: %s\nIncoming: %s",
                  currentHookNameInDev,
                  "[" + deps.join(", ") + "]",
                  "[" + JSCompiler_inline_result.join(", ") + "]"
                );
              for (
                var i = 0;
                i < JSCompiler_inline_result.length && i < deps.length;
                i++
              )
                if (!objectIs(deps[i], JSCompiler_inline_result[i])) {
                  JSCompiler_inline_result = !1;
                  break a;
                }
              JSCompiler_inline_result = !0;
            }
          }
          if (JSCompiler_inline_result) return prevState[0];
        }
      }
      isInHookUserCodeInDev = !0;
      nextCreate = nextCreate();
      isInHookUserCodeInDev = !1;
      workInProgressHook.memoizedState = [nextCreate, deps];
      return nextCreate;
    }
    function dispatchAction(componentIdentity, queue, action) {
      if (25 <= numberOfReRenders)
        throw Error(
          "Too many re-renders. React limits the number of renders to prevent an infinite loop."
        );
      if (componentIdentity === currentlyRenderingComponent)
        if (
          ((didScheduleRenderPhaseUpdate = !0),
          (componentIdentity = { action: action, next: null }),
          null === renderPhaseUpdates && (renderPhaseUpdates = new Map()),
          (action = renderPhaseUpdates.get(queue)),
          void 0 === action)
        )
          renderPhaseUpdates.set(queue, componentIdentity);
        else {
          for (queue = action; null !== queue.next; ) queue = queue.next;
          queue.next = componentIdentity;
        }
    }
    function unsupportedStartTransition() {
      throw Error("startTransition cannot be called during server rendering.");
    }
    function unsupportedSetOptimisticState() {
      throw Error("Cannot update optimistic state while rendering.");
    }
    function useActionState(action, initialState, permalink) {
      resolveCurrentlyRenderingComponent();
      var actionStateHookIndex = actionStateCounter++,
        request = currentlyRenderingRequest;
      if ("function" === typeof action.$$FORM_ACTION) {
        var nextPostbackStateKey = null,
          componentKeyPath = currentlyRenderingKeyPath;
        request = request.formState;
        var isSignatureEqual = action.$$IS_SIGNATURE_EQUAL;
        if (null !== request && "function" === typeof isSignatureEqual) {
          var postbackKey = request[1];
          isSignatureEqual.call(action, request[2], request[3]) &&
            ((nextPostbackStateKey =
              void 0 !== permalink
                ? "p" + permalink
                : "k" +
                  createFastHash(
                    JSON.stringify([
                      componentKeyPath,
                      null,
                      actionStateHookIndex
                    ])
                  )),
            postbackKey === nextPostbackStateKey &&
              ((actionStateMatchingIndex = actionStateHookIndex),
              (initialState = request[0])));
        }
        var boundAction = action.bind(null, initialState);
        action = function (payload) {
          boundAction(payload);
        };
        "function" === typeof boundAction.$$FORM_ACTION &&
          (action.$$FORM_ACTION = function (prefix) {
            prefix = boundAction.$$FORM_ACTION(prefix);
            if (void 0 !== permalink) {
              var value = permalink;
              try {
                testStringCoercion(value);
                var JSCompiler_inline_result = !1;
              } catch (e) {
                JSCompiler_inline_result = !0;
              }
              JSCompiler_inline_result &&
                (console.error(
                  "The provided `%s` attribute is an unsupported type %s. This value must be coerced to a string before using it here.",
                  "target",
                  ("function" === typeof Symbol &&
                    Symbol.toStringTag &&
                    value[Symbol.toStringTag]) ||
                    value.constructor.name ||
                    "Object"
                ),
                testStringCoercion(value));
              permalink += "";
              prefix.action = permalink;
            }
            if ((JSCompiler_inline_result = prefix.data))
              null === nextPostbackStateKey &&
                (nextPostbackStateKey =
                  void 0 !== permalink
                    ? "p" + permalink
                    : "k" +
                      createFastHash(
                        JSON.stringify([
                          componentKeyPath,
                          null,
                          actionStateHookIndex
                        ])
                      )),
                JSCompiler_inline_result.append(
                  "$ACTION_KEY",
                  nextPostbackStateKey
                );
            return prefix;
          });
        return [initialState, action, !1];
      }
      var _boundAction = action.bind(null, initialState);
      return [
        initialState,
        function (payload) {
          _boundAction(payload);
        },
        !1
      ];
    }
    function unwrapThenable(thenable) {
      var index = thenableIndexCounter;
      thenableIndexCounter += 1;
      null === thenableState && (thenableState = []);
      return trackUsedThenable(thenableState, thenable, index);
    }
    function unsupportedRefresh() {
      throw Error("Cache cannot be refreshed during server rendering.");
    }
    function noop$1() {}
    function disabledLog() {}
    function disableLogs() {
      if (0 === disabledDepth) {
        prevLog = console.log;
        prevInfo = console.info;
        prevWarn = console.warn;
        prevError = console.error;
        prevGroup = console.group;
        prevGroupCollapsed = console.groupCollapsed;
        prevGroupEnd = console.groupEnd;
        var props = {
          configurable: !0,
          enumerable: !0,
          value: disabledLog,
          writable: !0
        };
        Object.defineProperties(console, {
          info: props,
          log: props,
          warn: props,
          error: props,
          group: props,
          groupCollapsed: props,
          groupEnd: props
        });
      }
      disabledDepth++;
    }
    function reenableLogs() {
      disabledDepth--;
      if (0 === disabledDepth) {
        var props = { configurable: !0, enumerable: !0, writable: !0 };
        Object.defineProperties(console, {
          log: assign({}, props, { value: prevLog }),
          info: assign({}, props, { value: prevInfo }),
          warn: assign({}, props, { value: prevWarn }),
          error: assign({}, props, { value: prevError }),
          group: assign({}, props, { value: prevGroup }),
          groupCollapsed: assign({}, props, { value: prevGroupCollapsed }),
          groupEnd: assign({}, props, { value: prevGroupEnd })
        });
      }
      0 > disabledDepth &&
        console.error(
          "disabledDepth fell below zero. This is a bug in React. Please file an issue."
        );
    }
    function describeBuiltInComponentFrame(name) {
      if (void 0 === prefix)
        try {
          throw Error();
        } catch (x) {
          var match = x.stack.trim().match(/\n( *(at )?)/);
          prefix = (match && match[1]) || "";
          suffix =
            -1 < x.stack.indexOf("\n    at")
              ? " (<anonymous>)"
              : -1 < x.stack.indexOf("@")
                ? "@unknown:0:0"
                : "";
        }
      return "\n" + prefix + name + suffix;
    }
    function describeNativeComponentFrame(fn, construct) {
      if (!fn || reentry) return "";
      var frame = componentFrameCache.get(fn);
      if (void 0 !== frame) return frame;
      reentry = !0;
      frame = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var previousDispatcher = null;
      previousDispatcher = ReactSharedInternals.H;
      ReactSharedInternals.H = null;
      disableLogs();
      try {
        var RunInRootFrame = {
          DetermineComponentFrameRoot: function () {
            try {
              if (construct) {
                var Fake = function () {
                  throw Error();
                };
                Object.defineProperty(Fake.prototype, "props", {
                  set: function () {
                    throw Error();
                  }
                });
                if ("object" === typeof Reflect && Reflect.construct) {
                  try {
                    Reflect.construct(Fake, []);
                  } catch (x) {
                    var control = x;
                  }
                  Reflect.construct(fn, [], Fake);
                } else {
                  try {
                    Fake.call();
                  } catch (x$0) {
                    control = x$0;
                  }
                  fn.call(Fake.prototype);
                }
              } else {
                try {
                  throw Error();
                } catch (x$1) {
                  control = x$1;
                }
                (Fake = fn()) &&
                  "function" === typeof Fake.catch &&
                  Fake.catch(function () {});
              }
            } catch (sample) {
              if (sample && control && "string" === typeof sample.stack)
                return [sample.stack, control.stack];
            }
            return [null, null];
          }
        };
        RunInRootFrame.DetermineComponentFrameRoot.displayName =
          "DetermineComponentFrameRoot";
        var namePropDescriptor = Object.getOwnPropertyDescriptor(
          RunInRootFrame.DetermineComponentFrameRoot,
          "name"
        );
        namePropDescriptor &&
          namePropDescriptor.configurable &&
          Object.defineProperty(
            RunInRootFrame.DetermineComponentFrameRoot,
            "name",
            { value: "DetermineComponentFrameRoot" }
          );
        var _RunInRootFrame$Deter =
            RunInRootFrame.DetermineComponentFrameRoot(),
          sampleStack = _RunInRootFrame$Deter[0],
          controlStack = _RunInRootFrame$Deter[1];
        if (sampleStack && controlStack) {
          var sampleLines = sampleStack.split("\n"),
            controlLines = controlStack.split("\n");
          for (
            _RunInRootFrame$Deter = namePropDescriptor = 0;
            namePropDescriptor < sampleLines.length &&
            !sampleLines[namePropDescriptor].includes(
              "DetermineComponentFrameRoot"
            );

          )
            namePropDescriptor++;
          for (
            ;
            _RunInRootFrame$Deter < controlLines.length &&
            !controlLines[_RunInRootFrame$Deter].includes(
              "DetermineComponentFrameRoot"
            );

          )
            _RunInRootFrame$Deter++;
          if (
            namePropDescriptor === sampleLines.length ||
            _RunInRootFrame$Deter === controlLines.length
          )
            for (
              namePropDescriptor = sampleLines.length - 1,
                _RunInRootFrame$Deter = controlLines.length - 1;
              1 <= namePropDescriptor &&
              0 <= _RunInRootFrame$Deter &&
              sampleLines[namePropDescriptor] !==
                controlLines[_RunInRootFrame$Deter];

            )
              _RunInRootFrame$Deter--;
          for (
            ;
            1 <= namePropDescriptor && 0 <= _RunInRootFrame$Deter;
            namePropDescriptor--, _RunInRootFrame$Deter--
          )
            if (
              sampleLines[namePropDescriptor] !==
              controlLines[_RunInRootFrame$Deter]
            ) {
              if (1 !== namePropDescriptor || 1 !== _RunInRootFrame$Deter) {
                do
                  if (
                    (namePropDescriptor--,
                    _RunInRootFrame$Deter--,
                    0 > _RunInRootFrame$Deter ||
                      sampleLines[namePropDescriptor] !==
                        controlLines[_RunInRootFrame$Deter])
                  ) {
                    var _frame =
                      "\n" +
                      sampleLines[namePropDescriptor].replace(
                        " at new ",
                        " at "
                      );
                    fn.displayName &&
                      _frame.includes("<anonymous>") &&
                      (_frame = _frame.replace("<anonymous>", fn.displayName));
                    "function" === typeof fn &&
                      componentFrameCache.set(fn, _frame);
                    return _frame;
                  }
                while (1 <= namePropDescriptor && 0 <= _RunInRootFrame$Deter);
              }
              break;
            }
        }
      } finally {
        (reentry = !1),
          (ReactSharedInternals.H = previousDispatcher),
          reenableLogs(),
          (Error.prepareStackTrace = frame);
      }
      sampleLines = (sampleLines = fn ? fn.displayName || fn.name : "")
        ? describeBuiltInComponentFrame(sampleLines)
        : "";
      "function" === typeof fn && componentFrameCache.set(fn, sampleLines);
      return sampleLines;
    }
    function describeComponentStackByType(type) {
      if ("string" === typeof type) return describeBuiltInComponentFrame(type);
      if ("function" === typeof type)
        return type.prototype && type.prototype.isReactComponent
          ? ((type = describeNativeComponentFrame(type, !0)), type)
          : describeNativeComponentFrame(type, !1);
      if ("object" === typeof type && null !== type) {
        switch (type.$$typeof) {
          case REACT_FORWARD_REF_TYPE:
            return describeNativeComponentFrame(type.render, !1);
          case REACT_MEMO_TYPE:
            return describeNativeComponentFrame(type.type, !1);
          case REACT_LAZY_TYPE:
            var lazyComponent = type,
              payload = lazyComponent._payload;
            lazyComponent = lazyComponent._init;
            try {
              type = lazyComponent(payload);
            } catch (x) {
              return describeBuiltInComponentFrame("Lazy");
            }
            return describeComponentStackByType(type);
        }
        if ("string" === typeof type.name)
          return (
            (payload = type.env),
            describeBuiltInComponentFrame(
              type.name + (payload ? " [" + payload + "]" : "")
            )
          );
      }
      switch (type) {
        case REACT_SUSPENSE_LIST_TYPE:
          return describeBuiltInComponentFrame("SuspenseList");
        case REACT_SUSPENSE_TYPE:
          return describeBuiltInComponentFrame("Suspense");
      }
      return "";
    }
    function getStackByComponentStackNode(componentStack) {
      try {
        var info = "";
        do
          (info += describeComponentStackByType(componentStack.type)),
            (componentStack = componentStack.parent);
        while (componentStack);
        return info;
      } catch (x) {
        return "\nError generating stack: " + x.message + "\n" + x.stack;
      }
    }
    function defaultErrorHandler(error) {
      "object" === typeof error &&
      null !== error &&
      "string" === typeof error.environmentName
        ? bindToConsole("error", [error], error.environmentName)()
        : console.error(error);
      return null;
    }
    function noop() {}
    function RequestInstance(
      resumableState,
      renderState,
      rootFormatContext,
      progressiveChunkSize,
      onError,
      onAllReady,
      onShellReady,
      onShellError,
      onFatalError,
      onPostpone,
      formState
    ) {
      var abortSet = new Set();
      this.destination = null;
      this.flushScheduled = !1;
      this.resumableState = resumableState;
      this.renderState = renderState;
      this.rootFormatContext = rootFormatContext;
      this.progressiveChunkSize =
        void 0 === progressiveChunkSize ? 12800 : progressiveChunkSize;
      this.status = 10;
      this.fatalError = null;
      this.pendingRootTasks = this.allPendingTasks = this.nextSegmentId = 0;
      this.completedRootSegment = null;
      this.abortableTasks = abortSet;
      this.pingedTasks = [];
      this.clientRenderedBoundaries = [];
      this.completedBoundaries = [];
      this.partialBoundaries = [];
      this.trackedPostpones = null;
      this.onError = void 0 === onError ? defaultErrorHandler : onError;
      this.onPostpone = void 0 === onPostpone ? noop : onPostpone;
      this.onAllReady = void 0 === onAllReady ? noop : onAllReady;
      this.onShellReady = void 0 === onShellReady ? noop : onShellReady;
      this.onShellError = void 0 === onShellError ? noop : onShellError;
      this.onFatalError = void 0 === onFatalError ? noop : onFatalError;
      this.formState = void 0 === formState ? null : formState;
      this.didWarnForKey = null;
    }
    function createRequest(
      children,
      resumableState,
      renderState,
      rootFormatContext,
      progressiveChunkSize,
      onError,
      onAllReady,
      onShellReady,
      onShellError,
      onFatalError,
      onPostpone,
      formState
    ) {
      resumableState = new RequestInstance(
        resumableState,
        renderState,
        rootFormatContext,
        progressiveChunkSize,
        onError,
        onAllReady,
        onShellReady,
        onShellError,
        onFatalError,
        onPostpone,
        formState
      );
      renderState = createPendingSegment(
        resumableState,
        0,
        null,
        rootFormatContext,
        !1,
        !1
      );
      renderState.parentFlushed = !0;
      children = createRenderTask(
        resumableState,
        null,
        children,
        -1,
        null,
        renderState,
        null,
        resumableState.abortableTasks,
        null,
        rootFormatContext,
        null,
        emptyTreeContext,
        null,
        !1
      );
      pushComponentStack(children);
      resumableState.pingedTasks.push(children);
      return resumableState;
    }
    function resumeRequest(
      children,
      postponedState,
      renderState,
      onError,
      onAllReady,
      onShellReady,
      onShellError,
      onFatalError,
      onPostpone
    ) {
      renderState = new RequestInstance(
        postponedState.resumableState,
        renderState,
        postponedState.rootFormatContext,
        postponedState.progressiveChunkSize,
        onError,
        onAllReady,
        onShellReady,
        onShellError,
        onFatalError,
        onPostpone,
        null
      );
      renderState.nextSegmentId = postponedState.nextSegmentId;
      if ("number" === typeof postponedState.replaySlots)
        return (
          (onError = postponedState.replaySlots),
          (onAllReady = createPendingSegment(
            renderState,
            0,
            null,
            postponedState.rootFormatContext,
            !1,
            !1
          )),
          (onAllReady.id = onError),
          (onAllReady.parentFlushed = !0),
          (children = createRenderTask(
            renderState,
            null,
            children,
            -1,
            null,
            onAllReady,
            null,
            renderState.abortableTasks,
            null,
            postponedState.rootFormatContext,
            null,
            emptyTreeContext,
            null,
            !1
          )),
          pushComponentStack(children),
          renderState.pingedTasks.push(children),
          renderState
        );
      children = createReplayTask(
        renderState,
        null,
        {
          nodes: postponedState.replayNodes,
          slots: postponedState.replaySlots,
          pendingTasks: 0
        },
        children,
        -1,
        null,
        null,
        renderState.abortableTasks,
        null,
        postponedState.rootFormatContext,
        null,
        emptyTreeContext,
        null,
        !1
      );
      pushComponentStack(children);
      renderState.pingedTasks.push(children);
      return renderState;
    }
    function pingTask(request, task) {
      request.pingedTasks.push(task);
      1 === request.pingedTasks.length &&
        ((request.flushScheduled = null !== request.destination),
        null !== request.trackedPostpones || 10 === request.status
          ? scheduleMicrotask(function () {
              return performWork(request);
            })
          : scheduleWork(function () {
              return performWork(request);
            }));
    }
    function createSuspenseBoundary(request, fallbackAbortableTasks) {
      return {
        status: 0,
        rootSegmentID: -1,
        parentFlushed: !1,
        pendingTasks: 0,
        completedSegments: [],
        byteSize: 0,
        fallbackAbortableTasks: fallbackAbortableTasks,
        errorDigest: null,
        contentState: createHoistableState(),
        fallbackState: createHoistableState(),
        trackedContentKeyPath: null,
        trackedFallbackNode: null,
        errorMessage: null,
        errorStack: null,
        errorComponentStack: null
      };
    }
    function createRenderTask(
      request,
      thenableState,
      node,
      childIndex,
      blockedBoundary,
      blockedSegment,
      hoistableState,
      abortSet,
      keyPath,
      formatContext,
      context,
      treeContext,
      componentStack,
      isFallback
    ) {
      request.allPendingTasks++;
      null === blockedBoundary
        ? request.pendingRootTasks++
        : blockedBoundary.pendingTasks++;
      var task = {
        replay: null,
        node: node,
        childIndex: childIndex,
        ping: function () {
          return pingTask(request, task);
        },
        blockedBoundary: blockedBoundary,
        blockedSegment: blockedSegment,
        hoistableState: hoistableState,
        abortSet: abortSet,
        keyPath: keyPath,
        formatContext: formatContext,
        context: context,
        treeContext: treeContext,
        componentStack: componentStack,
        thenableState: thenableState,
        isFallback: isFallback
      };
      abortSet.add(task);
      return task;
    }
    function createReplayTask(
      request,
      thenableState,
      replay,
      node,
      childIndex,
      blockedBoundary,
      hoistableState,
      abortSet,
      keyPath,
      formatContext,
      context,
      treeContext,
      componentStack,
      isFallback
    ) {
      request.allPendingTasks++;
      null === blockedBoundary
        ? request.pendingRootTasks++
        : blockedBoundary.pendingTasks++;
      replay.pendingTasks++;
      var task = {
        replay: replay,
        node: node,
        childIndex: childIndex,
        ping: function () {
          return pingTask(request, task);
        },
        blockedBoundary: blockedBoundary,
        blockedSegment: null,
        hoistableState: hoistableState,
        abortSet: abortSet,
        keyPath: keyPath,
        formatContext: formatContext,
        context: context,
        treeContext: treeContext,
        componentStack: componentStack,
        thenableState: thenableState,
        isFallback: isFallback
      };
      abortSet.add(task);
      return task;
    }
    function createPendingSegment(
      request,
      index,
      boundary,
      parentFormatContext,
      lastPushedText,
      textEmbedded
    ) {
      return {
        status: 0,
        id: -1,
        index: index,
        parentFlushed: !1,
        chunks: [],
        children: [],
        parentFormatContext: parentFormatContext,
        boundary: boundary,
        lastPushedText: lastPushedText,
        textEmbedded: textEmbedded
      };
    }
    function getCurrentStackInDEV() {
      return null === currentTaskInDEV ||
        null === currentTaskInDEV.componentStack
        ? ""
        : getStackByComponentStackNode(currentTaskInDEV.componentStack);
    }
    function pushServerComponentStack(task, debugInfo) {
      if (null != debugInfo)
        for (var i = 0; i < debugInfo.length; i++) {
          var componentInfo = debugInfo[i];
          "string" === typeof componentInfo.name &&
            (task.componentStack = {
              parent: task.componentStack,
              type: componentInfo,
              owner: componentInfo.owner,
              stack: null
            });
        }
    }
    function pushComponentStack(task) {
      var node = task.node;
      if ("object" === typeof node && null !== node)
        switch (node.$$typeof) {
          case REACT_ELEMENT_TYPE:
            var type = node.type,
              owner = node._owner;
            pushServerComponentStack(task, node._debugInfo);
            task.componentStack = {
              parent: task.componentStack,
              type: type,
              owner: owner,
              stack: null
            };
            break;
          case REACT_LAZY_TYPE:
            pushServerComponentStack(task, node._debugInfo);
            break;
          default:
            "function" === typeof node.then &&
              pushServerComponentStack(task, node._debugInfo);
        }
    }
    function getThrownInfo(node) {
      var errorInfo = {};
      node &&
        Object.defineProperty(errorInfo, "componentStack", {
          configurable: !0,
          enumerable: !0,
          get: function () {
            var stack = getStackByComponentStackNode(node);
            Object.defineProperty(errorInfo, "componentStack", {
              value: stack
            });
            return stack;
          }
        });
      return errorInfo;
    }
    function encodeErrorForBoundary(
      boundary,
      digest,
      error,
      thrownInfo,
      wasAborted
    ) {
      boundary.errorDigest = digest;
      error instanceof Error
        ? ((digest = String(error.message)), (error = String(error.stack)))
        : ((digest =
            "object" === typeof error && null !== error
              ? describeObjectForErrorMessage(error)
              : String(error)),
          (error = null));
      wasAborted = wasAborted
        ? "Switched to client rendering because the server rendering aborted due to:\n\n"
        : "Switched to client rendering because the server rendering errored:\n\n";
      boundary.errorMessage = wasAborted + digest;
      boundary.errorStack = null !== error ? wasAborted + error : null;
      boundary.errorComponentStack = thrownInfo.componentStack;
    }
    function logRecoverableError(request, error, errorInfo) {
      request = request.onError;
      error = request(error, errorInfo);
      if (null != error && "string" !== typeof error)
        console.error(
          'onError returned something with a type other than "string". onError should return a string and may return null or undefined but must not return anything else. It received something of type "%s" instead',
          typeof error
        );
      else return error;
    }
    function fatalError(request, error) {
      var onShellError = request.onShellError,
        onFatalError = request.onFatalError;
      onShellError(error);
      onFatalError(error);
      null !== request.destination
        ? ((request.status = 14), closeWithError(request.destination, error))
        : ((request.status = 13), (request.fatalError = error));
    }
    function renderWithHooks(
      request,
      task,
      keyPath,
      Component,
      props,
      secondArg
    ) {
      var prevThenableState = task.thenableState;
      task.thenableState = null;
      currentlyRenderingComponent = {};
      currentlyRenderingTask = task;
      currentlyRenderingRequest = request;
      currentlyRenderingKeyPath = keyPath;
      isInHookUserCodeInDev = !1;
      actionStateCounter = localIdCounter = 0;
      actionStateMatchingIndex = -1;
      thenableIndexCounter = 0;
      thenableState = prevThenableState;
      for (
        request = callComponentInDEV(Component, props, secondArg);
        didScheduleRenderPhaseUpdate;

      )
        (didScheduleRenderPhaseUpdate = !1),
          (actionStateCounter = localIdCounter = 0),
          (actionStateMatchingIndex = -1),
          (thenableIndexCounter = 0),
          (numberOfReRenders += 1),
          (workInProgressHook = null),
          (request = Component(props, secondArg));
      resetHooksState();
      return request;
    }
    function resolveClassComponentProps(Component, baseProps) {
      var newProps = baseProps;
      if ("ref" in baseProps) {
        newProps = {};
        for (var propName in baseProps)
          "ref" !== propName && (newProps[propName] = baseProps[propName]);
      }
      if ((Component = Component.defaultProps)) {
        newProps === baseProps && (newProps = assign({}, newProps, baseProps));
        for (var _propName in Component)
          void 0 === newProps[_propName] &&
            (newProps[_propName] = Component[_propName]);
      }
      return newProps;
    }
    function finishFunctionComponent(
      request,
      task,
      keyPath,
      children,
      hasId,
      actionStateCount,
      actionStateMatchingIndex
    ) {
      var didEmitActionStateMarkers = !1;
      if (0 !== actionStateCount && null !== request.formState) {
        var segment = task.blockedSegment;
        if (null !== segment) {
          didEmitActionStateMarkers = !0;
          segment = segment.chunks;
          for (var i = 0; i < actionStateCount; i++)
            i === actionStateMatchingIndex
              ? pushFormStateMarkerIsMatching(segment)
              : pushFormStateMarkerIsNotMatching(segment);
        }
      }
      actionStateCount = task.keyPath;
      task.keyPath = keyPath;
      hasId
        ? ((keyPath = task.treeContext),
          (task.treeContext = pushTreeContext(keyPath, 1, 0)),
          renderNode(request, task, children, -1),
          (task.treeContext = keyPath))
        : didEmitActionStateMarkers
          ? renderNode(request, task, children, -1)
          : renderNodeDestructive(request, task, children, -1);
      task.keyPath = actionStateCount;
    }
    function renderElement(request, task, keyPath, type, props, ref) {
      if ("function" === typeof type)
        if (type.prototype && type.prototype.isReactComponent) {
          props = resolveClassComponentProps(type, props);
          var context = emptyContextObject,
            contextType = type.contextType;
          if (
            "contextType" in type &&
            null !== contextType &&
            (void 0 === contextType ||
              contextType.$$typeof !== REACT_CONTEXT_TYPE) &&
            !didWarnAboutInvalidateContextType.has(type)
          ) {
            didWarnAboutInvalidateContextType.add(type);
            var addendum =
              void 0 === contextType
                ? " However, it is set to undefined. This can be caused by a typo or by mixing up named and default imports. This can also happen due to a circular dependency, so try moving the createContext() call to a separate file."
                : "object" !== typeof contextType
                  ? " However, it is set to a " + typeof contextType + "."
                  : contextType.$$typeof === REACT_CONSUMER_TYPE
                    ? " Did you accidentally pass the Context.Consumer instead?"
                    : " However, it is set to an object with keys {" +
                      Object.keys(contextType).join(", ") +
                      "}.";
            console.error(
              "%s defines an invalid contextType. contextType should point to the Context object returned by React.createContext().%s",
              getComponentNameFromType(type) || "Component",
              addendum
            );
          }
          "object" === typeof contextType &&
            null !== contextType &&
            (context = contextType._currentValue2);
          context = new type(props, context);
          "function" !== typeof type.getDerivedStateFromProps ||
            (null !== context.state && void 0 !== context.state) ||
            ((contextType = getComponentNameFromType(type) || "Component"),
            didWarnAboutUninitializedState.has(contextType) ||
              (didWarnAboutUninitializedState.add(contextType),
              console.error(
                "`%s` uses `getDerivedStateFromProps` but its initial state is %s. This is not recommended. Instead, define the initial state by assigning an object to `this.state` in the constructor of `%s`. This ensures that `getDerivedStateFromProps` arguments have a consistent shape.",
                contextType,
                null === context.state ? "null" : "undefined",
                contextType
              )));
          if (
            "function" === typeof type.getDerivedStateFromProps ||
            "function" === typeof context.getSnapshotBeforeUpdate
          )
            if (
              ((ref = addendum = contextType = null),
              "function" === typeof context.componentWillMount &&
              !0 !== context.componentWillMount.__suppressDeprecationWarning
                ? (contextType = "componentWillMount")
                : "function" === typeof context.UNSAFE_componentWillMount &&
                  (contextType = "UNSAFE_componentWillMount"),
              "function" === typeof context.componentWillReceiveProps &&
              !0 !==
                context.componentWillReceiveProps.__suppressDeprecationWarning
                ? (addendum = "componentWillReceiveProps")
                : "function" ===
                    typeof context.UNSAFE_componentWillReceiveProps &&
                  (addendum = "UNSAFE_componentWillReceiveProps"),
              "function" === typeof context.componentWillUpdate &&
              !0 !== context.componentWillUpdate.__suppressDeprecationWarning
                ? (ref = "componentWillUpdate")
                : "function" === typeof context.UNSAFE_componentWillUpdate &&
                  (ref = "UNSAFE_componentWillUpdate"),
              null !== contextType || null !== addendum || null !== ref)
            ) {
              var _componentName =
                  getComponentNameFromType(type) || "Component",
                newApiName =
                  "function" === typeof type.getDerivedStateFromProps
                    ? "getDerivedStateFromProps()"
                    : "getSnapshotBeforeUpdate()";
              didWarnAboutLegacyLifecyclesAndDerivedState.has(_componentName) ||
                (didWarnAboutLegacyLifecyclesAndDerivedState.add(
                  _componentName
                ),
                console.error(
                  "Unsafe legacy lifecycles will not be called for components using new component APIs.\n\n%s uses %s but also contains the following legacy lifecycles:%s%s%s\n\nThe above lifecycles should be removed. Learn more about this warning here:\nhttps://react.dev/link/unsafe-component-lifecycles",
                  _componentName,
                  newApiName,
                  null !== contextType ? "\n  " + contextType : "",
                  null !== addendum ? "\n  " + addendum : "",
                  null !== ref ? "\n  " + ref : ""
                ));
            }
          contextType = getComponentNameFromType(type) || "Component";
          context.render ||
            (type.prototype && "function" === typeof type.prototype.render
              ? console.error(
                  "No `render` method found on the %s instance: did you accidentally return an object from the constructor?",
                  contextType
                )
              : console.error(
                  "No `render` method found on the %s instance: you may have forgotten to define `render`.",
                  contextType
                ));
          !context.getInitialState ||
            context.getInitialState.isReactClassApproved ||
            context.state ||
            console.error(
              "getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?",
              contextType
            );
          context.getDefaultProps &&
            !context.getDefaultProps.isReactClassApproved &&
            console.error(
              "getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.",
              contextType
            );
          context.contextType &&
            console.error(
              "contextType was defined as an instance property on %s. Use a static property to define contextType instead.",
              contextType
            );
          type.childContextTypes &&
            !didWarnAboutChildContextTypes.has(type) &&
            (didWarnAboutChildContextTypes.add(type),
            console.error(
              "%s uses the legacy childContextTypes API which was removed in React 19. Use React.createContext() instead. (https://react.dev/link/legacy-context)",
              contextType
            ));
          type.contextTypes &&
            !didWarnAboutContextTypes$1.has(type) &&
            (didWarnAboutContextTypes$1.add(type),
            console.error(
              "%s uses the legacy contextTypes API which was removed in React 19. Use React.createContext() with static contextType instead. (https://react.dev/link/legacy-context)",
              contextType
            ));
          "function" === typeof context.componentShouldUpdate &&
            console.error(
              "%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.",
              contextType
            );
          type.prototype &&
            type.prototype.isPureReactComponent &&
            "undefined" !== typeof context.shouldComponentUpdate &&
            console.error(
              "%s has a method called shouldComponentUpdate(). shouldComponentUpdate should not be used when extending React.PureComponent. Please extend React.Component if shouldComponentUpdate is used.",
              getComponentNameFromType(type) || "A pure component"
            );
          "function" === typeof context.componentDidUnmount &&
            console.error(
              "%s has a method called componentDidUnmount(). But there is no such lifecycle method. Did you mean componentWillUnmount()?",
              contextType
            );
          "function" === typeof context.componentDidReceiveProps &&
            console.error(
              "%s has a method called componentDidReceiveProps(). But there is no such lifecycle method. If you meant to update the state in response to changing props, use componentWillReceiveProps(). If you meant to fetch data or run side-effects or mutations after React has updated the UI, use componentDidUpdate().",
              contextType
            );
          "function" === typeof context.componentWillRecieveProps &&
            console.error(
              "%s has a method called componentWillRecieveProps(). Did you mean componentWillReceiveProps()?",
              contextType
            );
          "function" === typeof context.UNSAFE_componentWillRecieveProps &&
            console.error(
              "%s has a method called UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?",
              contextType
            );
          addendum = context.props !== props;
          void 0 !== context.props &&
            addendum &&
            console.error(
              "When calling super() in `%s`, make sure to pass up the same props that your component's constructor was passed.",
              contextType
            );
          context.defaultProps &&
            console.error(
              "Setting defaultProps as an instance property on %s is not supported and will be ignored. Instead, define defaultProps as a static property on %s.",
              contextType,
              contextType
            );
          "function" !== typeof context.getSnapshotBeforeUpdate ||
            "function" === typeof context.componentDidUpdate ||
            didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate.has(type) ||
            (didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate.add(type),
            console.error(
              "%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). This component defines getSnapshotBeforeUpdate() only.",
              getComponentNameFromType(type)
            ));
          "function" === typeof context.getDerivedStateFromProps &&
            console.error(
              "%s: getDerivedStateFromProps() is defined as an instance method and will be ignored. Instead, declare it as a static method.",
              contextType
            );
          "function" === typeof context.getDerivedStateFromError &&
            console.error(
              "%s: getDerivedStateFromError() is defined as an instance method and will be ignored. Instead, declare it as a static method.",
              contextType
            );
          "function" === typeof type.getSnapshotBeforeUpdate &&
            console.error(
              "%s: getSnapshotBeforeUpdate() is defined as a static method and will be ignored. Instead, declare it as an instance method.",
              contextType
            );
          (addendum = context.state) &&
            ("object" !== typeof addendum || isArrayImpl(addendum)) &&
            console.error(
              "%s.state: must be set to an object or null",
              contextType
            );
          "function" === typeof context.getChildContext &&
            "object" !== typeof type.childContextTypes &&
            console.error(
              "%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().",
              contextType
            );
          addendum = void 0 !== context.state ? context.state : null;
          context.updater = classComponentUpdater;
          context.props = props;
          context.state = addendum;
          contextType = { queue: [], replace: !1 };
          context._reactInternals = contextType;
          ref = type.contextType;
          context.context =
            "object" === typeof ref && null !== ref
              ? ref._currentValue2
              : emptyContextObject;
          context.state === props &&
            ((ref = getComponentNameFromType(type) || "Component"),
            didWarnAboutDirectlyAssigningPropsToState.has(ref) ||
              (didWarnAboutDirectlyAssigningPropsToState.add(ref),
              console.error(
                "%s: It is not recommended to assign props directly to state because updates to props won't be reflected in state. In most cases, it is better to use props directly.",
                ref
              )));
          ref = type.getDerivedStateFromProps;
          "function" === typeof ref &&
            ((ref = ref(props, addendum)),
            void 0 === ref &&
              ((_componentName = getComponentNameFromType(type) || "Component"),
              didWarnAboutUndefinedDerivedState.has(_componentName) ||
                (didWarnAboutUndefinedDerivedState.add(_componentName),
                console.error(
                  "%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. You have returned undefined.",
                  _componentName
                ))),
            (addendum =
              null === ref || void 0 === ref
                ? addendum
                : assign({}, addendum, ref)),
            (context.state = addendum));
          if (
            "function" !== typeof type.getDerivedStateFromProps &&
            "function" !== typeof context.getSnapshotBeforeUpdate &&
            ("function" === typeof context.UNSAFE_componentWillMount ||
              "function" === typeof context.componentWillMount)
          )
            if (
              ((addendum = context.state),
              "function" === typeof context.componentWillMount &&
                (!0 !==
                  context.componentWillMount.__suppressDeprecationWarning &&
                  ((ref = getComponentNameFromType(type) || "Unknown"),
                  didWarnAboutDeprecatedWillMount[ref] ||
                    (console.warn(
                      "componentWillMount has been renamed, and is not recommended for use. See https://react.dev/link/unsafe-component-lifecycles for details.\n\n* Move code from componentWillMount to componentDidMount (preferred in most cases) or the constructor.\n\nPlease update the following components: %s",
                      ref
                    ),
                    (didWarnAboutDeprecatedWillMount[ref] = !0))),
                context.componentWillMount()),
              "function" === typeof context.UNSAFE_componentWillMount &&
                context.UNSAFE_componentWillMount(),
              addendum !== context.state &&
                (console.error(
                  "%s.componentWillMount(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.",
                  getComponentNameFromType(type) || "Component"
                ),
                classComponentUpdater.enqueueReplaceState(
                  context,
                  context.state,
                  null
                )),
              null !== contextType.queue && 0 < contextType.queue.length)
            )
              if (
                ((addendum = contextType.queue),
                (_componentName = contextType.replace),
                (contextType.queue = null),
                (contextType.replace = !1),
                _componentName && 1 === addendum.length)
              )
                context.state = addendum[0];
              else {
                contextType = _componentName ? addendum[0] : context.state;
                ref = !0;
                for (
                  _componentName = _componentName ? 1 : 0;
                  _componentName < addendum.length;
                  _componentName++
                )
                  (newApiName = addendum[_componentName]),
                    (newApiName =
                      "function" === typeof newApiName
                        ? newApiName.call(context, contextType, props, void 0)
                        : newApiName),
                    null != newApiName &&
                      (ref
                        ? ((ref = !1),
                          (contextType = assign({}, contextType, newApiName)))
                        : assign(contextType, newApiName));
                context.state = contextType;
              }
            else contextType.queue = null;
          contextType = callRenderInDEV(context);
          if (12 === request.status) throw null;
          context.props !== props &&
            (didWarnAboutReassigningProps ||
              console.error(
                "It looks like %s is reassigning its own `this.props` while rendering. This is not supported and can lead to confusing bugs.",
                getComponentNameFromType(type) || "a component"
              ),
            (didWarnAboutReassigningProps = !0));
          type = task.keyPath;
          task.keyPath = keyPath;
          renderNodeDestructive(request, task, contextType, -1);
          task.keyPath = type;
        } else {
          type.prototype &&
            "function" === typeof type.prototype.render &&
            ((context = getComponentNameFromType(type) || "Unknown"),
            didWarnAboutBadClass[context] ||
              (console.error(
                "The <%s /> component appears to have a render method, but doesn't extend React.Component. This is likely to cause errors. Change %s to extend React.Component instead.",
                context,
                context
              ),
              (didWarnAboutBadClass[context] = !0)));
          props = renderWithHooks(request, task, keyPath, type, props, void 0);
          if (12 === request.status) throw null;
          context = 0 !== localIdCounter;
          contextType = actionStateCounter;
          addendum = actionStateMatchingIndex;
          type.contextTypes &&
            ((ref = getComponentNameFromType(type) || "Unknown"),
            didWarnAboutContextTypes[ref] ||
              ((didWarnAboutContextTypes[ref] = !0),
              console.error(
                "%s uses the legacy contextTypes API which was removed in React 19. Use React.createContext() with React.useContext() instead. (https://react.dev/link/legacy-context)",
                ref
              )));
          type &&
            type.childContextTypes &&
            console.error(
              "childContextTypes cannot be defined on a function component.\n  %s.childContextTypes = ...",
              type.displayName || type.name || "Component"
            );
          "function" === typeof type.getDerivedStateFromProps &&
            ((ref = getComponentNameFromType(type) || "Unknown"),
            didWarnAboutGetDerivedStateOnFunctionComponent[ref] ||
              (console.error(
                "%s: Function components do not support getDerivedStateFromProps.",
                ref
              ),
              (didWarnAboutGetDerivedStateOnFunctionComponent[ref] = !0)));
          "object" === typeof type.contextType &&
            null !== type.contextType &&
            ((type = getComponentNameFromType(type) || "Unknown"),
            didWarnAboutContextTypeOnFunctionComponent[type] ||
              (console.error(
                "%s: Function components do not support contextType.",
                type
              ),
              (didWarnAboutContextTypeOnFunctionComponent[type] = !0)));
          finishFunctionComponent(
            request,
            task,
            keyPath,
            props,
            context,
            contextType,
            addendum
          );
        }
      else if ("string" === typeof type)
        (context = task.blockedSegment),
          null === context
            ? ((context = props.children),
              (contextType = task.formatContext),
              (addendum = task.keyPath),
              (task.formatContext = getChildFormatContext(
                contextType,
                type,
                props
              )),
              (task.keyPath = keyPath),
              renderNode(request, task, context, -1),
              (task.formatContext = contextType),
              (task.keyPath = addendum))
            : ((contextType = pushStartInstance(
                context.chunks,
                type,
                props,
                request.resumableState,
                request.renderState,
                task.hoistableState,
                task.formatContext,
                context.lastPushedText,
                task.isFallback
              )),
              (context.lastPushedText = !1),
              (addendum = task.formatContext),
              (ref = task.keyPath),
              (task.formatContext = getChildFormatContext(
                addendum,
                type,
                props
              )),
              (task.keyPath = keyPath),
              renderNode(request, task, contextType, -1),
              (task.formatContext = addendum),
              (task.keyPath = ref),
              pushEndInstance(
                context.chunks,
                type,
                props,
                request.resumableState,
                addendum
              ),
              (context.lastPushedText = !1));
      else {
        switch (type) {
          case REACT_LEGACY_HIDDEN_TYPE:
          case REACT_DEBUG_TRACING_MODE_TYPE:
          case REACT_STRICT_MODE_TYPE:
          case REACT_PROFILER_TYPE:
          case REACT_FRAGMENT_TYPE:
            type = task.keyPath;
            task.keyPath = keyPath;
            renderNodeDestructive(request, task, props.children, -1);
            task.keyPath = type;
            return;
          case REACT_OFFSCREEN_TYPE:
            "hidden" !== props.mode &&
              ((type = task.keyPath),
              (task.keyPath = keyPath),
              renderNodeDestructive(request, task, props.children, -1),
              (task.keyPath = type));
            return;
          case REACT_SUSPENSE_LIST_TYPE:
            type = task.keyPath;
            task.keyPath = keyPath;
            renderNodeDestructive(request, task, props.children, -1);
            task.keyPath = type;
            return;
          case REACT_SCOPE_TYPE:
            throw Error(
              "ReactDOMServer does not yet support scope components."
            );
          case REACT_SUSPENSE_TYPE:
            a: if (null !== task.replay) {
              type = task.keyPath;
              task.keyPath = keyPath;
              keyPath = props.children;
              try {
                renderNode(request, task, keyPath, -1);
              } finally {
                task.keyPath = type;
              }
            } else {
              type = task.keyPath;
              var parentBoundary = task.blockedBoundary,
                parentHoistableState = task.hoistableState;
              ref = task.blockedSegment;
              _componentName = props.fallback;
              props = props.children;
              var fallbackAbortSet = new Set();
              newApiName = createSuspenseBoundary(request, fallbackAbortSet);
              null !== request.trackedPostpones &&
                (newApiName.trackedContentKeyPath = keyPath);
              var boundarySegment = createPendingSegment(
                request,
                ref.chunks.length,
                newApiName,
                task.formatContext,
                !1,
                !1
              );
              ref.children.push(boundarySegment);
              ref.lastPushedText = !1;
              var contentRootSegment = createPendingSegment(
                request,
                0,
                null,
                task.formatContext,
                !1,
                !1
              );
              contentRootSegment.parentFlushed = !0;
              if (null !== request.trackedPostpones) {
                context = [keyPath[0], "Suspense Fallback", keyPath[2]];
                contextType = [context[1], context[2], [], null];
                request.trackedPostpones.workingMap.set(context, contextType);
                newApiName.trackedFallbackNode = contextType;
                task.blockedSegment = boundarySegment;
                task.keyPath = context;
                boundarySegment.status = 6;
                try {
                  renderNode(request, task, _componentName, -1),
                    pushSegmentFinale(
                      boundarySegment.chunks,
                      request.renderState,
                      boundarySegment.lastPushedText,
                      boundarySegment.textEmbedded
                    ),
                    (boundarySegment.status = 1);
                } catch (thrownValue) {
                  throw (
                    ((boundarySegment.status = 12 === request.status ? 3 : 4),
                    thrownValue)
                  );
                } finally {
                  (task.blockedSegment = ref), (task.keyPath = type);
                }
                task = createRenderTask(
                  request,
                  null,
                  props,
                  -1,
                  newApiName,
                  contentRootSegment,
                  newApiName.contentState,
                  task.abortSet,
                  keyPath,
                  task.formatContext,
                  task.context,
                  task.treeContext,
                  task.componentStack,
                  task.isFallback
                );
                pushComponentStack(task);
                request.pingedTasks.push(task);
              } else {
                task.blockedBoundary = newApiName;
                task.hoistableState = newApiName.contentState;
                task.blockedSegment = contentRootSegment;
                task.keyPath = keyPath;
                contentRootSegment.status = 6;
                try {
                  if (
                    (renderNode(request, task, props, -1),
                    pushSegmentFinale(
                      contentRootSegment.chunks,
                      request.renderState,
                      contentRootSegment.lastPushedText,
                      contentRootSegment.textEmbedded
                    ),
                    (contentRootSegment.status = 1),
                    queueCompletedSegment(newApiName, contentRootSegment),
                    0 === newApiName.pendingTasks && 0 === newApiName.status)
                  ) {
                    newApiName.status = 1;
                    break a;
                  }
                } catch (thrownValue$2) {
                  (newApiName.status = 4),
                    12 === request.status
                      ? ((contentRootSegment.status = 3),
                        (context = request.fatalError))
                      : ((contentRootSegment.status = 4),
                        (context = thrownValue$2)),
                    (contextType = getThrownInfo(task.componentStack)),
                    (addendum = logRecoverableError(
                      request,
                      context,
                      contextType
                    )),
                    encodeErrorForBoundary(
                      newApiName,
                      addendum,
                      context,
                      contextType,
                      !1
                    ),
                    untrackBoundary(request, newApiName);
                } finally {
                  (task.blockedBoundary = parentBoundary),
                    (task.hoistableState = parentHoistableState),
                    (task.blockedSegment = ref),
                    (task.keyPath = type);
                }
                task = createRenderTask(
                  request,
                  null,
                  _componentName,
                  -1,
                  parentBoundary,
                  boundarySegment,
                  newApiName.fallbackState,
                  fallbackAbortSet,
                  [keyPath[0], "Suspense Fallback", keyPath[2]],
                  task.formatContext,
                  task.context,
                  task.treeContext,
                  task.componentStack,
                  !0
                );
                pushComponentStack(task);
                request.pingedTasks.push(task);
              }
            }
            return;
        }
        if ("object" === typeof type && null !== type)
          switch (type.$$typeof) {
            case REACT_FORWARD_REF_TYPE:
              if ("ref" in props)
                for (_componentName in ((context = {}), props))
                  "ref" !== _componentName &&
                    (context[_componentName] = props[_componentName]);
              else context = props;
              type = renderWithHooks(
                request,
                task,
                keyPath,
                type.render,
                context,
                ref
              );
              finishFunctionComponent(
                request,
                task,
                keyPath,
                type,
                0 !== localIdCounter,
                actionStateCounter,
                actionStateMatchingIndex
              );
              return;
            case REACT_MEMO_TYPE:
              renderElement(request, task, keyPath, type.type, props, ref);
              return;
            case REACT_PROVIDER_TYPE:
            case REACT_CONTEXT_TYPE:
              contextType = props.value;
              addendum = props.children;
              props = task.context;
              context = task.keyPath;
              ref = type._currentValue2;
              type._currentValue2 = contextType;
              void 0 !== type._currentRenderer2 &&
                null !== type._currentRenderer2 &&
                type._currentRenderer2 !== rendererSigil &&
                console.error(
                  "Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported."
                );
              type._currentRenderer2 = rendererSigil;
              _componentName = currentActiveSnapshot;
              currentActiveSnapshot = contextType = {
                parent: _componentName,
                depth: null === _componentName ? 0 : _componentName.depth + 1,
                context: type,
                parentValue: ref,
                value: contextType
              };
              task.context = contextType;
              task.keyPath = keyPath;
              renderNodeDestructive(request, task, addendum, -1);
              request = currentActiveSnapshot;
              if (null === request)
                throw Error(
                  "Tried to pop a Context at the root of the app. This is a bug in React."
                );
              request.context !== type &&
                console.error(
                  "The parent context is not the expected context. This is probably a bug in React."
                );
              request.context._currentValue2 = request.parentValue;
              void 0 !== type._currentRenderer2 &&
                null !== type._currentRenderer2 &&
                type._currentRenderer2 !== rendererSigil &&
                console.error(
                  "Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported."
                );
              type._currentRenderer2 = rendererSigil;
              request = currentActiveSnapshot = request.parent;
              task.context = request;
              task.keyPath = context;
              props !== task.context &&
                console.error(
                  "Popping the context provider did not return back to the original snapshot. This is a bug in React."
                );
              return;
            case REACT_CONSUMER_TYPE:
              type = type._context;
              props = props.children;
              "function" !== typeof props &&
                console.error(
                  "A context consumer was rendered with multiple children, or a child that isn't a function. A context consumer expects a single child that is a function. If you did pass a function, make sure there is no trailing or leading whitespace around it."
                );
              type = props(type._currentValue2);
              props = task.keyPath;
              task.keyPath = keyPath;
              renderNodeDestructive(request, task, type, -1);
              task.keyPath = props;
              return;
            case REACT_LAZY_TYPE:
              type = callLazyInitInDEV(type);
              if (12 === request.status) throw null;
              renderElement(request, task, keyPath, type, props, ref);
              return;
          }
        request = "";
        if (
          void 0 === type ||
          ("object" === typeof type &&
            null !== type &&
            0 === Object.keys(type).length)
        )
          request +=
            " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.";
        throw Error(
          "Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: " +
            ((null == type ? type : typeof type) + "." + request)
        );
      }
    }
    function resumeNode(request, task, segmentId, node, childIndex) {
      var prevReplay = task.replay,
        blockedBoundary = task.blockedBoundary,
        resumedSegment = createPendingSegment(
          request,
          0,
          null,
          task.formatContext,
          !1,
          !1
        );
      resumedSegment.id = segmentId;
      resumedSegment.parentFlushed = !0;
      try {
        (task.replay = null),
          (task.blockedSegment = resumedSegment),
          renderNode(request, task, node, childIndex),
          (resumedSegment.status = 1),
          null === blockedBoundary
            ? (request.completedRootSegment = resumedSegment)
            : (queueCompletedSegment(blockedBoundary, resumedSegment),
              blockedBoundary.parentFlushed &&
                request.partialBoundaries.push(blockedBoundary));
      } finally {
        (task.replay = prevReplay), (task.blockedSegment = null);
      }
    }
    function renderNodeDestructive(request, task, node, childIndex) {
      null !== task.replay && "number" === typeof task.replay.slots
        ? resumeNode(request, task, task.replay.slots, node, childIndex)
        : ((task.node = node),
          (task.childIndex = childIndex),
          (node = task.componentStack),
          pushComponentStack(task),
          retryNode(request, task),
          (task.componentStack = node));
    }
    function retryNode(request, task) {
      var node = task.node,
        childIndex = task.childIndex;
      if (null !== node) {
        if ("object" === typeof node) {
          switch (node.$$typeof) {
            case REACT_ELEMENT_TYPE:
              var type = node.type,
                key = node.key,
                props = node.props;
              node = props.ref;
              var ref = void 0 !== node ? node : null,
                name = getComponentNameFromType(type),
                keyOrIndex =
                  null == key ? (-1 === childIndex ? 0 : childIndex) : key,
                keyPath = [task.keyPath, name, keyOrIndex];
              if (null !== task.replay) {
                var replay = task.replay;
                childIndex = replay.nodes;
                for (node = 0; node < childIndex.length; node++)
                  if (((key = childIndex[node]), keyOrIndex === key[1])) {
                    if (4 === key.length) {
                      if (null !== name && name !== key[0])
                        throw Error(
                          "Expected the resume to render <" +
                            key[0] +
                            "> in this slot but instead it rendered <" +
                            name +
                            ">. The tree doesn't match so React will fallback to client rendering."
                        );
                      var childNodes = key[2];
                      key = key[3];
                      name = task.node;
                      task.replay = {
                        nodes: childNodes,
                        slots: key,
                        pendingTasks: 1
                      };
                      try {
                        renderElement(request, task, keyPath, type, props, ref);
                        if (
                          1 === task.replay.pendingTasks &&
                          0 < task.replay.nodes.length
                        )
                          throw Error(
                            "Couldn't find all resumable slots by key/index during replaying. The tree doesn't match so React will fallback to client rendering."
                          );
                        task.replay.pendingTasks--;
                      } catch (x) {
                        if (
                          "object" === typeof x &&
                          null !== x &&
                          (x === SuspenseException ||
                            "function" === typeof x.then)
                        )
                          throw (
                            (task.node === name && (task.replay = replay), x)
                          );
                        task.replay.pendingTasks--;
                        props = getThrownInfo(task.componentStack);
                        erroredReplay(
                          request,
                          task.blockedBoundary,
                          x,
                          props,
                          childNodes,
                          key
                        );
                      }
                      task.replay = replay;
                    } else {
                      if (type !== REACT_SUSPENSE_TYPE)
                        throw Error(
                          "Expected the resume to render <Suspense> in this slot but instead it rendered <" +
                            (getComponentNameFromType(type) || "Unknown") +
                            ">. The tree doesn't match so React will fallback to client rendering."
                        );
                      a: {
                        type = void 0;
                        ref = key[5];
                        replay = key[2];
                        name = key[3];
                        keyOrIndex = null === key[4] ? [] : key[4][2];
                        key = null === key[4] ? null : key[4][3];
                        var prevKeyPath = task.keyPath,
                          previousReplaySet = task.replay,
                          parentBoundary = task.blockedBoundary,
                          parentHoistableState = task.hoistableState,
                          content = props.children;
                        props = props.fallback;
                        var fallbackAbortSet = new Set(),
                          resumedBoundary = createSuspenseBoundary(
                            request,
                            fallbackAbortSet
                          );
                        resumedBoundary.parentFlushed = !0;
                        resumedBoundary.rootSegmentID = ref;
                        task.blockedBoundary = resumedBoundary;
                        task.hoistableState = resumedBoundary.contentState;
                        task.keyPath = keyPath;
                        task.replay = {
                          nodes: replay,
                          slots: name,
                          pendingTasks: 1
                        };
                        try {
                          renderNode(request, task, content, -1);
                          if (
                            1 === task.replay.pendingTasks &&
                            0 < task.replay.nodes.length
                          )
                            throw Error(
                              "Couldn't find all resumable slots by key/index during replaying. The tree doesn't match so React will fallback to client rendering."
                            );
                          task.replay.pendingTasks--;
                          if (
                            0 === resumedBoundary.pendingTasks &&
                            0 === resumedBoundary.status
                          ) {
                            resumedBoundary.status = 1;
                            request.completedBoundaries.push(resumedBoundary);
                            break a;
                          }
                        } catch (error) {
                          (resumedBoundary.status = 4),
                            (childNodes = getThrownInfo(task.componentStack)),
                            (type = logRecoverableError(
                              request,
                              error,
                              childNodes
                            )),
                            encodeErrorForBoundary(
                              resumedBoundary,
                              type,
                              error,
                              childNodes,
                              !1
                            ),
                            task.replay.pendingTasks--,
                            request.clientRenderedBoundaries.push(
                              resumedBoundary
                            );
                        } finally {
                          (task.blockedBoundary = parentBoundary),
                            (task.hoistableState = parentHoistableState),
                            (task.replay = previousReplaySet),
                            (task.keyPath = prevKeyPath);
                        }
                        childNodes = createReplayTask(
                          request,
                          null,
                          { nodes: keyOrIndex, slots: key, pendingTasks: 0 },
                          props,
                          -1,
                          parentBoundary,
                          resumedBoundary.fallbackState,
                          fallbackAbortSet,
                          [keyPath[0], "Suspense Fallback", keyPath[2]],
                          task.formatContext,
                          task.context,
                          task.treeContext,
                          task.componentStack,
                          !0
                        );
                        pushComponentStack(childNodes);
                        request.pingedTasks.push(childNodes);
                      }
                    }
                    childIndex.splice(node, 1);
                    break;
                  }
              } else renderElement(request, task, keyPath, type, props, ref);
              return;
            case REACT_PORTAL_TYPE:
              throw Error(
                "Portals are not currently supported by the server renderer. Render them conditionally so that they only appear on the client render."
              );
            case REACT_LAZY_TYPE:
              node = callLazyInitInDEV(node);
              if (12 === request.status) throw null;
              renderNodeDestructive(request, task, node, childIndex);
              return;
          }
          if (isArrayImpl(node)) {
            renderChildrenArray(request, task, node, childIndex);
            return;
          }
          null === node || "object" !== typeof node
            ? (props = null)
            : ((childNodes =
                (MAYBE_ITERATOR_SYMBOL && node[MAYBE_ITERATOR_SYMBOL]) ||
                node["@@iterator"]),
              (props = "function" === typeof childNodes ? childNodes : null));
          if (props && (childNodes = props.call(node))) {
            if (childNodes === node) {
              if (
                -1 !== childIndex ||
                null === task.componentStack ||
                "function" !== typeof task.componentStack.type ||
                "[object GeneratorFunction]" !==
                  Object.prototype.toString.call(task.componentStack.type) ||
                "[object Generator]" !==
                  Object.prototype.toString.call(childNodes)
              )
                didWarnAboutGenerators ||
                  console.error(
                    "Using Iterators as children is unsupported and will likely yield unexpected results because enumerating a generator mutates it. You may convert it to an array with `Array.from()` or the `[...spread]` operator before rendering. You can also use an Iterable that can iterate multiple times over the same items."
                  ),
                  (didWarnAboutGenerators = !0);
            } else
              node.entries !== props ||
                didWarnAboutMaps ||
                (console.error(
                  "Using Maps as children is not supported. Use an array of keyed ReactElements instead."
                ),
                (didWarnAboutMaps = !0));
            node = childNodes.next();
            if (!node.done) {
              props = [];
              do props.push(node.value), (node = childNodes.next());
              while (!node.done);
              renderChildrenArray(request, task, props, childIndex);
            }
            return;
          }
          if ("function" === typeof node.then)
            return (
              (task.thenableState = null),
              renderNodeDestructive(
                request,
                task,
                unwrapThenable(node),
                childIndex
              )
            );
          if (node.$$typeof === REACT_CONTEXT_TYPE)
            return renderNodeDestructive(
              request,
              task,
              node._currentValue2,
              childIndex
            );
          childIndex = Object.prototype.toString.call(node);
          throw Error(
            "Objects are not valid as a React child (found: " +
              ("[object Object]" === childIndex
                ? "object with keys {" + Object.keys(node).join(", ") + "}"
                : childIndex) +
              "). If you meant to render a collection of children, use an array instead."
          );
        }
        "string" === typeof node
          ? ((childIndex = task.blockedSegment),
            null !== childIndex &&
              (childIndex.lastPushedText = pushTextInstance(
                childIndex.chunks,
                node,
                request.renderState,
                childIndex.lastPushedText
              )))
          : "number" === typeof node || "bigint" === typeof node
            ? ((childIndex = task.blockedSegment),
              null !== childIndex &&
                (childIndex.lastPushedText = pushTextInstance(
                  childIndex.chunks,
                  "" + node,
                  request.renderState,
                  childIndex.lastPushedText
                )))
            : ("function" === typeof node &&
                ((childIndex = node.displayName || node.name || "Component"),
                console.error(
                  "Functions are not valid as a React child. This may happen if you return %s instead of <%s /> from render. Or maybe you meant to call this function rather than return it.",
                  childIndex,
                  childIndex
                )),
              "symbol" === typeof node &&
                console.error(
                  "Symbols are not valid as a React child.\n  %s",
                  String(node)
                ));
      }
    }
    function renderChildrenArray(request$jscomp$0, task, children, childIndex) {
      var prevKeyPath = task.keyPath,
        previousComponentStack = task.componentStack;
      pushServerComponentStack(task, task.node._debugInfo);
      if (
        -1 !== childIndex &&
        ((task.keyPath = [task.keyPath, "Fragment", childIndex]),
        null !== task.replay)
      ) {
        for (
          var replay = task.replay, replayNodes = replay.nodes, j = 0;
          j < replayNodes.length;
          j++
        ) {
          var node = replayNodes[j];
          if (node[1] === childIndex) {
            childIndex = node[2];
            node = node[3];
            task.replay = { nodes: childIndex, slots: node, pendingTasks: 1 };
            try {
              renderChildrenArray(request$jscomp$0, task, children, -1);
              if (
                1 === task.replay.pendingTasks &&
                0 < task.replay.nodes.length
              )
                throw Error(
                  "Couldn't find all resumable slots by key/index during replaying. The tree doesn't match so React will fallback to client rendering."
                );
              task.replay.pendingTasks--;
            } catch (x) {
              if (
                "object" === typeof x &&
                null !== x &&
                (x === SuspenseException || "function" === typeof x.then)
              )
                throw x;
              task.replay.pendingTasks--;
              children = getThrownInfo(task.componentStack);
              erroredReplay(
                request$jscomp$0,
                task.blockedBoundary,
                x,
                children,
                childIndex,
                node
              );
            }
            task.replay = replay;
            replayNodes.splice(j, 1);
            break;
          }
        }
        task.keyPath = prevKeyPath;
        task.componentStack = previousComponentStack;
        return;
      }
      replay = task.treeContext;
      replayNodes = children.length;
      if (
        null !== task.replay &&
        ((j = task.replay.slots), null !== j && "object" === typeof j)
      ) {
        for (childIndex = 0; childIndex < replayNodes; childIndex++) {
          node = children[childIndex];
          task.treeContext = pushTreeContext(replay, replayNodes, childIndex);
          var resumeSegmentID = j[childIndex];
          "number" === typeof resumeSegmentID
            ? (resumeNode(
                request$jscomp$0,
                task,
                resumeSegmentID,
                node,
                childIndex
              ),
              delete j[childIndex])
            : renderNode(request$jscomp$0, task, node, childIndex);
        }
        task.treeContext = replay;
        task.keyPath = prevKeyPath;
        task.componentStack = previousComponentStack;
        return;
      }
      for (j = 0; j < replayNodes; j++) {
        childIndex = children[j];
        var request = request$jscomp$0;
        node = task;
        resumeSegmentID = childIndex;
        if (
          null !== resumeSegmentID &&
          "object" === typeof resumeSegmentID &&
          (resumeSegmentID.$$typeof === REACT_ELEMENT_TYPE ||
            resumeSegmentID.$$typeof === REACT_PORTAL_TYPE) &&
          resumeSegmentID._store &&
          ((!resumeSegmentID._store.validated && null == resumeSegmentID.key) ||
            2 === resumeSegmentID._store.validated)
        ) {
          if ("object" !== typeof resumeSegmentID._store)
            throw Error(
              "React Component in warnForMissingKey should have a _store. This error is likely caused by a bug in React. Please file an issue."
            );
          resumeSegmentID._store.validated = 1;
          var didWarnForKey = request.didWarnForKey;
          null == didWarnForKey &&
            (didWarnForKey = request.didWarnForKey = new WeakSet());
          request = node.componentStack;
          if (null !== request && !didWarnForKey.has(request)) {
            didWarnForKey.add(request);
            var componentName = getComponentNameFromType(resumeSegmentID.type);
            didWarnForKey = resumeSegmentID._owner;
            var parentOwner = request.owner;
            request = "";
            if (parentOwner && "undefined" !== typeof parentOwner.type) {
              var name = getComponentNameFromType(parentOwner.type);
              name &&
                (request = "\n\nCheck the render method of `" + name + "`.");
            }
            request ||
              (componentName &&
                (request =
                  "\n\nCheck the top-level render call using <" +
                  componentName +
                  ">."));
            componentName = "";
            null != didWarnForKey &&
              parentOwner !== didWarnForKey &&
              ((parentOwner = null),
              "undefined" !== typeof didWarnForKey.type
                ? (parentOwner = getComponentNameFromType(didWarnForKey.type))
                : "string" === typeof didWarnForKey.name &&
                  (parentOwner = didWarnForKey.name),
              parentOwner &&
                (componentName =
                  " It was passed a child from " + parentOwner + "."));
            didWarnForKey = node.componentStack;
            node.componentStack = {
              parent: node.componentStack,
              type: resumeSegmentID.type,
              owner: resumeSegmentID._owner,
              stack: null
            };
            console.error(
              'Each child in a list should have a unique "key" prop.%s%s See https://react.dev/link/warning-keys for more information.',
              request,
              componentName
            );
            node.componentStack = didWarnForKey;
          }
        }
        task.treeContext = pushTreeContext(replay, replayNodes, j);
        renderNode(request$jscomp$0, task, childIndex, j);
      }
      task.treeContext = replay;
      task.keyPath = prevKeyPath;
      task.componentStack = previousComponentStack;
    }
    function untrackBoundary(request, boundary) {
      request = request.trackedPostpones;
      null !== request &&
        ((boundary = boundary.trackedContentKeyPath),
        null !== boundary &&
          ((boundary = request.workingMap.get(boundary)),
          void 0 !== boundary &&
            ((boundary.length = 4), (boundary[2] = []), (boundary[3] = null))));
    }
    function spawnNewSuspendedReplayTask(request, task, thenableState) {
      return createReplayTask(
        request,
        thenableState,
        task.replay,
        task.node,
        task.childIndex,
        task.blockedBoundary,
        task.hoistableState,
        task.abortSet,
        task.keyPath,
        task.formatContext,
        task.context,
        task.treeContext,
        task.componentStack,
        task.isFallback
      );
    }
    function spawnNewSuspendedRenderTask(request, task, thenableState) {
      var segment = task.blockedSegment,
        newSegment = createPendingSegment(
          request,
          segment.chunks.length,
          null,
          task.formatContext,
          segment.lastPushedText,
          !0
        );
      segment.children.push(newSegment);
      segment.lastPushedText = !1;
      return createRenderTask(
        request,
        thenableState,
        task.node,
        task.childIndex,
        task.blockedBoundary,
        newSegment,
        task.hoistableState,
        task.abortSet,
        task.keyPath,
        task.formatContext,
        task.context,
        task.treeContext,
        task.componentStack,
        task.isFallback
      );
    }
    function renderNode(request, task, node, childIndex) {
      var previousFormatContext = task.formatContext,
        previousContext = task.context,
        previousKeyPath = task.keyPath,
        previousTreeContext = task.treeContext,
        previousComponentStack = task.componentStack,
        segment = task.blockedSegment;
      if (null === segment)
        try {
          return renderNodeDestructive(request, task, node, childIndex);
        } catch (thrownValue) {
          if (
            (resetHooksState(),
            (node =
              thrownValue === SuspenseException
                ? getSuspendedThenable()
                : thrownValue),
            "object" === typeof node && null !== node)
          ) {
            if ("function" === typeof node.then) {
              childIndex = getThenableStateAfterSuspending();
              request = spawnNewSuspendedReplayTask(
                request,
                task,
                childIndex
              ).ping;
              node.then(request, request);
              task.formatContext = previousFormatContext;
              task.context = previousContext;
              task.keyPath = previousKeyPath;
              task.treeContext = previousTreeContext;
              task.componentStack = previousComponentStack;
              switchContext(previousContext);
              return;
            }
            if ("Maximum call stack size exceeded" === node.message) {
              node = getThenableStateAfterSuspending();
              node = spawnNewSuspendedReplayTask(request, task, node);
              request.pingedTasks.push(node);
              task.formatContext = previousFormatContext;
              task.context = previousContext;
              task.keyPath = previousKeyPath;
              task.treeContext = previousTreeContext;
              task.componentStack = previousComponentStack;
              switchContext(previousContext);
              return;
            }
          }
        }
      else {
        var childrenLength = segment.children.length,
          chunkLength = segment.chunks.length;
        try {
          return renderNodeDestructive(request, task, node, childIndex);
        } catch (thrownValue$3) {
          if (
            (resetHooksState(),
            (segment.children.length = childrenLength),
            (segment.chunks.length = chunkLength),
            (node =
              thrownValue$3 === SuspenseException
                ? getSuspendedThenable()
                : thrownValue$3),
            "object" === typeof node && null !== node)
          ) {
            if ("function" === typeof node.then) {
              childIndex = getThenableStateAfterSuspending();
              request = spawnNewSuspendedRenderTask(
                request,
                task,
                childIndex
              ).ping;
              node.then(request, request);
              task.formatContext = previousFormatContext;
              task.context = previousContext;
              task.keyPath = previousKeyPath;
              task.treeContext = previousTreeContext;
              task.componentStack = previousComponentStack;
              switchContext(previousContext);
              return;
            }
            if ("Maximum call stack size exceeded" === node.message) {
              node = getThenableStateAfterSuspending();
              node = spawnNewSuspendedRenderTask(request, task, node);
              request.pingedTasks.push(node);
              task.formatContext = previousFormatContext;
              task.context = previousContext;
              task.keyPath = previousKeyPath;
              task.treeContext = previousTreeContext;
              task.componentStack = previousComponentStack;
              switchContext(previousContext);
              return;
            }
          }
        }
      }
      task.formatContext = previousFormatContext;
      task.context = previousContext;
      task.keyPath = previousKeyPath;
      task.treeContext = previousTreeContext;
      switchContext(previousContext);
      throw node;
    }
    function erroredReplay(
      request,
      boundary,
      error,
      errorInfo,
      replayNodes,
      resumeSlots
    ) {
      var errorDigest = logRecoverableError(request, error, errorInfo);
      abortRemainingReplayNodes(
        request,
        boundary,
        replayNodes,
        resumeSlots,
        error,
        errorDigest,
        errorInfo,
        !1
      );
    }
    function abortTaskSoft(task) {
      var boundary = task.blockedBoundary;
      task = task.blockedSegment;
      null !== task && ((task.status = 3), finishedTask(this, boundary, task));
    }
    function abortRemainingReplayNodes(
      request$jscomp$0,
      boundary,
      nodes,
      slots,
      error$jscomp$0,
      errorDigest$jscomp$0,
      errorInfo$jscomp$0,
      aborted
    ) {
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (4 === node.length)
          abortRemainingReplayNodes(
            request$jscomp$0,
            boundary,
            node[2],
            node[3],
            error$jscomp$0,
            errorDigest$jscomp$0,
            errorInfo$jscomp$0,
            aborted
          );
        else {
          var request = request$jscomp$0;
          node = node[5];
          var error = error$jscomp$0,
            errorDigest = errorDigest$jscomp$0,
            errorInfo = errorInfo$jscomp$0,
            wasAborted = aborted,
            resumedBoundary = createSuspenseBoundary(request, new Set());
          resumedBoundary.parentFlushed = !0;
          resumedBoundary.rootSegmentID = node;
          resumedBoundary.status = 4;
          encodeErrorForBoundary(
            resumedBoundary,
            errorDigest,
            error,
            errorInfo,
            wasAborted
          );
          resumedBoundary.parentFlushed &&
            request.clientRenderedBoundaries.push(resumedBoundary);
        }
      }
      nodes.length = 0;
      if (null !== slots) {
        if (null === boundary)
          throw Error(
            "We should not have any resumable nodes in the shell. This is a bug in React."
          );
        4 !== boundary.status &&
          ((boundary.status = 4),
          encodeErrorForBoundary(
            boundary,
            errorDigest$jscomp$0,
            error$jscomp$0,
            errorInfo$jscomp$0,
            aborted
          ),
          boundary.parentFlushed &&
            request$jscomp$0.clientRenderedBoundaries.push(boundary));
        if ("object" === typeof slots)
          for (var index in slots) delete slots[index];
      }
    }
    function abortTask(task, request, error) {
      var boundary = task.blockedBoundary,
        segment = task.blockedSegment;
      if (null !== segment) {
        if (6 === segment.status) return;
        segment.status = 3;
      }
      segment = getThrownInfo(task.componentStack);
      if (null === boundary) {
        if (13 !== request.status && 14 !== request.status) {
          boundary = task.replay;
          if (null === boundary) {
            logRecoverableError(request, error, segment);
            fatalError(request, error);
            return;
          }
          boundary.pendingTasks--;
          0 === boundary.pendingTasks &&
            0 < boundary.nodes.length &&
            ((task = logRecoverableError(request, error, segment)),
            abortRemainingReplayNodes(
              request,
              null,
              boundary.nodes,
              boundary.slots,
              error,
              task,
              segment,
              !0
            ));
          request.pendingRootTasks--;
          0 === request.pendingRootTasks && completeShell(request);
        }
      } else
        boundary.pendingTasks--,
          4 !== boundary.status &&
            ((boundary.status = 4),
            (task = logRecoverableError(request, error, segment)),
            (boundary.status = 4),
            encodeErrorForBoundary(boundary, task, error, segment, !0),
            untrackBoundary(request, boundary),
            boundary.parentFlushed &&
              request.clientRenderedBoundaries.push(boundary)),
          boundary.fallbackAbortableTasks.forEach(function (fallbackTask) {
            return abortTask(fallbackTask, request, error);
          }),
          boundary.fallbackAbortableTasks.clear();
      request.allPendingTasks--;
      0 === request.allPendingTasks && completeAll(request);
    }
    function safelyEmitEarlyPreloads(request, shellComplete) {
      try {
        emitEarlyPreloads(
          request.renderState,
          request.resumableState,
          shellComplete
        );
      } catch (error) {
        logRecoverableError(request, error, {});
      }
    }
    function completeShell(request) {
      null === request.trackedPostpones && safelyEmitEarlyPreloads(request, !0);
      request.onShellError = noop;
      request = request.onShellReady;
      request();
    }
    function completeAll(request) {
      safelyEmitEarlyPreloads(
        request,
        null === request.trackedPostpones
          ? !0
          : null === request.completedRootSegment ||
              5 !== request.completedRootSegment.status
      );
      request = request.onAllReady;
      request();
    }
    function queueCompletedSegment(boundary, segment) {
      if (
        0 === segment.chunks.length &&
        1 === segment.children.length &&
        null === segment.children[0].boundary &&
        -1 === segment.children[0].id
      ) {
        var childSegment = segment.children[0];
        childSegment.id = segment.id;
        childSegment.parentFlushed = !0;
        1 === childSegment.status &&
          queueCompletedSegment(boundary, childSegment);
      } else boundary.completedSegments.push(segment);
    }
    function finishedTask(request, boundary, segment) {
      if (null === boundary) {
        if (null !== segment && segment.parentFlushed) {
          if (null !== request.completedRootSegment)
            throw Error(
              "There can only be one root segment. This is a bug in React."
            );
          request.completedRootSegment = segment;
        }
        request.pendingRootTasks--;
        0 === request.pendingRootTasks && completeShell(request);
      } else
        boundary.pendingTasks--,
          4 !== boundary.status &&
            (0 === boundary.pendingTasks
              ? (0 === boundary.status && (boundary.status = 1),
                null !== segment &&
                  segment.parentFlushed &&
                  1 === segment.status &&
                  queueCompletedSegment(boundary, segment),
                boundary.parentFlushed &&
                  request.completedBoundaries.push(boundary),
                1 === boundary.status &&
                  (boundary.fallbackAbortableTasks.forEach(
                    abortTaskSoft,
                    request
                  ),
                  boundary.fallbackAbortableTasks.clear()))
              : null !== segment &&
                segment.parentFlushed &&
                1 === segment.status &&
                (queueCompletedSegment(boundary, segment),
                1 === boundary.completedSegments.length &&
                  boundary.parentFlushed &&
                  request.partialBoundaries.push(boundary)));
      request.allPendingTasks--;
      0 === request.allPendingTasks && completeAll(request);
    }
    function performWork(request$jscomp$1) {
      if (14 !== request$jscomp$1.status && 13 !== request$jscomp$1.status) {
        var prevContext = currentActiveSnapshot,
          prevDispatcher = ReactSharedInternals.H;
        ReactSharedInternals.H = HooksDispatcher;
        var prevAsyncDispatcher = ReactSharedInternals.A;
        ReactSharedInternals.A = DefaultAsyncDispatcher;
        var prevRequest = currentRequest;
        currentRequest = request$jscomp$1;
        var prevGetCurrentStackImpl = ReactSharedInternals.getCurrentStack;
        ReactSharedInternals.getCurrentStack = getCurrentStackInDEV;
        var prevResumableState = currentResumableState;
        currentResumableState = request$jscomp$1.resumableState;
        try {
          var pingedTasks = request$jscomp$1.pingedTasks,
            i;
          for (i = 0; i < pingedTasks.length; i++) {
            var request = request$jscomp$1,
              task = pingedTasks[i],
              segment = task.blockedSegment;
            if (null === segment) {
              var prevTaskInDEV = void 0,
                request$jscomp$0 = request;
              request = task;
              if (0 !== request.replay.pendingTasks) {
                switchContext(request.context);
                prevTaskInDEV = currentTaskInDEV;
                currentTaskInDEV = request;
                try {
                  "number" === typeof request.replay.slots
                    ? resumeNode(
                        request$jscomp$0,
                        request,
                        request.replay.slots,
                        request.node,
                        request.childIndex
                      )
                    : retryNode(request$jscomp$0, request);
                  if (
                    1 === request.replay.pendingTasks &&
                    0 < request.replay.nodes.length
                  )
                    throw Error(
                      "Couldn't find all resumable slots by key/index during replaying. The tree doesn't match so React will fallback to client rendering."
                    );
                  request.replay.pendingTasks--;
                  request.abortSet.delete(request);
                  finishedTask(request$jscomp$0, request.blockedBoundary, null);
                } catch (thrownValue) {
                  resetHooksState();
                  var x =
                    thrownValue === SuspenseException
                      ? getSuspendedThenable()
                      : thrownValue;
                  if (
                    "object" === typeof x &&
                    null !== x &&
                    "function" === typeof x.then
                  ) {
                    var ping = request.ping;
                    x.then(ping, ping);
                    request.thenableState = getThenableStateAfterSuspending();
                  } else {
                    request.replay.pendingTasks--;
                    request.abortSet.delete(request);
                    var errorInfo = getThrownInfo(request.componentStack);
                    erroredReplay(
                      request$jscomp$0,
                      request.blockedBoundary,
                      12 === request$jscomp$0.status
                        ? request$jscomp$0.fatalError
                        : x,
                      errorInfo,
                      request.replay.nodes,
                      request.replay.slots
                    );
                    request$jscomp$0.pendingRootTasks--;
                    0 === request$jscomp$0.pendingRootTasks &&
                      completeShell(request$jscomp$0);
                    request$jscomp$0.allPendingTasks--;
                    0 === request$jscomp$0.allPendingTasks &&
                      completeAll(request$jscomp$0);
                  }
                } finally {
                  currentTaskInDEV = prevTaskInDEV;
                }
              }
            } else {
              request$jscomp$0 = prevTaskInDEV = void 0;
              var task$jscomp$0 = task,
                segment$jscomp$0 = segment;
              if (0 === segment$jscomp$0.status) {
                segment$jscomp$0.status = 6;
                switchContext(task$jscomp$0.context);
                request$jscomp$0 = currentTaskInDEV;
                currentTaskInDEV = task$jscomp$0;
                var childrenLength = segment$jscomp$0.children.length,
                  chunkLength = segment$jscomp$0.chunks.length;
                try {
                  retryNode(request, task$jscomp$0),
                    pushSegmentFinale(
                      segment$jscomp$0.chunks,
                      request.renderState,
                      segment$jscomp$0.lastPushedText,
                      segment$jscomp$0.textEmbedded
                    ),
                    task$jscomp$0.abortSet.delete(task$jscomp$0),
                    (segment$jscomp$0.status = 1),
                    finishedTask(
                      request,
                      task$jscomp$0.blockedBoundary,
                      segment$jscomp$0
                    );
                } catch (thrownValue) {
                  resetHooksState();
                  segment$jscomp$0.children.length = childrenLength;
                  segment$jscomp$0.chunks.length = chunkLength;
                  var x$jscomp$0 =
                    thrownValue === SuspenseException
                      ? getSuspendedThenable()
                      : 12 === request.status
                        ? request.fatalError
                        : thrownValue;
                  if (
                    "object" === typeof x$jscomp$0 &&
                    null !== x$jscomp$0 &&
                    "function" === typeof x$jscomp$0.then
                  ) {
                    segment$jscomp$0.status = 0;
                    task$jscomp$0.thenableState =
                      getThenableStateAfterSuspending();
                    var ping$jscomp$0 = task$jscomp$0.ping;
                    x$jscomp$0.then(ping$jscomp$0, ping$jscomp$0);
                  } else {
                    var errorInfo$jscomp$0 = getThrownInfo(
                      task$jscomp$0.componentStack
                    );
                    task$jscomp$0.abortSet.delete(task$jscomp$0);
                    segment$jscomp$0.status = 4;
                    var boundary = task$jscomp$0.blockedBoundary;
                    prevTaskInDEV = logRecoverableError(
                      request,
                      x$jscomp$0,
                      errorInfo$jscomp$0
                    );
                    null === boundary
                      ? fatalError(request, x$jscomp$0)
                      : (boundary.pendingTasks--,
                        4 !== boundary.status &&
                          ((boundary.status = 4),
                          encodeErrorForBoundary(
                            boundary,
                            prevTaskInDEV,
                            x$jscomp$0,
                            errorInfo$jscomp$0,
                            !1
                          ),
                          untrackBoundary(request, boundary),
                          boundary.parentFlushed &&
                            request.clientRenderedBoundaries.push(boundary)));
                    request.allPendingTasks--;
                    0 === request.allPendingTasks && completeAll(request);
                  }
                } finally {
                  currentTaskInDEV = request$jscomp$0;
                }
              }
            }
          }
          pingedTasks.splice(0, i);
          null !== request$jscomp$1.destination &&
            flushCompletedQueues(
              request$jscomp$1,
              request$jscomp$1.destination
            );
        } catch (error) {
          logRecoverableError(request$jscomp$1, error, {}),
            fatalError(request$jscomp$1, error);
        } finally {
          (currentResumableState = prevResumableState),
            (ReactSharedInternals.H = prevDispatcher),
            (ReactSharedInternals.A = prevAsyncDispatcher),
            (ReactSharedInternals.getCurrentStack = prevGetCurrentStackImpl),
            prevDispatcher === HooksDispatcher && switchContext(prevContext),
            (currentRequest = prevRequest);
        }
      }
    }
    function flushSubtree(request, destination, segment, hoistableState) {
      segment.parentFlushed = !0;
      switch (segment.status) {
        case 0:
          segment.id = request.nextSegmentId++;
        case 5:
          return (
            (hoistableState = segment.id),
            (segment.lastPushedText = !1),
            (segment.textEmbedded = !1),
            writePlaceholder(destination, request.renderState, hoistableState)
          );
        case 1:
          segment.status = 2;
          var r = !0,
            chunks = segment.chunks,
            chunkIdx = 0;
          segment = segment.children;
          for (var childIdx = 0; childIdx < segment.length; childIdx++) {
            for (r = segment[childIdx]; chunkIdx < r.index; chunkIdx++)
              writeChunk(destination, chunks[chunkIdx]);
            r = flushSegment(request, destination, r, hoistableState);
          }
          for (; chunkIdx < chunks.length - 1; chunkIdx++)
            writeChunk(destination, chunks[chunkIdx]);
          chunkIdx < chunks.length &&
            (r = writeChunkAndReturn(destination, chunks[chunkIdx]));
          return r;
        default:
          throw Error(
            "Aborted, errored or already flushed boundaries should not be flushed again. This is a bug in React."
          );
      }
    }
    function flushSegment(request, destination, segment, hoistableState) {
      var boundary = segment.boundary;
      if (null === boundary)
        return flushSubtree(request, destination, segment, hoistableState);
      boundary.parentFlushed = !0;
      if (4 === boundary.status)
        return (
          writeStartClientRenderedSuspenseBoundary(
            destination,
            request.renderState,
            boundary.errorDigest,
            boundary.errorMessage,
            boundary.errorStack,
            boundary.errorComponentStack
          ),
          flushSubtree(request, destination, segment, hoistableState),
          writeEndClientRenderedSuspenseBoundary(
            destination,
            request.renderState
          )
        );
      if (1 !== boundary.status)
        return (
          0 === boundary.status &&
            (boundary.rootSegmentID = request.nextSegmentId++),
          0 < boundary.completedSegments.length &&
            request.partialBoundaries.push(boundary),
          writeStartPendingSuspenseBoundary(
            destination,
            request.renderState,
            boundary.rootSegmentID
          ),
          hoistableState &&
            hoistHoistables(hoistableState, boundary.fallbackState),
          flushSubtree(request, destination, segment, hoistableState),
          writeEndPendingSuspenseBoundary(destination, request.renderState)
        );
      if (boundary.byteSize > request.progressiveChunkSize)
        return (
          (boundary.rootSegmentID = request.nextSegmentId++),
          request.completedBoundaries.push(boundary),
          writeStartPendingSuspenseBoundary(
            destination,
            request.renderState,
            boundary.rootSegmentID
          ),
          flushSubtree(request, destination, segment, hoistableState),
          writeEndPendingSuspenseBoundary(destination, request.renderState)
        );
      hoistableState && hoistHoistables(hoistableState, boundary.contentState);
      writeStartCompletedSuspenseBoundary(destination, request.renderState);
      segment = boundary.completedSegments;
      if (1 !== segment.length)
        throw Error(
          "A previously unvisited boundary must have exactly one root segment. This is a bug in React."
        );
      flushSegment(request, destination, segment[0], hoistableState);
      return writeEndCompletedSuspenseBoundary(
        destination,
        request.renderState
      );
    }
    function flushSegmentContainer(
      request,
      destination,
      segment,
      hoistableState
    ) {
      writeStartSegment(
        destination,
        request.renderState,
        segment.parentFormatContext,
        segment.id
      );
      flushSegment(request, destination, segment, hoistableState);
      return writeEndSegment(destination, segment.parentFormatContext);
    }
    function flushCompletedBoundary(request, destination, boundary) {
      for (
        var completedSegments = boundary.completedSegments, i = 0;
        i < completedSegments.length;
        i++
      )
        flushPartiallyCompletedSegment(
          request,
          destination,
          boundary,
          completedSegments[i]
        );
      completedSegments.length = 0;
      writeHoistablesForBoundary(
        destination,
        boundary.contentState,
        request.renderState
      );
      return writeCompletedBoundaryInstruction(
        destination,
        request.resumableState,
        request.renderState,
        boundary.rootSegmentID,
        boundary.contentState
      );
    }
    function flushPartiallyCompletedSegment(
      request,
      destination,
      boundary,
      segment
    ) {
      if (2 === segment.status) return !0;
      var hoistableState = boundary.contentState,
        segmentID = segment.id;
      if (-1 === segmentID) {
        if (-1 === (segment.id = boundary.rootSegmentID))
          throw Error(
            "A root segment ID must have been assigned by now. This is a bug in React."
          );
        return flushSegmentContainer(
          request,
          destination,
          segment,
          hoistableState
        );
      }
      if (segmentID === boundary.rootSegmentID)
        return flushSegmentContainer(
          request,
          destination,
          segment,
          hoistableState
        );
      flushSegmentContainer(request, destination, segment, hoistableState);
      return writeCompletedSegmentInstruction(
        destination,
        request.resumableState,
        request.renderState,
        segmentID
      );
    }
    function flushCompletedQueues(request, destination) {
      beginWriting(destination);
      try {
        if (!(0 < request.pendingRootTasks)) {
          var i,
            completedRootSegment = request.completedRootSegment;
          if (null !== completedRootSegment) {
            if (5 === completedRootSegment.status) return;
            writePreamble(
              destination,
              request.resumableState,
              request.renderState,
              0 === request.allPendingTasks && null === request.trackedPostpones
            );
            flushSegment(request, destination, completedRootSegment, null);
            request.completedRootSegment = null;
            writeCompletedRoot(destination, request.renderState);
          }
          writeHoistables(
            destination,
            request.resumableState,
            request.renderState
          );
          var clientRenderedBoundaries = request.clientRenderedBoundaries;
          for (i = 0; i < clientRenderedBoundaries.length; i++) {
            var boundary = clientRenderedBoundaries[i];
            var JSCompiler_inline_result = writeClientRenderBoundaryInstruction(
              destination,
              request.resumableState,
              request.renderState,
              boundary.rootSegmentID,
              boundary.errorDigest,
              boundary.errorMessage,
              boundary.errorStack,
              boundary.errorComponentStack
            );
            if (!JSCompiler_inline_result) {
              request.destination = null;
              i++;
              clientRenderedBoundaries.splice(0, i);
              return;
            }
          }
          clientRenderedBoundaries.splice(0, i);
          var completedBoundaries = request.completedBoundaries;
          for (i = 0; i < completedBoundaries.length; i++)
            if (
              !flushCompletedBoundary(
                request,
                destination,
                completedBoundaries[i]
              )
            ) {
              request.destination = null;
              i++;
              completedBoundaries.splice(0, i);
              return;
            }
          completedBoundaries.splice(0, i);
          completeWriting(destination);
          beginWriting(destination);
          var partialBoundaries = request.partialBoundaries;
          for (i = 0; i < partialBoundaries.length; i++) {
            a: {
              completedRootSegment = request;
              clientRenderedBoundaries = destination;
              var boundary$jscomp$0 = partialBoundaries[i],
                completedSegments = boundary$jscomp$0.completedSegments;
              for (
                boundary = 0;
                boundary < completedSegments.length;
                boundary++
              )
                if (
                  !flushPartiallyCompletedSegment(
                    completedRootSegment,
                    clientRenderedBoundaries,
                    boundary$jscomp$0,
                    completedSegments[boundary]
                  )
                ) {
                  boundary++;
                  completedSegments.splice(0, boundary);
                  var JSCompiler_inline_result$jscomp$0 = !1;
                  break a;
                }
              completedSegments.splice(0, boundary);
              JSCompiler_inline_result$jscomp$0 = writeHoistablesForBoundary(
                clientRenderedBoundaries,
                boundary$jscomp$0.contentState,
                completedRootSegment.renderState
              );
            }
            if (!JSCompiler_inline_result$jscomp$0) {
              request.destination = null;
              i++;
              partialBoundaries.splice(0, i);
              return;
            }
          }
          partialBoundaries.splice(0, i);
          var largeBoundaries = request.completedBoundaries;
          for (i = 0; i < largeBoundaries.length; i++)
            if (
              !flushCompletedBoundary(request, destination, largeBoundaries[i])
            ) {
              request.destination = null;
              i++;
              largeBoundaries.splice(0, i);
              return;
            }
          largeBoundaries.splice(0, i);
        }
      } finally {
        0 === request.allPendingTasks &&
        0 === request.pingedTasks.length &&
        0 === request.clientRenderedBoundaries.length &&
        0 === request.completedBoundaries.length
          ? ((request.flushScheduled = !1),
            writePostamble(destination, request.resumableState),
            completeWriting(destination),
            flushBuffered(destination),
            0 !== request.abortableTasks.size &&
              console.error(
                "There was still abortable task at the root when we closed. This is a bug in React."
              ),
            (request.status = 14),
            close(destination),
            stopFlowing(request))
          : (completeWriting(destination), flushBuffered(destination));
      }
    }
    function enqueueFlush(request) {
      !1 === request.flushScheduled &&
        0 === request.pingedTasks.length &&
        null !== request.destination &&
        ((request.flushScheduled = !0),
        scheduleWork(function () {
          var destination = request.destination;
          destination
            ? flushCompletedQueues(request, destination)
            : (request.flushScheduled = !1);
        }));
    }
    function stopFlowing(request) {
      request.destination = null;
    }
    var exports = {};
    ("use strict");
    var React = require("react"),
      REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"),
      REACT_PORTAL_TYPE = Symbol.for("react.portal"),
      REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"),
      REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"),
      REACT_PROFILER_TYPE = Symbol.for("react.profiler"),
      REACT_PROVIDER_TYPE = Symbol.for("react.provider"),
      REACT_CONSUMER_TYPE = Symbol.for("react.consumer"),
      REACT_CONTEXT_TYPE = Symbol.for("react.context"),
      REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"),
      REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"),
      REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"),
      REACT_MEMO_TYPE = Symbol.for("react.memo"),
      REACT_LAZY_TYPE = Symbol.for("react.lazy"),
      REACT_SCOPE_TYPE = Symbol.for("react.scope"),
      REACT_DEBUG_TRACING_MODE_TYPE = Symbol.for("react.debug_trace_mode"),
      REACT_OFFSCREEN_TYPE = Symbol.for("react.offscreen"),
      REACT_LEGACY_HIDDEN_TYPE = Symbol.for("react.legacy_hidden"),
      REACT_MEMO_CACHE_SENTINEL = Symbol.for("react.memo_cache_sentinel"),
      MAYBE_ITERATOR_SYMBOL = Symbol.iterator,
      isArrayImpl = Array.isArray,
      jsxPropsParents = new WeakMap(),
      jsxChildrenParents = new WeakMap(),
      CLIENT_REFERENCE_TAG = Symbol.for("react.client.reference"),
      scheduleWork = $$$config.scheduleWork,
      scheduleMicrotask = $$$config.scheduleMicrotask,
      beginWriting = $$$config.beginWriting,
      writeChunk = $$$config.writeChunk,
      writeChunkAndReturn = $$$config.writeChunkAndReturn,
      completeWriting = $$$config.completeWriting,
      flushBuffered = $$$config.flushBuffered,
      close = $$$config.close,
      closeWithError = $$$config.closeWithError;
    $$$config.stringToChunk;
    $$$config.stringToPrecomputedChunk;
    $$$config.typedArrayToBinaryChunk;
    $$$config.byteLengthOfChunk;
    $$$config.byteLengthOfBinaryChunk;
    var createFastHash = $$$config.createFastHash,
      bindToConsole = $$$config.bindToConsole,
      resetResumableState = $$$config.resetResumableState,
      completeResumableState = $$$config.completeResumableState,
      getChildFormatContext = $$$config.getChildFormatContext,
      makeId = $$$config.makeId,
      pushTextInstance = $$$config.pushTextInstance,
      pushStartInstance = $$$config.pushStartInstance,
      pushEndInstance = $$$config.pushEndInstance;
    $$$config.pushStartCompletedSuspenseBoundary;
    $$$config.pushEndCompletedSuspenseBoundary;
    var pushSegmentFinale = $$$config.pushSegmentFinale,
      pushFormStateMarkerIsMatching = $$$config.pushFormStateMarkerIsMatching,
      pushFormStateMarkerIsNotMatching =
        $$$config.pushFormStateMarkerIsNotMatching,
      writeCompletedRoot = $$$config.writeCompletedRoot,
      writePlaceholder = $$$config.writePlaceholder,
      writeStartCompletedSuspenseBoundary =
        $$$config.writeStartCompletedSuspenseBoundary,
      writeStartPendingSuspenseBoundary =
        $$$config.writeStartPendingSuspenseBoundary,
      writeStartClientRenderedSuspenseBoundary =
        $$$config.writeStartClientRenderedSuspenseBoundary,
      writeEndCompletedSuspenseBoundary =
        $$$config.writeEndCompletedSuspenseBoundary,
      writeEndPendingSuspenseBoundary =
        $$$config.writeEndPendingSuspenseBoundary,
      writeEndClientRenderedSuspenseBoundary =
        $$$config.writeEndClientRenderedSuspenseBoundary,
      writeStartSegment = $$$config.writeStartSegment,
      writeEndSegment = $$$config.writeEndSegment,
      writeCompletedSegmentInstruction =
        $$$config.writeCompletedSegmentInstruction,
      writeCompletedBoundaryInstruction =
        $$$config.writeCompletedBoundaryInstruction,
      writeClientRenderBoundaryInstruction =
        $$$config.writeClientRenderBoundaryInstruction,
      NotPendingTransition = $$$config.NotPendingTransition,
      writePreamble = $$$config.writePreamble,
      writeHoistables = $$$config.writeHoistables,
      writeHoistablesForBoundary = $$$config.writeHoistablesForBoundary,
      writePostamble = $$$config.writePostamble,
      hoistHoistables = $$$config.hoistHoistables,
      createHoistableState = $$$config.createHoistableState,
      emitEarlyPreloads = $$$config.emitEarlyPreloads,
      assign = Object.assign,
      REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"),
      emptyContextObject = {};
    Object.freeze(emptyContextObject);
    var rendererSigil = {};
    var currentActiveSnapshot = null,
      didWarnAboutNoopUpdateForComponent = {},
      didWarnAboutDeprecatedWillMount = {};
    var didWarnAboutUninitializedState = new Set();
    var didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate = new Set();
    var didWarnAboutLegacyLifecyclesAndDerivedState = new Set();
    var didWarnAboutDirectlyAssigningPropsToState = new Set();
    var didWarnAboutUndefinedDerivedState = new Set();
    var didWarnAboutContextTypes$1 = new Set();
    var didWarnAboutChildContextTypes = new Set();
    var didWarnAboutInvalidateContextType = new Set();
    var didWarnOnInvalidCallback = new Set();
    var classComponentUpdater = {
        isMounted: function () {
          return !1;
        },
        enqueueSetState: function (inst, payload, callback) {
          var internals = inst._reactInternals;
          null === internals.queue
            ? warnNoop(inst, "setState")
            : (internals.queue.push(payload),
              void 0 !== callback &&
                null !== callback &&
                warnOnInvalidCallback(callback));
        },
        enqueueReplaceState: function (inst, payload, callback) {
          inst = inst._reactInternals;
          inst.replace = !0;
          inst.queue = [payload];
          void 0 !== callback &&
            null !== callback &&
            warnOnInvalidCallback(callback);
        },
        enqueueForceUpdate: function (inst, callback) {
          null === inst._reactInternals.queue
            ? warnNoop(inst, "forceUpdate")
            : void 0 !== callback &&
              null !== callback &&
              warnOnInvalidCallback(callback);
        }
      },
      emptyTreeContext = { id: 1, overflow: "" },
      clz32 = Math.clz32 ? Math.clz32 : clz32Fallback,
      log = Math.log,
      LN2 = Math.LN2,
      SuspenseException = Error(
        "Suspense Exception: This is not a real error! It's an implementation detail of `use` to interrupt the current render. You must either rethrow it immediately, or move the `use` call outside of the `try/catch` block. Capturing without rethrowing will lead to unexpected behavior.\n\nTo handle async errors, wrap your component in an error boundary, or call the promise's `.catch` method and pass the result to `use`."
      ),
      suspendedThenable = null,
      objectIs = "function" === typeof Object.is ? Object.is : is,
      currentlyRenderingComponent = null,
      currentlyRenderingTask = null,
      currentlyRenderingRequest = null,
      currentlyRenderingKeyPath = null,
      firstWorkInProgressHook = null,
      workInProgressHook = null,
      isReRender = !1,
      didScheduleRenderPhaseUpdate = !1,
      localIdCounter = 0,
      actionStateCounter = 0,
      actionStateMatchingIndex = -1,
      thenableIndexCounter = 0,
      thenableState = null,
      renderPhaseUpdates = null,
      numberOfReRenders = 0,
      isInHookUserCodeInDev = !1,
      currentHookNameInDev,
      HooksDispatcher = {
        readContext: readContext,
        use: function (usable) {
          if (null !== usable && "object" === typeof usable) {
            if ("function" === typeof usable.then)
              return unwrapThenable(usable);
            if (usable.$$typeof === REACT_CONTEXT_TYPE)
              return readContext(usable);
          }
          throw Error(
            "An unsupported type was passed to use(): " + String(usable)
          );
        },
        useContext: function (context) {
          currentHookNameInDev = "useContext";
          resolveCurrentlyRenderingComponent();
          return context._currentValue2;
        },
        useMemo: useMemo,
        useReducer: useReducer,
        useRef: function (initialValue) {
          currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
          workInProgressHook = createWorkInProgressHook();
          var previousRef = workInProgressHook.memoizedState;
          return null === previousRef
            ? ((initialValue = { current: initialValue }),
              Object.seal(initialValue),
              (workInProgressHook.memoizedState = initialValue))
            : previousRef;
        },
        useState: function (initialState) {
          currentHookNameInDev = "useState";
          return useReducer(basicStateReducer, initialState);
        },
        useInsertionEffect: noop$1,
        useLayoutEffect: noop$1,
        useCallback: function (callback, deps) {
          return useMemo(function () {
            return callback;
          }, deps);
        },
        useImperativeHandle: noop$1,
        useEffect: noop$1,
        useDebugValue: noop$1,
        useDeferredValue: function (value, initialValue) {
          resolveCurrentlyRenderingComponent();
          return void 0 !== initialValue ? initialValue : value;
        },
        useTransition: function () {
          resolveCurrentlyRenderingComponent();
          return [!1, unsupportedStartTransition];
        },
        useId: function () {
          var context = currentlyRenderingTask.treeContext;
          var treeId = context.overflow;
          context = context.id;
          treeId =
            (context & ~(1 << (32 - clz32(context) - 1))).toString(32) + treeId;
          context = currentResumableState;
          if (null === context)
            throw Error(
              "Invalid hook call. Hooks can only be called inside of the body of a function component."
            );
          var localId = localIdCounter++;
          return makeId(context, treeId, localId);
        },
        useSyncExternalStore: function (
          subscribe,
          getSnapshot,
          getServerSnapshot
        ) {
          if (void 0 === getServerSnapshot)
            throw Error(
              "Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering."
            );
          return getServerSnapshot();
        },
        useCacheRefresh: function () {
          return unsupportedRefresh;
        },
        useMemoCache: function (size) {
          for (var data = Array(size), i = 0; i < size; i++)
            data[i] = REACT_MEMO_CACHE_SENTINEL;
          return data;
        },
        useHostTransitionStatus: function () {
          resolveCurrentlyRenderingComponent();
          return NotPendingTransition;
        },
        useOptimistic: function (passthrough) {
          resolveCurrentlyRenderingComponent();
          return [passthrough, unsupportedSetOptimisticState];
        }
      };
    HooksDispatcher.useFormState = useActionState;
    HooksDispatcher.useActionState = useActionState;
    var currentResumableState = null,
      currentTaskInDEV = null,
      DefaultAsyncDispatcher = {
        getCacheForType: function () {
          throw Error("Not implemented.");
        },
        getOwner: function () {
          return null === currentTaskInDEV
            ? null
            : currentTaskInDEV.componentStack;
        }
      },
      disabledDepth = 0,
      prevLog,
      prevInfo,
      prevWarn,
      prevError,
      prevGroup,
      prevGroupCollapsed,
      prevGroupEnd;
    disabledLog.__reactDisabledLog = !0;
    var ReactSharedInternals =
        React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
      prefix,
      suffix,
      reentry = !1;
    var componentFrameCache = new (
      "function" === typeof WeakMap ? WeakMap : Map
    )();
    var callComponent = {
        "react-stack-bottom-frame": function (Component, props, secondArg) {
          return Component(props, secondArg);
        }
      },
      callComponentInDEV =
        callComponent["react-stack-bottom-frame"].bind(callComponent),
      callRender = {
        "react-stack-bottom-frame": function (instance) {
          return instance.render();
        }
      },
      callRenderInDEV = callRender["react-stack-bottom-frame"].bind(callRender),
      callLazyInit = {
        "react-stack-bottom-frame": function (lazy) {
          var init = lazy._init;
          return init(lazy._payload);
        }
      },
      callLazyInitInDEV =
        callLazyInit["react-stack-bottom-frame"].bind(callLazyInit),
      currentRequest = null,
      didWarnAboutBadClass = {},
      didWarnAboutContextTypes = {},
      didWarnAboutContextTypeOnFunctionComponent = {},
      didWarnAboutGetDerivedStateOnFunctionComponent = {},
      didWarnAboutReassigningProps = !1,
      didWarnAboutGenerators = !1,
      didWarnAboutMaps = !1;
    exports.abort = function (request, reason) {
      if (11 === request.status || 10 === request.status) request.status = 12;
      try {
        var abortableTasks = request.abortableTasks;
        if (0 < abortableTasks.size) {
          var error =
            void 0 === reason
              ? Error("The render was aborted by the server without a reason.")
              : "object" === typeof reason &&
                  null !== reason &&
                  "function" === typeof reason.then
                ? Error("The render was aborted by the server with a promise.")
                : reason;
          request.fatalError = error;
          abortableTasks.forEach(function (task) {
            return abortTask(task, request, error);
          });
          abortableTasks.clear();
        }
        null !== request.destination &&
          flushCompletedQueues(request, request.destination);
      } catch (error$4) {
        logRecoverableError(request, error$4, {}), fatalError(request, error$4);
      }
    };
    exports.createPrerenderRequest = function (
      children,
      resumableState,
      renderState,
      rootFormatContext,
      progressiveChunkSize,
      onError,
      onAllReady,
      onShellReady,
      onShellError,
      onFatalError,
      onPostpone
    ) {
      children = createRequest(
        children,
        resumableState,
        renderState,
        rootFormatContext,
        progressiveChunkSize,
        onError,
        onAllReady,
        onShellReady,
        onShellError,
        onFatalError,
        onPostpone,
        void 0
      );
      children.trackedPostpones = {
        workingMap: new Map(),
        rootNodes: [],
        rootSlots: null
      };
      return children;
    };
    exports.createRequest = createRequest;
    exports.flushResources = function (request) {
      enqueueFlush(request);
    };
    exports.getFormState = function (request) {
      return request.formState;
    };
    exports.getPostponedState = function (request) {
      var trackedPostpones = request.trackedPostpones;
      if (
        null === trackedPostpones ||
        (0 === trackedPostpones.rootNodes.length &&
          null === trackedPostpones.rootSlots)
      )
        return (request.trackedPostpones = null);
      null !== request.completedRootSegment &&
      5 === request.completedRootSegment.status
        ? resetResumableState(request.resumableState, request.renderState)
        : completeResumableState(request.resumableState);
      return {
        nextSegmentId: request.nextSegmentId,
        rootFormatContext: request.rootFormatContext,
        progressiveChunkSize: request.progressiveChunkSize,
        resumableState: request.resumableState,
        replayNodes: trackedPostpones.rootNodes,
        replaySlots: trackedPostpones.rootSlots
      };
    };
    exports.getRenderState = function (request) {
      return request.renderState;
    };
    exports.getResumableState = function (request) {
      return request.resumableState;
    };
    exports.performWork = performWork;
    exports.prepareForStartFlowingIfBeforeAllReady = function (request) {
      safelyEmitEarlyPreloads(
        request,
        null === request.trackedPostpones
          ? 0 === request.pendingRootTasks
          : null === request.completedRootSegment
            ? 0 === request.pendingRootTasks
            : 5 !== request.completedRootSegment.status
      );
    };
    exports.resolveClassComponentProps = resolveClassComponentProps;
    exports.resolveRequest = function () {
      return currentRequest ? currentRequest : null;
    };
    exports.resumeAndPrerenderRequest = function (
      children,
      postponedState,
      renderState,
      onError,
      onAllReady,
      onShellReady,
      onShellError,
      onFatalError,
      onPostpone
    ) {
      children = resumeRequest(
        children,
        postponedState,
        renderState,
        onError,
        onAllReady,
        onShellReady,
        onShellError,
        onFatalError,
        onPostpone
      );
      children.trackedPostpones = {
        workingMap: new Map(),
        rootNodes: [],
        rootSlots: null
      };
      return children;
    };
    exports.resumeRequest = resumeRequest;
    exports.startFlowing = function (request, destination) {
      if (13 === request.status)
        (request.status = 14), closeWithError(destination, request.fatalError);
      else if (14 !== request.status && null === request.destination) {
        request.destination = destination;
        try {
          flushCompletedQueues(request, destination);
        } catch (error) {
          logRecoverableError(request, error, {}), fatalError(request, error);
        }
      }
    };
    exports.startWork = function (request) {
      request.flushScheduled = null !== request.destination;
      scheduleMicrotask(function () {
        return performWork(request);
      });
      scheduleWork(function () {
        10 === request.status && (request.status = 11);
        null === request.trackedPostpones &&
          safelyEmitEarlyPreloads(request, 0 === request.pendingRootTasks);
      });
    };
    exports.stopFlowing = stopFlowing;
    return exports;
  }),
  (module.exports.default = module.exports),
  Object.defineProperty(module.exports, "__esModule", { value: !0 }));
