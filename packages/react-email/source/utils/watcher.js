var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import chokidar from 'chokidar';
import { CLIENT_EMAILS_PATH, CURRENT_PATH, DOT_EMAIL_DEV, EVENT_FILE_DELETED, PACKAGE_EMAILS_PATH, } from './contants';
import fs from 'fs';
import path from 'path';
import copy from 'cpy';
export const watcher = () => chokidar
    .watch(CURRENT_PATH, { ignoreInitial: true, cwd: CURRENT_PATH })
    .on('all', (event, filename) => __awaiter(void 0, void 0, void 0, function* () {
    if (event === EVENT_FILE_DELETED) {
        yield fs.promises.rm(path.join(DOT_EMAIL_DEV, filename));
    }
    else {
        yield copy(CLIENT_EMAILS_PATH, PACKAGE_EMAILS_PATH);
    }
}));
