/**
 * @license React
 * react-server.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";
module.exports = function ($$$config) {
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
      switch (type.$$typeof) {
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
  function resolveCurrentlyRenderingComponent() {
    if (null === currentlyRenderingComponent)
      throw Error(
        "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem."
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
  function basicStateReducer(state, action) {
    return "function" === typeof action ? action(state) : action;
  }
  function useReducer(reducer, initialArg, init) {
    currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
    workInProgressHook = createWorkInProgressHook();
    if (isReRender) {
      var queue = workInProgressHook.queue;
      initialArg = queue.dispatch;
      if (
        null !== renderPhaseUpdates &&
        ((init = renderPhaseUpdates.get(queue)), void 0 !== init)
      ) {
        renderPhaseUpdates.delete(queue);
        queue = workInProgressHook.memoizedState;
        do (queue = reducer(queue, init.action)), (init = init.next);
        while (null !== init);
        workInProgressHook.memoizedState = queue;
        return [queue, initialArg];
      }
      return [workInProgressHook.memoizedState, initialArg];
    }
    reducer =
      reducer === basicStateReducer
        ? "function" === typeof initialArg
          ? initialArg()
          : initialArg
        : void 0 !== init
          ? init(initialArg)
          : initialArg;
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
        var prevDeps = prevState[1];
        a: if (null === prevDeps) prevDeps = !1;
        else {
          for (var i = 0; i < prevDeps.length && i < deps.length; i++)
            if (!objectIs(deps[i], prevDeps[i])) {
              prevDeps = !1;
              break a;
            }
          prevDeps = !0;
        }
        if (prevDeps) return prevState[0];
      }
    }
    nextCreate = nextCreate();
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
                  JSON.stringify([componentKeyPath, null, actionStateHookIndex])
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
          void 0 !== permalink &&
            ((permalink += ""), (prefix.action = permalink));
          var formData = prefix.data;
          formData &&
            (null === nextPostbackStateKey &&
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
            formData.append("$ACTION_KEY", nextPostbackStateKey));
          return prefix;
        });
      return [initialState, action, !1];
    }
    var boundAction$4 = action.bind(null, initialState);
    return [
      initialState,
      function (payload) {
        boundAction$4(payload);
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
    reentry = !0;
    var previousPrepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
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
                } catch (x$6) {
                  control = x$6;
                }
                fn.call(Fake.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (x$7) {
                control = x$7;
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
      var _RunInRootFrame$Deter = RunInRootFrame.DetermineComponentFrameRoot(),
        sampleStack = _RunInRootFrame$Deter[0],
        controlStack = _RunInRootFrame$Deter[1];
      if (sampleStack && controlStack) {
        var sampleLines = sampleStack.split("\n"),
          controlLines = controlStack.split("\n");
        for (
          namePropDescriptor = RunInRootFrame = 0;
          RunInRootFrame < sampleLines.length &&
          !sampleLines[RunInRootFrame].includes("DetermineComponentFrameRoot");

        )
          RunInRootFrame++;
        for (
          ;
          namePropDescriptor < controlLines.length &&
          !controlLines[namePropDescriptor].includes(
            "DetermineComponentFrameRoot"
          );

        )
          namePropDescriptor++;
        if (
          RunInRootFrame === sampleLines.length ||
          namePropDescriptor === controlLines.length
        )
          for (
            RunInRootFrame = sampleLines.length - 1,
              namePropDescriptor = controlLines.length - 1;
            1 <= RunInRootFrame &&
            0 <= namePropDescriptor &&
            sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor];

          )
            namePropDescriptor--;
        for (
          ;
          1 <= RunInRootFrame && 0 <= namePropDescriptor;
          RunInRootFrame--, namePropDescriptor--
        )
          if (
            sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]
          ) {
            if (1 !== RunInRootFrame || 1 !== namePropDescriptor) {
              do
                if (
                  (RunInRootFrame--,
                  namePropDescriptor--,
                  0 > namePropDescriptor ||
                    sampleLines[RunInRootFrame] !==
                      controlLines[namePropDescriptor])
                ) {
                  var frame =
                    "\n" +
                    sampleLines[RunInRootFrame].replace(" at new ", " at ");
                  fn.displayName &&
                    frame.includes("<anonymous>") &&
                    (frame = frame.replace("<anonymous>", fn.displayName));
                  return frame;
                }
              while (1 <= RunInRootFrame && 0 <= namePropDescriptor);
            }
            break;
          }
      }
    } finally {
      (reentry = !1), (Error.prepareStackTrace = previousPrepareStackTrace);
    }
    return (previousPrepareStackTrace = fn ? fn.displayName || fn.name : "")
      ? describeBuiltInComponentFrame(previousPrepareStackTrace)
      : "";
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
      trackedFallbackNode: null
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
  function pushComponentStack(task) {
    var node = task.node;
    if ("object" === typeof node && null !== node)
      switch (node.$$typeof) {
        case REACT_ELEMENT_TYPE:
          task.componentStack = {
            parent: task.componentStack,
            type: node.type
          };
      }
  }
  function getThrownInfo(node$jscomp$0) {
    var errorInfo = {};
    node$jscomp$0 &&
      Object.defineProperty(errorInfo, "componentStack", {
        configurable: !0,
        enumerable: !0,
        get: function () {
          try {
            var info = "",
              node = node$jscomp$0;
            do
              (info += describeComponentStackByType(node.type)),
                (node = node.parent);
            while (node);
            var JSCompiler_inline_result = info;
          } catch (x) {
            JSCompiler_inline_result =
              "\nError generating stack: " + x.message + "\n" + x.stack;
          }
          Object.defineProperty(errorInfo, "componentStack", {
            value: JSCompiler_inline_result
          });
          return JSCompiler_inline_result;
        }
      });
    return errorInfo;
  }
  function logRecoverableError(request, error, errorInfo) {
    request = request.onError;
    error = request(error, errorInfo);
    if (null == error || "string" === typeof error) return error;
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
    actionStateCounter = localIdCounter = 0;
    actionStateMatchingIndex = -1;
    thenableIndexCounter = 0;
    thenableState = prevThenableState;
    for (request = Component(props, secondArg); didScheduleRenderPhaseUpdate; )
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
      for (var propName$16 in Component)
        void 0 === newProps[propName$16] &&
          (newProps[propName$16] = Component[propName$16]);
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
        var JSCompiler_inline_result = emptyContextObject;
        var contextType = type.contextType;
        "object" === typeof contextType &&
          null !== contextType &&
          (JSCompiler_inline_result = contextType._currentValue2);
        JSCompiler_inline_result = new type(props, JSCompiler_inline_result);
        var initialState =
          void 0 !== JSCompiler_inline_result.state
            ? JSCompiler_inline_result.state
            : null;
        JSCompiler_inline_result.updater = classComponentUpdater;
        JSCompiler_inline_result.props = props;
        JSCompiler_inline_result.state = initialState;
        contextType = { queue: [], replace: !1 };
        JSCompiler_inline_result._reactInternals = contextType;
        ref = type.contextType;
        JSCompiler_inline_result.context =
          "object" === typeof ref && null !== ref
            ? ref._currentValue2
            : emptyContextObject;
        ref = type.getDerivedStateFromProps;
        "function" === typeof ref &&
          ((ref = ref(props, initialState)),
          (initialState =
            null === ref || void 0 === ref
              ? initialState
              : assign({}, initialState, ref)),
          (JSCompiler_inline_result.state = initialState));
        if (
          "function" !== typeof type.getDerivedStateFromProps &&
          "function" !==
            typeof JSCompiler_inline_result.getSnapshotBeforeUpdate &&
          ("function" ===
            typeof JSCompiler_inline_result.UNSAFE_componentWillMount ||
            "function" === typeof JSCompiler_inline_result.componentWillMount)
        )
          if (
            ((type = JSCompiler_inline_result.state),
            "function" === typeof JSCompiler_inline_result.componentWillMount &&
              JSCompiler_inline_result.componentWillMount(),
            "function" ===
              typeof JSCompiler_inline_result.UNSAFE_componentWillMount &&
              JSCompiler_inline_result.UNSAFE_componentWillMount(),
            type !== JSCompiler_inline_result.state &&
              classComponentUpdater.enqueueReplaceState(
                JSCompiler_inline_result,
                JSCompiler_inline_result.state,
                null
              ),
            null !== contextType.queue && 0 < contextType.queue.length)
          )
            if (
              ((type = contextType.queue),
              (ref = contextType.replace),
              (contextType.queue = null),
              (contextType.replace = !1),
              ref && 1 === type.length)
            )
              JSCompiler_inline_result.state = type[0];
            else {
              contextType = ref ? type[0] : JSCompiler_inline_result.state;
              initialState = !0;
              for (ref = ref ? 1 : 0; ref < type.length; ref++) {
                var partial = type[ref];
                partial =
                  "function" === typeof partial
                    ? partial.call(
                        JSCompiler_inline_result,
                        contextType,
                        props,
                        void 0
                      )
                    : partial;
                null != partial &&
                  (initialState
                    ? ((initialState = !1),
                      (contextType = assign({}, contextType, partial)))
                    : assign(contextType, partial));
              }
              JSCompiler_inline_result.state = contextType;
            }
          else contextType.queue = null;
        type = JSCompiler_inline_result.render();
        if (12 === request.status) throw null;
        props = task.keyPath;
        task.keyPath = keyPath;
        renderNodeDestructive(request, task, type, -1);
        task.keyPath = props;
      } else {
        type = renderWithHooks(request, task, keyPath, type, props, void 0);
        if (12 === request.status) throw null;
        finishFunctionComponent(
          request,
          task,
          keyPath,
          type,
          0 !== localIdCounter,
          actionStateCounter,
          actionStateMatchingIndex
        );
      }
    else if ("string" === typeof type)
      (JSCompiler_inline_result = task.blockedSegment),
        null === JSCompiler_inline_result
          ? ((JSCompiler_inline_result = props.children),
            (contextType = task.formatContext),
            (initialState = task.keyPath),
            (task.formatContext = getChildFormatContext(
              contextType,
              type,
              props
            )),
            (task.keyPath = keyPath),
            renderNode(request, task, JSCompiler_inline_result, -1),
            (task.formatContext = contextType),
            (task.keyPath = initialState))
          : ((contextType = pushStartInstance(
              JSCompiler_inline_result.chunks,
              type,
              props,
              request.resumableState,
              request.renderState,
              task.hoistableState,
              task.formatContext,
              JSCompiler_inline_result.lastPushedText,
              task.isFallback
            )),
            (JSCompiler_inline_result.lastPushedText = !1),
            (initialState = task.formatContext),
            (ref = task.keyPath),
            (task.formatContext = getChildFormatContext(
              initialState,
              type,
              props
            )),
            (task.keyPath = keyPath),
            renderNode(request, task, contextType, -1),
            (task.formatContext = initialState),
            (task.keyPath = ref),
            pushEndInstance(
              JSCompiler_inline_result.chunks,
              type,
              props,
              request.resumableState,
              initialState
            ),
            (JSCompiler_inline_result.lastPushedText = !1));
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
          throw Error("ReactDOMServer does not yet support scope components.");
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
            partial = props.fallback;
            props = props.children;
            var fallbackAbortSet = new Set(),
              newBoundary = createSuspenseBoundary(request, fallbackAbortSet);
            null !== request.trackedPostpones &&
              (newBoundary.trackedContentKeyPath = keyPath);
            var boundarySegment = createPendingSegment(
              request,
              ref.chunks.length,
              newBoundary,
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
              JSCompiler_inline_result = [
                keyPath[0],
                "Suspense Fallback",
                keyPath[2]
              ];
              contextType = [
                JSCompiler_inline_result[1],
                JSCompiler_inline_result[2],
                [],
                null
              ];
              request.trackedPostpones.workingMap.set(
                JSCompiler_inline_result,
                contextType
              );
              newBoundary.trackedFallbackNode = contextType;
              task.blockedSegment = boundarySegment;
              task.keyPath = JSCompiler_inline_result;
              boundarySegment.status = 6;
              try {
                renderNode(request, task, partial, -1),
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
                newBoundary,
                contentRootSegment,
                newBoundary.contentState,
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
              task.blockedBoundary = newBoundary;
              task.hoistableState = newBoundary.contentState;
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
                  queueCompletedSegment(newBoundary, contentRootSegment),
                  0 === newBoundary.pendingTasks && 0 === newBoundary.status)
                ) {
                  newBoundary.status = 1;
                  break a;
                }
              } catch (thrownValue$11) {
                (newBoundary.status = 4),
                  12 === request.status
                    ? ((contentRootSegment.status = 3),
                      (JSCompiler_inline_result = request.fatalError))
                    : ((contentRootSegment.status = 4),
                      (JSCompiler_inline_result = thrownValue$11)),
                  (contextType = getThrownInfo(task.componentStack)),
                  (initialState = logRecoverableError(
                    request,
                    JSCompiler_inline_result,
                    contextType
                  )),
                  (newBoundary.errorDigest = initialState),
                  untrackBoundary(request, newBoundary);
              } finally {
                (task.blockedBoundary = parentBoundary),
                  (task.hoistableState = parentHoistableState),
                  (task.blockedSegment = ref),
                  (task.keyPath = type);
              }
              task = createRenderTask(
                request,
                null,
                partial,
                -1,
                parentBoundary,
                boundarySegment,
                newBoundary.fallbackState,
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
              for (partial in ((JSCompiler_inline_result = {}), props))
                "ref" !== partial &&
                  (JSCompiler_inline_result[partial] = props[partial]);
            else JSCompiler_inline_result = props;
            type = renderWithHooks(
              request,
              task,
              keyPath,
              type.render,
              JSCompiler_inline_result,
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
            contextType = props.children;
            JSCompiler_inline_result = task.keyPath;
            props = props.value;
            initialState = type._currentValue2;
            type._currentValue2 = props;
            ref = currentActiveSnapshot;
            currentActiveSnapshot = type = {
              parent: ref,
              depth: null === ref ? 0 : ref.depth + 1,
              context: type,
              parentValue: initialState,
              value: props
            };
            task.context = type;
            task.keyPath = keyPath;
            renderNodeDestructive(request, task, contextType, -1);
            request = currentActiveSnapshot;
            if (null === request)
              throw Error(
                "Tried to pop a Context at the root of the app. This is a bug in React."
              );
            request.context._currentValue2 = request.parentValue;
            request = currentActiveSnapshot = request.parent;
            task.context = request;
            task.keyPath = JSCompiler_inline_result;
            return;
          case REACT_CONSUMER_TYPE:
            props = props.children;
            type = props(type._context._currentValue2);
            props = task.keyPath;
            task.keyPath = keyPath;
            renderNodeDestructive(request, task, type, -1);
            task.keyPath = props;
            return;
          case REACT_LAZY_TYPE:
            JSCompiler_inline_result = type._init;
            type = JSCompiler_inline_result(type._payload);
            if (12 === request.status) throw null;
            renderElement(request, task, keyPath, type, props, ref);
            return;
        }
      throw Error(
        "Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: " +
          ((null == type ? type : typeof type) + ".")
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
                null == key ? (-1 === childIndex ? 0 : childIndex) : key;
            key = [task.keyPath, name, keyOrIndex];
            if (null !== task.replay)
              a: {
                var replay = task.replay;
                childIndex = replay.nodes;
                for (node = 0; node < childIndex.length; node++) {
                  var node$jscomp$0 = childIndex[node];
                  if (keyOrIndex === node$jscomp$0[1]) {
                    if (4 === node$jscomp$0.length) {
                      if (null !== name && name !== node$jscomp$0[0])
                        throw Error(
                          "Expected the resume to render <" +
                            node$jscomp$0[0] +
                            "> in this slot but instead it rendered <" +
                            name +
                            ">. The tree doesn't match so React will fallback to client rendering."
                        );
                      var childNodes = node$jscomp$0[2];
                      name = node$jscomp$0[3];
                      keyOrIndex = task.node;
                      task.replay = {
                        nodes: childNodes,
                        slots: name,
                        pendingTasks: 1
                      };
                      try {
                        renderElement(request, task, key, type, props, ref);
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
                            (task.node === keyOrIndex && (task.replay = replay),
                            x)
                          );
                        task.replay.pendingTasks--;
                        props = getThrownInfo(task.componentStack);
                        key = task.blockedBoundary;
                        type = x;
                        props = logRecoverableError(request, type, props);
                        abortRemainingReplayNodes(
                          request,
                          key,
                          childNodes,
                          name,
                          type,
                          props
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
                      b: {
                        replay = void 0;
                        type = node$jscomp$0[5];
                        ref = node$jscomp$0[2];
                        name = node$jscomp$0[3];
                        keyOrIndex =
                          null === node$jscomp$0[4] ? [] : node$jscomp$0[4][2];
                        node$jscomp$0 =
                          null === node$jscomp$0[4]
                            ? null
                            : node$jscomp$0[4][3];
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
                        resumedBoundary.rootSegmentID = type;
                        task.blockedBoundary = resumedBoundary;
                        task.hoistableState = resumedBoundary.contentState;
                        task.keyPath = key;
                        task.replay = {
                          nodes: ref,
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
                            break b;
                          }
                        } catch (error) {
                          (resumedBoundary.status = 4),
                            (childNodes = getThrownInfo(task.componentStack)),
                            (replay = logRecoverableError(
                              request,
                              error,
                              childNodes
                            )),
                            (resumedBoundary.errorDigest = replay),
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
                        task = createReplayTask(
                          request,
                          null,
                          {
                            nodes: keyOrIndex,
                            slots: node$jscomp$0,
                            pendingTasks: 0
                          },
                          props,
                          -1,
                          parentBoundary,
                          resumedBoundary.fallbackState,
                          fallbackAbortSet,
                          [key[0], "Suspense Fallback", key[2]],
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
                    childIndex.splice(node, 1);
                    break a;
                  }
                }
              }
            else renderElement(request, task, key, type, props, ref);
            return;
          case REACT_PORTAL_TYPE:
            throw Error(
              "Portals are not currently supported by the server renderer. Render them conditionally so that they only appear on the client render."
            );
          case REACT_LAZY_TYPE:
            childNodes = node._init;
            node = childNodes(node._payload);
            if (12 === request.status) throw null;
            renderNodeDestructive(request, task, node, childIndex);
            return;
        }
        if (isArrayImpl(node)) {
          renderChildrenArray(request, task, node, childIndex);
          return;
        }
        null === node || "object" !== typeof node
          ? (childNodes = null)
          : ((childNodes =
              (MAYBE_ITERATOR_SYMBOL && node[MAYBE_ITERATOR_SYMBOL]) ||
              node["@@iterator"]),
            (childNodes =
              "function" === typeof childNodes ? childNodes : null));
        if (childNodes && (childNodes = childNodes.call(node))) {
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
      if ("string" === typeof node)
        (childIndex = task.blockedSegment),
          null !== childIndex &&
            (childIndex.lastPushedText = pushTextInstance(
              childIndex.chunks,
              node,
              request.renderState,
              childIndex.lastPushedText
            ));
      else if ("number" === typeof node || "bigint" === typeof node)
        (childIndex = task.blockedSegment),
          null !== childIndex &&
            (childIndex.lastPushedText = pushTextInstance(
              childIndex.chunks,
              "" + node,
              request.renderState,
              childIndex.lastPushedText
            ));
    }
  }
  function renderChildrenArray(request, task, children, childIndex) {
    var prevKeyPath = task.keyPath;
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
            renderChildrenArray(request, task, children, -1);
            if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length)
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
            var boundary = task.blockedBoundary,
              error = x;
            children = logRecoverableError(request, error, children);
            abortRemainingReplayNodes(
              request,
              boundary,
              childIndex,
              node,
              error,
              children
            );
          }
          task.replay = replay;
          replayNodes.splice(j, 1);
          break;
        }
      }
      task.keyPath = prevKeyPath;
      return;
    }
    replay = task.treeContext;
    replayNodes = children.length;
    if (
      null !== task.replay &&
      ((j = task.replay.slots), null !== j && "object" === typeof j)
    ) {
      for (childIndex = 0; childIndex < replayNodes; childIndex++)
        (node = children[childIndex]),
          (task.treeContext = pushTreeContext(replay, replayNodes, childIndex)),
          (boundary = j[childIndex]),
          "number" === typeof boundary
            ? (resumeNode(request, task, boundary, node, childIndex),
              delete j[childIndex])
            : renderNode(request, task, node, childIndex);
      task.treeContext = replay;
      task.keyPath = prevKeyPath;
      return;
    }
    for (j = 0; j < replayNodes; j++)
      (childIndex = children[j]),
        (task.treeContext = pushTreeContext(replay, replayNodes, j)),
        renderNode(request, task, childIndex, j);
    task.treeContext = replay;
    task.keyPath = prevKeyPath;
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
      } catch (thrownValue$31) {
        if (
          (resetHooksState(),
          (segment.children.length = childrenLength),
          (segment.chunks.length = chunkLength),
          (node =
            thrownValue$31 === SuspenseException
              ? getSuspendedThenable()
              : thrownValue$31),
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
    error,
    errorDigest$jscomp$0
  ) {
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (4 === node.length)
        abortRemainingReplayNodes(
          request$jscomp$0,
          boundary,
          node[2],
          node[3],
          error,
          errorDigest$jscomp$0
        );
      else {
        node = node[5];
        var request = request$jscomp$0,
          errorDigest = errorDigest$jscomp$0,
          resumedBoundary = createSuspenseBoundary(request, new Set());
        resumedBoundary.parentFlushed = !0;
        resumedBoundary.rootSegmentID = node;
        resumedBoundary.status = 4;
        resumedBoundary.errorDigest = errorDigest;
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
        (boundary.errorDigest = errorDigest$jscomp$0),
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
            task
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
          (boundary.errorDigest = task),
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
  function performWork(request$jscomp$2) {
    if (14 !== request$jscomp$2.status && 13 !== request$jscomp$2.status) {
      var prevContext = currentActiveSnapshot,
        prevDispatcher = ReactSharedInternals.H;
      ReactSharedInternals.H = HooksDispatcher;
      var prevAsyncDispatcher = ReactSharedInternals.A;
      ReactSharedInternals.A = DefaultAsyncDispatcher;
      var prevRequest = currentRequest;
      currentRequest = request$jscomp$2;
      var prevResumableState = currentResumableState;
      currentResumableState = request$jscomp$2.resumableState;
      try {
        var pingedTasks = request$jscomp$2.pingedTasks,
          i;
        for (i = 0; i < pingedTasks.length; i++) {
          var task = pingedTasks[i],
            request = request$jscomp$2,
            segment = task.blockedSegment;
          if (null === segment) {
            var request$jscomp$0 = request;
            if (0 !== task.replay.pendingTasks) {
              switchContext(task.context);
              try {
                "number" === typeof task.replay.slots
                  ? resumeNode(
                      request$jscomp$0,
                      task,
                      task.replay.slots,
                      task.node,
                      task.childIndex
                    )
                  : retryNode(request$jscomp$0, task);
                if (
                  1 === task.replay.pendingTasks &&
                  0 < task.replay.nodes.length
                )
                  throw Error(
                    "Couldn't find all resumable slots by key/index during replaying. The tree doesn't match so React will fallback to client rendering."
                  );
                task.replay.pendingTasks--;
                task.abortSet.delete(task);
                finishedTask(request$jscomp$0, task.blockedBoundary, null);
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
                  var ping = task.ping;
                  x.then(ping, ping);
                  task.thenableState = getThenableStateAfterSuspending();
                } else {
                  task.replay.pendingTasks--;
                  task.abortSet.delete(task);
                  var errorInfo = getThrownInfo(task.componentStack);
                  request = void 0;
                  var request$jscomp$1 = request$jscomp$0,
                    boundary = task.blockedBoundary,
                    error$jscomp$0 =
                      12 === request$jscomp$0.status
                        ? request$jscomp$0.fatalError
                        : x,
                    replayNodes = task.replay.nodes,
                    resumeSlots = task.replay.slots;
                  request = logRecoverableError(
                    request$jscomp$1,
                    error$jscomp$0,
                    errorInfo
                  );
                  abortRemainingReplayNodes(
                    request$jscomp$1,
                    boundary,
                    replayNodes,
                    resumeSlots,
                    error$jscomp$0,
                    request
                  );
                  request$jscomp$0.pendingRootTasks--;
                  0 === request$jscomp$0.pendingRootTasks &&
                    completeShell(request$jscomp$0);
                  request$jscomp$0.allPendingTasks--;
                  0 === request$jscomp$0.allPendingTasks &&
                    completeAll(request$jscomp$0);
                }
              } finally {
              }
            }
          } else if (
            ((request$jscomp$0 = void 0),
            (request$jscomp$1 = segment),
            0 === request$jscomp$1.status)
          ) {
            request$jscomp$1.status = 6;
            switchContext(task.context);
            var childrenLength = request$jscomp$1.children.length,
              chunkLength = request$jscomp$1.chunks.length;
            try {
              retryNode(request, task),
                pushSegmentFinale(
                  request$jscomp$1.chunks,
                  request.renderState,
                  request$jscomp$1.lastPushedText,
                  request$jscomp$1.textEmbedded
                ),
                task.abortSet.delete(task),
                (request$jscomp$1.status = 1),
                finishedTask(request, task.blockedBoundary, request$jscomp$1);
            } catch (thrownValue) {
              resetHooksState();
              request$jscomp$1.children.length = childrenLength;
              request$jscomp$1.chunks.length = chunkLength;
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
                request$jscomp$1.status = 0;
                task.thenableState = getThenableStateAfterSuspending();
                var ping$jscomp$0 = task.ping;
                x$jscomp$0.then(ping$jscomp$0, ping$jscomp$0);
              } else {
                var errorInfo$jscomp$0 = getThrownInfo(task.componentStack);
                task.abortSet.delete(task);
                request$jscomp$1.status = 4;
                var boundary$jscomp$0 = task.blockedBoundary;
                request$jscomp$0 = logRecoverableError(
                  request,
                  x$jscomp$0,
                  errorInfo$jscomp$0
                );
                null === boundary$jscomp$0
                  ? fatalError(request, x$jscomp$0)
                  : (boundary$jscomp$0.pendingTasks--,
                    4 !== boundary$jscomp$0.status &&
                      ((boundary$jscomp$0.status = 4),
                      (boundary$jscomp$0.errorDigest = request$jscomp$0),
                      untrackBoundary(request, boundary$jscomp$0),
                      boundary$jscomp$0.parentFlushed &&
                        request.clientRenderedBoundaries.push(
                          boundary$jscomp$0
                        )));
                request.allPendingTasks--;
                0 === request.allPendingTasks && completeAll(request);
              }
            } finally {
            }
          }
        }
        pingedTasks.splice(0, i);
        null !== request$jscomp$2.destination &&
          flushCompletedQueues(request$jscomp$2, request$jscomp$2.destination);
      } catch (error) {
        logRecoverableError(request$jscomp$2, error, {}),
          fatalError(request$jscomp$2, error);
      } finally {
        (currentResumableState = prevResumableState),
          (ReactSharedInternals.H = prevDispatcher),
          (ReactSharedInternals.A = prevAsyncDispatcher),
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
          null,
          null,
          null
        ),
        flushSubtree(request, destination, segment, hoistableState),
        writeEndClientRenderedSuspenseBoundary(destination, request.renderState)
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
    return writeEndCompletedSuspenseBoundary(destination, request.renderState);
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
            null,
            null,
            null
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
          var boundary$34 = partialBoundaries[i];
          a: {
            completedRootSegment = request;
            clientRenderedBoundaries = destination;
            var completedSegments = boundary$34.completedSegments;
            for (boundary = 0; boundary < completedSegments.length; boundary++)
              if (
                !flushPartiallyCompletedSegment(
                  completedRootSegment,
                  clientRenderedBoundaries,
                  boundary$34,
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
              boundary$34.contentState,
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
    writeEndPendingSuspenseBoundary = $$$config.writeEndPendingSuspenseBoundary,
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
    emptyContextObject = {},
    currentActiveSnapshot = null,
    classComponentUpdater = {
      isMounted: function () {
        return !1;
      },
      enqueueSetState: function (inst, payload) {
        inst = inst._reactInternals;
        null !== inst.queue && inst.queue.push(payload);
      },
      enqueueReplaceState: function (inst, payload) {
        inst = inst._reactInternals;
        inst.replace = !0;
        inst.queue = [payload];
      },
      enqueueForceUpdate: function () {}
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
    HooksDispatcher = {
      readContext: function (context) {
        return context._currentValue2;
      },
      use: function (usable) {
        if (null !== usable && "object" === typeof usable) {
          if ("function" === typeof usable.then) return unwrapThenable(usable);
          if (usable.$$typeof === REACT_CONTEXT_TYPE)
            return usable._currentValue2;
        }
        throw Error(
          "An unsupported type was passed to use(): " + String(usable)
        );
      },
      useContext: function (context) {
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
            (workInProgressHook.memoizedState = initialValue))
          : previousRef;
      },
      useState: function (initialState) {
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
        var JSCompiler_inline_result = context.overflow;
        context = context.id;
        JSCompiler_inline_result =
          (context & ~(1 << (32 - clz32(context) - 1))).toString(32) +
          JSCompiler_inline_result;
        context = currentResumableState;
        if (null === context)
          throw Error(
            "Invalid hook call. Hooks can only be called inside of the body of a function component."
          );
        var localId = localIdCounter++;
        return makeId(context, JSCompiler_inline_result, localId);
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
    DefaultAsyncDispatcher = {
      getCacheForType: function () {
        throw Error("Not implemented.");
      }
    },
    ReactSharedInternals =
      React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    prefix,
    suffix,
    reentry = !1,
    currentRequest = null;
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
    } catch (error$36) {
      logRecoverableError(request, error$36, {}), fatalError(request, error$36);
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
};
module.exports.default = module.exports;
Object.defineProperty(module.exports, "__esModule", { value: !0 });
