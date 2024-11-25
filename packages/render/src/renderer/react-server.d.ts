/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "react-server" {
  export interface HostConfig<
    Destination,
    RenderState,
    ResumableState,
    HoistableState,
    SuspenseInstance,
    FormatContext,
  > {
    scheduleMicrotask: (callback: () => void) => void;
    scheduleWork: (callback: () => void) => void;
    beginWriting: (destination: Destination) => void;
    writeChunk: (destination: Destination, buffer: Uint8Array) => void;
    writeChunkAndReturn: (
      destination: Destination,
      buffer: Uint8Array,
    ) => boolean;
    completeWriting: (destination: Destination) => void;
    close: (destination: Destination) => void;
    closeWithError: (destination: Destination, error: unknown) => void;
    flushBuffered: (destination: Destination) => void;

    // TODO: figure out type
    getChildFormatContext: () => unknown;

    resetResumableState: () => void;
    completeResumableState: () => void;

    pushTextInstance: (
      target: Uint8Array[],
      text: string,
      renderState: RenderState,
      textEmbedded: boolean,
    ) => boolean;
    pushStartInstance: (
      target: Uint8Array[],
      type: string,
      props: object,
      resumableState: ResumableState,
      renderState: RenderState,
      hoistableState: null | HoistableState,
      formatContext: FormatContext,
      textEmbedded: boolean,
      isFallback: boolean,
    ) => React.ReactNode;
    pushEndInstance: (
      target: Uint8Array[],
      type: string,
      props: object,
    ) => void;

    // This is a noop in ReactNoop
    pushSegmentFinale: (
      target: Uint8Array[],
      renderState: RenderState,
      lastPushedText: boolean,
      textEmbedded: boolean,
    ) => void;

    writeCompletedRoot: (
      destination: Destination,
      renderState: RenderState,
    ) => boolean;

    writePlaceholder: (
      destination: Destination,
      renderState: RenderState,
      id: number,
    ) => boolean;

    writeStartCompletedSuspenseBoundary: (
      destination: Destination,
      renderState: RenderState,
      suspenseInstance: SuspenseInstance,
    ) => boolean;
    writeStartPendingSuspenseBoundary: (
      destination: Destination,
      renderState: RenderState,
      suspenseInstance: SuspenseInstance,
    ) => boolean;
    writeStartClientRenderedSuspenseBoundary: (
      destination: Destination,
      renderState: RenderState,
      errorDigest?: string,
      errorMessage?: string,
      errorStack?: string,
      errorComponentStack?: string,
    ) => boolean;
    writeEndCompletedSuspenseBoundary: (destination: Destination) => boolean;
    writeEndPendingSuspenseBoundary: (destination: Destination) => boolean;
    writeEndClientRenderedSuspenseBoundary: (
      destination: Destination,
    ) => boolean;

    writeStartSegment: (
      destination: Destination,
      renderState: RenderState,
      formatContext: null,
      id: number,
    ) => boolean;
    writeEndSegment: (destination: Destination, formatContext: null) => boolean;

    writeCompletedSegmentInstruction: (
      destination: Destination,
      renderState: RenderState,
      contentSegmentID: number,
    ) => boolean;
    writeCompletedBoundaryInstruction: (
      destination: Destination,
      renderState: RenderState,
      boundary: SuspenseInstance,
      contentSegmentID: number,
    ) => boolean;

    writeClientRenderBoundaryInstruction: (
      destination: Destination,
      renderState: RenderState,
      boundary: SuspenseInstance,
    ) => boolean;

    writePreamble: (
      destination: Destination,
      resumableState: ResumableState,
      renderState: RenderState,
      willFlushAllSegments: boolean,
    ) => void;
    writeHoistables: () => void;
    writeHoistablesForBoundary: () => void;
    writePostamble: () => void;
    hoistHoistables: (parent: HoistableState, child: HoistableState) => void;
    createHoistableState: () => HoistableState;
    emitEarlyPreloads: () => void;
  }

  interface ThrownInfo {
    componentStack?: string;
  }

  export interface Request<
    Destination,
    ResumableState,
    RenderState,
    FormatContext,
  > {
    destination: null | Destination;
    flushScheduled: boolean;
    readonly resumableState: ResumableState;
    readonly renderState: RenderState;
    readonly rootFormatContext: FormatContext;
    readonly progressiveChunkSize: number;
    status: 10 | 11 | 12 | 13 | 14;
    fatalError: unknown;
    nextSegmentId: number;
    allPendingTasks: number; // when it reaches zero, we can close the connection.
    pendingRootTasks: number; // when this reaches zero, we've finished at least the root boundary.
    completedRootSegment: null | object; // Completed but not yet flushed root segments.
    abortableTasks: Set<object>;
    pingedTasks: object[]; // High priority tasks that should be worked on first.
    // Queues to flush in order of priority
    clientRenderedBoundaries: object[]; // Errored or client rendered but not yet flushed.
    completedBoundaries: object[]; // Completed but not yet fully flushed boundaries to show.
    partialBoundaries: object[]; // Partially completed boundaries that can flush its segments early.
    trackedPostpones: null | object; // Gets set to non-null while we want to track postponed holes. I.e. during a prerender.
    // onError is called when an error happens anywhere in the tree. It might recover.
    // The return string is used in production  primarily to avoid leaking internals, secondarily to save bytes.
    // Returning null/undefined will cause a defualt error message in production
    onError: (error: unknown, errorInfo: ThrownInfo) => void;
    // onAllReady is called when all pending task is done but it may not have flushed yet.
    // This is a good time to start writing if you want only HTML and no intermediate steps.
    onAllReady: () => void;
    // onShellReady is called when there is at least a root fallback ready to show.
    // Typically you don't need this callback because it's best practice to always have a
    // root fallback ready so there's no need to wait.
    onShellReady: () => void;
    // onShellError is called when the shell didn't complete. That means you probably want to
    // emit a different response to the stream instead.
    onShellError: (error: unknown) => void;
    onFatalError: (error: unknown) => void;
    // onPostpone is called when postpone() is called anywhere in the tree, which will defer
    // rendering - e.g. to the client. This is considered intentional and not an error.
    onPostpone: (reason: string, postponeInfo: ThrownInfo) => void;
    // Form state that was the result of an MPA submission, if it was provided.
    formState: null | object;
    // DEV-only, warning dedupe
    didWarnForKey?: null | WeakSet<object>;
  }

  export interface ServerRenderer<
    Destination,
    ResumableState,
    RenderState,
    FormatContext,
  > {
    createRequest: (
      children: React.ReactNode,
      resumableState: ResumableState,
      renderState: RenderState,
      rootFormatContext: FormatContext,
      progressiveChunkSize?: number,
      onError?: (error: unknown, errorInfo: ThrownInfo) => void,
      onAllReady?: () => void,
      onShellReady?: () => void,
      onShellError?: () => void,
      onFatalError?: () => void,
      onPostpone?: (reason: string, postponeInfo: ThrownInfo) => void,
      formState?: [any, string, any, number] | null,
    ) => Request<Destination, ResumableState, RenderState, FormatContext>;

    startWork: (
      request: Request<Destination, ResumableState, RenderState, FormatContext>,
    ) => void;

    startFlowing: (
      request: Request<Destination, ResumableState, RenderState, FormatContext>,
      destination: Destination,
    ) => void;
  }

  export default function <
    Destination,
    ResumableState,
    RenderState,
    FormatContext,
    SuspenseInstance,
  >(
    hostConfig: HostConfig<
      Destination,
      RenderState,
      ResumableState,
      any,
      SuspenseInstance,
      FormatContext
    >,
  ): ServerRenderer<Destination, ResumableState, RenderState, FormatContext>;
}
