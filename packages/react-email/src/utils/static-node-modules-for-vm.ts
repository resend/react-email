import assert from 'node:assert';
import asyncHooks from 'node:async_hooks';
import buffer from 'node:buffer';
import childProcess from 'node:child_process';
import cluster from 'node:cluster';
import console from 'node:console';
import constants from 'node:constants';
import crypto from 'node:crypto';
import dgram from 'node:dgram';
import diagnosticsChannel from 'node:diagnostics_channel';
import dns from 'node:dns';
import domain from 'node:domain';
import events from 'node:events';
import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import http from 'node:http';
import http2 from 'node:http2';
import https from 'node:https';
import inspector from 'node:inspector';
import module from 'node:module';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import perfHooks from 'node:perf_hooks';
import process from 'node:process';
import punycode from 'node:punycode';
import querystring from 'node:querystring';
import readline from 'node:readline';
import repl from 'node:repl';
import stream from 'node:stream';
import stringDecoder from 'node:string_decoder';
import timers from 'node:timers';
import timersPromises from 'node:timers/promises';
import tls from 'node:tls';
import tty from 'node:tty';
import url from 'node:url';
import util from 'node:util';
import utilTypes from 'node:util/types';
import v8 from 'node:v8';
import vm from 'node:vm';
import workerThreads from 'node:worker_threads';
import zlib from 'node:zlib';

/**
 * A map of the name of the modules (including `node:` prefixed ones)
 * provided by Node because dynamic requires of them, even on the server
 * will not be resolved properly
 */
export const staticNodeModulesForVM = {
  assert,
  async_hooks: asyncHooks,
  buffer,
  child_process: childProcess,
  cluster,
  console,
  constants,
  crypto,
  dgram,
  diagnostics_channel: diagnosticsChannel,
  dns,
  domain,
  events,
  fs,
  'fs/promises': fsPromises,
  http,
  http2,
  https,
  inspector,
  module,
  net,
  os,
  path,
  perf_hooks: perfHooks,
  process,
  punycode,
  querystring,
  readline,
  repl,
  stream,
  string_decoder: stringDecoder,
  timers,
  'timers/promises': timersPromises,
  tls,
  tty,
  url,
  util,
  'util/types': utilTypes,
  v8,
  vm,
  worker_threads: workerThreads,
  zlib,
};
