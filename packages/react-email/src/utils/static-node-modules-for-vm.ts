import zlib from 'node:zlib';
import vm from 'node:vm';
import v8 from 'node:v8';
import util from 'node:util';
import url from 'node:url';
import tty from 'node:tty';
import tls from 'node:tls';
import timers from 'node:timers';
import stringDecoder from 'node:string_decoder';
import stream from 'node:stream';
import readline from 'node:readline';
import querystring from 'node:querystring';
import punycode from 'node:punycode';
import path from 'node:path';
import os from 'node:os';
import net from 'node:net';
import https from 'node:https';
import http from 'node:http';
import fs from 'node:fs';
import events from 'node:events';
import domain from 'node:domain';
import dns from 'node:dns';
import dgram from 'node:dgram';
import crypto from 'node:crypto';
import cluster from 'node:cluster';
import childProcess from 'node:child_process';
import buffer from 'node:buffer';
import assert from 'node:assert';
import asyncHooks from 'node:async_hooks';

/**
 * A map of the name of the modules (including `node:` prefixed ones)
 * provided by Node because dynamic requires of them, even on the server
 * will not be resolved properly
 */
export const staticNodeModulesForVM = {
  zlib,
  'node:zlib': zlib,
  vm,
  'node:vm': vm,
  v8,
  'node:v8': v8,
  util,
  'node:util': util,
  url,
  'node:url': url,
  tty,
  'node:tty': tty,
  tls,
  'node:tls': tls,
  timers,
  'node:timers': timers,
  'string_decoder': stringDecoder,
  'node:string_decoder': stringDecoder,
  stream,
  'node:stream': stream,
  readline,
  'node:readline': readline,
  querystring,
  'node:querystring': querystring,
  punycode,
  'node:punycode': punycode,
  path,
  'node:path': path,
  os,
  'node:os': os,
  net,
  'node:net': net,
  https,
  'node:https': https,
  http,
  'node:http': http,
  fs,
  'node:fs': fs,
  'fs/promises': fs.promises,
  'node:fs/promises': fs.promises,
  events,
  'node:events': events,
  domain,
  'node:domain': domain,
  dns,
  'node:dns': dns,
  dgram,
  'node:dgram': dgram,
  crypto,
  'node:crypto': crypto,
  cluster,
  'node:cluster': cluster,
  'child_process': childProcess,
  'node:child_process': childProcess,
  buffer,
  'node:buffer': buffer,
  assert,
  'node:assert': assert,
  'async_hooks': asyncHooks,
  'node:async_hooks': asyncHooks,
};
