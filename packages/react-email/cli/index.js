#!/usr/bin/env node
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _ts_generator(thisArg, body) {
    var f, y, t, g, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    };
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = function(to, from, except, desc) {
    if (from && typeof from === "object" || typeof from === "function") {
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            var _loop = function() {
                var key = _step.value;
                if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
                    get: function() {
                        return from[key];
                    },
                    enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
                });
            };
            for(var _iterator = __getOwnPropNames(from)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true)_loop();
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally{
            try {
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                    _iterator.return();
                }
            } finally{
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }
    return to;
};
var __toESM = function(mod, isNodeMode, target) {
    return target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(// If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
        value: mod,
        enumerable: true
    }) : target, mod);
};
// src/cli/index.ts
var import_extra_typings = require("@commander-js/extra-typings");
// package.json
var package_default = {
    name: "react-email",
    version: "1.10.1-canary.0",
    description: "A live preview of your emails right in your browser.",
    bin: {
        email: "./cli/index.js"
    },
    scripts: {
        build: "tsup",
        dev: "tsup --watch",
        clean: "rm -rf dist",
        lint: "eslint ."
    },
    files: [
        "next.config.js",
        "tailwind.config.ts",
        "tsconfig.json",
        ".eslintrc.js",
        "src/app",
        "src/components",
        "public",
        "cli"
    ],
    license: "MIT",
    repository: {
        type: "git",
        url: "https://github.com/resendlabs/react-email.git",
        directory: "packages/react-email"
    },
    keywords: [
        "react",
        "email"
    ],
    engines: {
        node: ">=18.0.0"
    },
    dependencies: {
        "@commander-js/extra-typings": "9.4.1",
        "@manypkg/find-root": "2.2.1",
        "@octokit/rest": "19.0.7",
        "@react-email/components": "workspace:*",
        "@react-email/render": "0.0.11-canary.0",
        "@types/node": "^20",
        "@types/react": "^18",
        "@types/react-dom": "^18",
        autoprefixer: "10.4.14",
        chokidar: "3.5.3",
        commander: "9.4.1",
        "detect-package-manager": "2.0.1",
        esbuild: "0.16.4",
        "fs-extra": "11.1.1",
        glob: "10.3.4",
        "log-symbols": "4.1.0",
        next: "^14.0.4",
        "normalize-path": "3.0.0",
        ora: "5.4.1",
        postcss: "8.4.32",
        react: "^18",
        "react-dom": "^18",
        "read-pkg": "5.2.0",
        shelljs: "0.8.5",
        tailwindcss: "3.3.0",
        "tree-cli": "0.6.7"
    },
    devDependencies: {
        "@swc/core": "1.3.101",
        "@types/fs-extra": "11.0.1",
        "@types/shelljs": "0.8.12",
        "eslint-config-custom": "workspace:*",
        tsconfig: "workspace:*",
        tsup: "7.2.0",
        tsx: "4.7.0",
        typescript: "5.1.6",
        watch: "1.0.2"
    }
};
// src/cli/commands/dev.ts
var import_node_fs5 = __toESM(require("fs"));
var import_shelljs7 = __toESM(require("shelljs"));
// src/cli/utils/constants.ts
var import_node_path = __toESM(require("path"));
var DEFAULT_EMAILS_DIRECTORY = "emails";
var PACKAGE_NAME = "react-email";
var CURRENT_PATH = process.cwd();
var USER_PACKAGE_JSON = import_node_path.default.join(CURRENT_PATH, "package.json");
var USER_STATIC_FILES = import_node_path.default.join(CURRENT_PATH, "emails", "static");
var REACT_EMAIL_ROOT = import_node_path.default.join(CURRENT_PATH, ".react-email");
var EVENT_FILE_DELETED = "unlink";
var PACKAGE_EMAILS_PATH = import_node_path.default.join(REACT_EMAIL_ROOT, DEFAULT_EMAILS_DIRECTORY);
var PACKAGE_PUBLIC_PATH = import_node_path.default.join(REACT_EMAIL_ROOT, "public");
// src/cli/utils/convert-to-absolute-path.ts
var import_node_path2 = __toESM(require("path"));
var convertToAbsolutePath = function(dir) {
    return import_node_path2.default.isAbsolute(dir) ? dir : import_node_path2.default.join(process.cwd(), dir);
};
// src/cli/utils/download-client.ts
var import_node_fs = __toESM(require("fs"));
var import_node_path3 = __toESM(require("path"));
var import_rest = require("@octokit/rest");
var import_fs_extra = __toESM(require("fs-extra"));
var import_shelljs = __toESM(require("shelljs"));
var downloadClient = function() {
    var _ref = _async_to_generator(function() {
        var octokit, downloadRes, TAR_PATH;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    octokit = new import_rest.Octokit();
                    return [
                        4,
                        octokit.repos.downloadTarballArchive({
                            owner: "resendlabs",
                            repo: "react-email",
                            ref: "v0.0.15-canary.0"
                        })
                    ];
                case 1:
                    downloadRes = _state.sent();
                    import_node_fs.default.mkdirSync(".react-email-temp");
                    TAR_PATH = import_node_path3.default.join(".react-email-temp", "react-email.tar.gz");
                    import_node_fs.default.writeFileSync(TAR_PATH, Buffer.from(downloadRes.data));
                    import_shelljs.default.exec("tar -xzvf .react-email-temp/react-email.tar.gz -C .react-email-temp --strip-components 1", {
                        silent: true
                    });
                    import_fs_extra.default.moveSync(import_node_path3.default.join(".react-email-temp", "client"), import_node_path3.default.join(".react-email"));
                    import_fs_extra.default.removeSync(".react-email-temp");
                    return [
                        2
                    ];
            }
        });
    });
    return function downloadClient() {
        return _ref.apply(this, arguments);
    };
}();
// src/cli/utils/generate-email-preview.ts
var import_node_fs2 = __toESM(require("fs"));
var import_node_path4 = __toESM(require("path"));
var import_ora = __toESM(require("ora"));
var import_shelljs2 = __toESM(require("shelljs"));
var import_log_symbols = __toESM(require("log-symbols"));
var import_fs_extra2 = __toESM(require("fs-extra"));
var import_glob = require("glob");
// src/cli/utils/close-ora-on-sigint.ts
var closeOraOnSIGNIT = function(spinner) {
    process.on("SIGINT", function() {
        spinner.stop();
    });
};
// src/cli/utils/generate-email-preview.ts
function osIndependentPath(p) {
    return p.split(import_node_path4.default.sep).join("/");
}
var generateEmailsPreview = function() {
    var _ref = _async_to_generator(function(emailDir) {
        var type, spinner, error;
        var _arguments = arguments;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    type = _arguments.length > 1 && _arguments[1] !== void 0 ? _arguments[1] : "all";
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        4,
                        ,
                        5
                    ]);
                    spinner = (0, import_ora.default)("Generating emails preview").start();
                    closeOraOnSIGNIT(spinner);
                    if (type === "all" || type === "templates") {
                        createEmailPreviews(emailDir);
                    }
                    if (!(type === "all" || type === "static")) return [
                        3,
                        3
                    ];
                    return [
                        4,
                        createStaticFiles()
                    ];
                case 2:
                    _state.sent();
                    _state.label = 3;
                case 3:
                    spinner.stopAndPersist({
                        symbol: import_log_symbols.default.success,
                        text: "Emails preview generated"
                    });
                    return [
                        3,
                        5
                    ];
                case 4:
                    error = _state.sent();
                    console.log({
                        error: error
                    });
                    return [
                        3,
                        5
                    ];
                case 5:
                    return [
                        2
                    ];
            }
        });
    });
    return function generateEmailsPreview(emailDir) {
        return _ref.apply(this, arguments);
    };
}();
var packageEmailsPath = osIndependentPath(PACKAGE_EMAILS_PATH);
var createEmailPreviews = function(emailDir) {
    if (import_node_fs2.default.existsSync(PACKAGE_EMAILS_PATH)) {
        import_node_fs2.default.rmSync(PACKAGE_EMAILS_PATH, {
            recursive: true
        });
    }
    import_node_fs2.default.mkdirSync(packageEmailsPath);
    var list = (0, import_glob.sync)(osIndependentPath(import_node_path4.default.join(emailDir, "/*.{jsx,tsx}")), {
        absolute: true,
        // ignore any spec or test file within the email directory
        ignore: [
            import_node_path4.default.join(emailDir, "*.?(spec|test).{jsx,tsx}")
        ]
    });
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = list[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var _absoluteSrcFilePath = _step.value;
            var absoluteSrcFilePath = osIndependentPath(_absoluteSrcFilePath);
            var fileName = absoluteSrcFilePath.split("/").pop();
            if (fileName === void 0) {
                throw new Error("Could not get file name from ".concat(absoluteSrcFilePath));
            }
            var targetFile = import_node_path4.default.join(packageEmailsPath, absoluteSrcFilePath.replace(osIndependentPath(emailDir), ""));
            var dirWithTargetFile = import_node_path4.default.dirname(targetFile);
            var importPath = import_node_path4.default.relative(dirWithTargetFile, import_node_path4.default.dirname(absoluteSrcFilePath));
            var importFile = osIndependentPath(import_node_path4.default.join(importPath, fileName));
            var sourceCode = "import Mail from '".concat(importFile, "';\nexport default Mail;\n");
            import_node_fs2.default.writeFileSync(targetFile, sourceCode);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
};
var createStaticFiles = function() {
    var _ref = _async_to_generator(function() {
        var hasPublicDirectory, userHasStaticDirectory, result;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    hasPublicDirectory = import_node_fs2.default.existsSync(PACKAGE_PUBLIC_PATH);
                    if (!hasPublicDirectory) return [
                        3,
                        2
                    ];
                    return [
                        4,
                        import_node_fs2.default.promises.rm(PACKAGE_PUBLIC_PATH, {
                            recursive: true
                        })
                    ];
                case 1:
                    _state.sent();
                    _state.label = 2;
                case 2:
                    return [
                        4,
                        import_fs_extra2.default.ensureDir(import_node_path4.default.join(PACKAGE_PUBLIC_PATH, "static"))
                    ];
                case 3:
                    _state.sent();
                    userHasStaticDirectory = import_node_fs2.default.existsSync(import_node_path4.default.join(CURRENT_PATH, "static"));
                    if (userHasStaticDirectory) {
                        result = import_shelljs2.default.cp("-r", import_node_path4.default.join(CURRENT_PATH, "static"), import_node_path4.default.join(PACKAGE_PUBLIC_PATH));
                        if (result.code > 0) {
                            throw new Error("Something went wrong while copying the file to ".concat(import_node_path4.default.join(CURRENT_PATH, "static"), ", ").concat(result.cat()));
                        }
                    }
                    return [
                        2
                    ];
            }
        });
    });
    return function createStaticFiles() {
        return _ref.apply(this, arguments);
    };
}();
// src/cli/utils/install-dependencies.ts
var import_node_path5 = __toESM(require("path"));
var import_shelljs3 = __toESM(require("shelljs"));
var import_ora2 = __toESM(require("ora"));
var import_log_symbols2 = __toESM(require("log-symbols"));
// src/cli/utils/start-server-command.ts
var import_node_path6 = __toESM(require("path"));
var import_node_http = __toESM(require("http"));
var import_node_url = __toESM(require("url"));
var import_shelljs4 = __toESM(require("shelljs"));
var import_next = __toESM(require("next"));
var processesToKill = [];
function execAsync(command) {
    var process2 = import_shelljs4.default.exec(command, {
        async: true
    });
    processesToKill.push(process2);
    process2.on("close", function() {
        processesToKill = processesToKill.filter(function(p) {
            return p !== process2;
        });
    });
}
var startDevServer = function() {
    var _ref = _async_to_generator(function(_packageManager, port) {
        var app, nextHandleRequest;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    app = (0, import_next.default)({
                        dev: true,
                        hostname: "localhost",
                        port: parseInt(port),
                        customServer: true,
                        dir: import_node_path6.default.resolve(__dirname, "..")
                    });
                    return [
                        4,
                        app.prepare()
                    ];
                case 1:
                    _state.sent();
                    nextHandleRequest = app.getRequestHandler();
                    import_node_http.default.createServer(function(req, res) {
                        if (!req.url) {
                            res.end(404);
                            return;
                        }
                        var parsedUrl = import_node_url.default.parse(req.url, true);
                        res.setHeader("Cache-Control", "no-cache, max-age=0, must-revalidate, no-store");
                        res.setHeader("Pragma", "no-cache");
                        res.setHeader("Expires", "-1");
                        try {
                            void nextHandleRequest(req, res, parsedUrl);
                        } catch (e) {
                            console.error("caught error", e);
                            res.writeHead(500);
                            res.end();
                        }
                    }).listen(port, function() {
                        console.log("running preview at localhost:".concat(port));
                    }).on("error", function(e) {
                        if (e.code === "EADDRINUSE") {
                            console.error("port ".concat(port, " is already in use"));
                        } else {
                            console.error("preview server error: ", JSON.stringify(e));
                        }
                        process.exit(1);
                    });
                    return [
                        2
                    ];
            }
        });
    });
    return function startDevServer(_packageManager, port) {
        return _ref.apply(this, arguments);
    };
}();
var startProdServer = function(packageManager, port) {
    execAsync("".concat(packageManager, " run start -- -p ").concat(port));
};
var buildProdServer = function(packageManager) {
    execAsync("".concat(packageManager, " run build"));
    process.on("close", function(code) {
        import_shelljs4.default.exit(code !== null && code !== void 0 ? code : void 0);
    });
};
var exitHandler = function(options) {
    return function(code) {
        if (processesToKill.length > 0) {
            console.log("shutting down %d subprocesses", processesToKill.length);
        }
        processesToKill.forEach(function(p) {
            if (p.connected) {
                p.kill();
            }
        });
        if (options === null || options === void 0 ? void 0 : options.exit) {
            import_shelljs4.default.exit(code);
        }
    };
};
process.on("exit", exitHandler());
process.on("SIGINT", exitHandler({
    exit: true
}));
process.on("SIGUSR1", exitHandler({
    exit: true
}));
process.on("SIGUSR2", exitHandler({
    exit: true
}));
process.on("uncaughtException", exitHandler({
    exit: true
}));
// src/cli/utils/sync-package.ts
var import_node_fs3 = __toESM(require("fs"));
var import_node_path7 = __toESM(require("path"));
var import_read_pkg = __toESM(require("read-pkg"));
// src/cli/utils/watcher.ts
var import_node_fs4 = __toESM(require("fs"));
var import_node_path8 = __toESM(require("path"));
var import_chokidar = require("chokidar");
var import_shelljs5 = require("shelljs");
var createWatcherInstance = function(watchDir) {
    var watcher2 = (0, import_chokidar.watch)(watchDir, {
        ignoreInitial: true,
        cwd: watchDir.split(import_node_path8.default.sep).slice(0, -1).join(import_node_path8.default.sep),
        ignored: /(^|[/\\])\../
    });
    var exit = function() {
        void watcher2.close();
    };
    process.on("SIGINT", exit);
    process.on("uncaughtException", exit);
    return watcher2;
};
var watcher = function(watcherInstance, watchDir) {
    watcherInstance.on("all", function(event, filename) {
        var file = filename.split(import_node_path8.default.sep);
        if (file[1] === void 0) {
            return;
        }
        if (event === EVENT_FILE_DELETED) {
            if (file[1] === "static" && file[2]) {
                import_node_fs4.default.rmSync(import_node_path8.default.join(REACT_EMAIL_ROOT, "public", "static", file[2]));
                return;
            }
            import_node_fs4.default.rmSync(import_node_path8.default.join(REACT_EMAIL_ROOT, filename));
            return;
        }
        if (file[1] === "static" && file[2]) {
            var srcPath = import_node_path8.default.join(watchDir, "static", file[2]);
            var result = (0, import_shelljs5.cp)("-r", srcPath, import_node_path8.default.join(REACT_EMAIL_ROOT, "public", "static"));
            if (result.code > 0) {
                throw new Error("Something went wrong while copying the file to ".concat(PACKAGE_EMAILS_PATH, ", ").concat(result.cat()));
            }
            return;
        }
        void generateEmailsPreview(watchDir, "templates");
    });
};
// src/cli/utils/run-server.ts
var import_node_path9 = __toESM(require("path"));
var import_detect_package_manager = require("detect-package-manager");
var import_find_root = require("@manypkg/find-root");
var import_shelljs6 = __toESM(require("shelljs"));
var setupServer = function() {
    var _ref = _async_to_generator(function(type, dir, port) {
        var _skipInstall, cwd, emailDir, packageManager, watcherInstance;
        var _arguments = arguments;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _skipInstall = _arguments.length > 3 && _arguments[3] !== void 0 ? _arguments[3] : false;
                    return [
                        4,
                        (0, import_find_root.findRoot)(CURRENT_PATH).catch(function() {
                            return {
                                rootDir: CURRENT_PATH
                            };
                        })
                    ];
                case 1:
                    cwd = _state.sent();
                    emailDir = convertToAbsolutePath(dir);
                    return [
                        4,
                        (0, import_detect_package_manager.detect)({
                            cwd: cwd.rootDir
                        }).catch(function() {
                            return "npm";
                        })
                    ];
                case 2:
                    packageManager = _state.sent();
                    if (type !== "start") {}
                    if (!(type === "dev")) return [
                        3,
                        4
                    ];
                    watcherInstance = createWatcherInstance(emailDir);
                    return [
                        4,
                        startDevServer(packageManager, port)
                    ];
                case 3:
                    _state.sent();
                    watcher(watcherInstance, emailDir);
                    return [
                        3,
                        5
                    ];
                case 4:
                    if (type === "build") {
                        buildProdServer(packageManager);
                    } else {
                        import_shelljs6.default.cd(import_node_path9.default.join(REACT_EMAIL_ROOT));
                        startProdServer(packageManager, port);
                    }
                    _state.label = 5;
                case 5:
                    return [
                        2
                    ];
            }
        });
    });
    return function setupServer(type, dir, port) {
        return _ref.apply(this, arguments);
    };
}();
// src/cli/commands/dev.ts
var dev = function() {
    var _ref = _async_to_generator(function(param) {
        var dir, port, skipInstall, error;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    dir = param.dir, port = param.port, skipInstall = param.skipInstall;
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        5,
                        ,
                        6
                    ]);
                    if (!import_node_fs5.default.existsSync(dir)) {
                        throw new Error("Missing ".concat(dir, " folder"));
                    }
                    if (!import_node_fs5.default.existsSync(REACT_EMAIL_ROOT)) return [
                        3,
                        3
                    ];
                    return [
                        4,
                        setupServer("dev", dir, port, skipInstall)
                    ];
                case 2:
                    _state.sent();
                    return [
                        2
                    ];
                case 3:
                    return [
                        4,
                        setupServer("dev", dir, port, skipInstall)
                    ];
                case 4:
                    _state.sent();
                    return [
                        3,
                        6
                    ];
                case 5:
                    error = _state.sent();
                    console.log(error);
                    import_shelljs7.default.exit(1);
                    return [
                        3,
                        6
                    ];
                case 6:
                    return [
                        2
                    ];
            }
        });
    });
    return function dev(_) {
        return _ref.apply(this, arguments);
    };
}();
// src/cli/commands/preview.ts
var import_node_fs6 = __toESM(require("fs"));
var import_shelljs8 = __toESM(require("shelljs"));
var buildPreview = function() {
    var _ref = _async_to_generator(function(param) {
        var dir, error;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    dir = param.dir;
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        6,
                        ,
                        7
                    ]);
                    if (!import_node_fs6.default.existsSync(REACT_EMAIL_ROOT)) return [
                        3,
                        3
                    ];
                    return [
                        4,
                        setupServer("build", dir, "")
                    ];
                case 2:
                    _state.sent();
                    return [
                        2
                    ];
                case 3:
                    return [
                        4,
                        downloadClient()
                    ];
                case 4:
                    _state.sent();
                    return [
                        4,
                        setupServer("build", dir, "")
                    ];
                case 5:
                    _state.sent();
                    return [
                        3,
                        7
                    ];
                case 6:
                    error = _state.sent();
                    console.log(error);
                    import_shelljs8.default.exit(1);
                    return [
                        3,
                        7
                    ];
                case 7:
                    return [
                        2
                    ];
            }
        });
    });
    return function buildPreview(_) {
        return _ref.apply(this, arguments);
    };
}();
var startPreview = function() {
    var _ref = _async_to_generator(function(param) {
        var port, error;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    port = param.port;
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        6,
                        ,
                        7
                    ]);
                    if (!import_node_fs6.default.existsSync(REACT_EMAIL_ROOT)) return [
                        3,
                        3
                    ];
                    return [
                        4,
                        setupServer("start", "", port)
                    ];
                case 2:
                    _state.sent();
                    return [
                        2
                    ];
                case 3:
                    return [
                        4,
                        downloadClient()
                    ];
                case 4:
                    _state.sent();
                    return [
                        4,
                        setupServer("start", "", port)
                    ];
                case 5:
                    _state.sent();
                    return [
                        3,
                        7
                    ];
                case 6:
                    error = _state.sent();
                    console.log(error);
                    import_shelljs8.default.exit(1);
                    return [
                        3,
                        7
                    ];
                case 7:
                    return [
                        2
                    ];
            }
        });
    });
    return function startPreview(_) {
        return _ref.apply(this, arguments);
    };
}();
// src/cli/commands/export.ts
var import_node_fs7 = __toESM(require("fs"));
var import_node_path10 = __toESM(require("path"));
var import_glob2 = require("glob");
var import_esbuild = __toESM(require("esbuild"));
var import_ora3 = __toESM(require("ora"));
var import_log_symbols3 = __toESM(require("log-symbols"));
var import_render = require("@react-email/render");
var import_normalize_path = __toESM(require("normalize-path"));
var import_shelljs9 = __toESM(require("shelljs"));
// src/cli/utils/tree.ts
var import_tree_cli = __toESM(require("tree-cli"));
var tree = function() {
    var _ref = _async_to_generator(function(dir, depth) {
        var report;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        (0, import_tree_cli.default)({
                            l: depth,
                            base: dir
                        })
                    ];
                case 1:
                    report = _state.sent().report;
                    return [
                        2,
                        report
                    ];
            }
        });
    });
    return function tree(dir, depth) {
        return _ref.apply(this, arguments);
    };
}();
// src/cli/commands/export.ts
var exportTemplates = function() {
    var _ref = _async_to_generator(function(outDir, srcDir, options) {
        var spinner, allTemplates, buildResult, allBuiltTemplates, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, template, component, rendered, htmlPath, exception, err, staticDir, hasStaticDirectory, result, fileTree;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    spinner = (0, import_ora3.default)("Preparing files...\n").start();
                    closeOraOnSIGNIT(spinner);
                    allTemplates = import_glob2.glob.sync((0, import_normalize_path.default)(import_node_path10.default.join(srcDir, "*.{tsx,jsx}")));
                    buildResult = import_esbuild.default.buildSync({
                        bundle: true,
                        entryPoints: allTemplates,
                        platform: "node",
                        write: true,
                        tsconfig: import_node_path10.default.join(__dirname, "..", "tsconfig.export.json"),
                        outdir: outDir
                    });
                    if (buildResult.warnings.length > 0) {
                        console.warn(buildResult.warnings);
                    }
                    if (buildResult.errors.length > 0) {
                        spinner.stopAndPersist({
                            symbol: import_log_symbols3.default.error,
                            text: "Failed to build emails"
                        });
                        console.error(buildResult.errors);
                        throw new Error("esbuild bundling process for email templates:\n".concat(allTemplates.map(function(p) {
                            return "- ".concat(p);
                        }).join("\n")));
                    }
                    spinner.succeed();
                    allBuiltTemplates = import_glob2.glob.sync((0, import_normalize_path.default)("".concat(outDir, "/*.js")), {
                        absolute: true
                    });
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        8,
                        9,
                        10
                    ]);
                    _iterator = allBuiltTemplates[Symbol.iterator]();
                    _state.label = 2;
                case 2:
                    if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                        3,
                        7
                    ];
                    template = _step.value;
                    _state.label = 3;
                case 3:
                    _state.trys.push([
                        3,
                        5,
                        ,
                        6
                    ]);
                    spinner.text = "rendering ".concat(template.split("/").pop());
                    spinner.render();
                    return [
                        4,
                        import(template)
                    ];
                case 4:
                    component = _state.sent();
                    rendered = (0, import_render.render)(component.default({}), options);
                    htmlPath = template.replace(".js", options.plainText ? ".txt" : ".html");
                    (0, import_node_fs7.writeFileSync)(htmlPath, rendered);
                    (0, import_node_fs7.unlinkSync)(template);
                    return [
                        3,
                        6
                    ];
                case 5:
                    exception = _state.sent();
                    spinner.stopAndPersist({
                        symbol: import_log_symbols3.default.error,
                        text: "failed when rendering ".concat(template.split("/").pop())
                    });
                    console.error(exception);
                    throw exception;
                case 6:
                    _iteratorNormalCompletion = true;
                    return [
                        3,
                        2
                    ];
                case 7:
                    return [
                        3,
                        10
                    ];
                case 8:
                    err = _state.sent();
                    _didIteratorError = true;
                    _iteratorError = err;
                    return [
                        3,
                        10
                    ];
                case 9:
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                    return [
                        7
                    ];
                case 10:
                    spinner.succeed("Rendered all files");
                    spinner.text = "Copying static files";
                    spinner.render();
                    staticDir = import_node_path10.default.join(srcDir, "static");
                    hasStaticDirectory = import_node_fs7.default.existsSync(staticDir);
                    if (hasStaticDirectory) {
                        result = import_shelljs9.default.cp("-r", staticDir, import_node_path10.default.join(outDir, "static"));
                        if (result.code > 0) {
                            spinner.stopAndPersist({
                                symbol: import_log_symbols3.default.error,
                                text: "Failed to copy static files"
                            });
                            throw new Error("Something went wrong while copying the file to ".concat(outDir, "/static, ").concat(result.cat()));
                        }
                    }
                    spinner.succeed();
                    return [
                        4,
                        tree(outDir, 4)
                    ];
                case 11:
                    fileTree = _state.sent();
                    console.log(fileTree);
                    spinner.stopAndPersist({
                        symbol: import_log_symbols3.default.success,
                        text: "Successfully exported emails"
                    });
                    process.exit();
                    return [
                        2
                    ];
            }
        });
    });
    return function exportTemplates(outDir, srcDir, options) {
        return _ref.apply(this, arguments);
    };
}();
// src/cli/index.ts
import_extra_typings.program.name(PACKAGE_NAME).description("A live preview of your emails right in your browser").version(package_default.version);
import_extra_typings.program.command("dev").description("Starts the application in development mode").option("-d, --dir <path>", "Directory with your email templates", "./emails").option("-p --port <port>", "Port to run dev server on", "3000").option("-s, --skip-install", "Do not install dependencies", false).action(dev);
import_extra_typings.program.command("build").description("Builds a production preview app").option("-d, --dir <path>", "Directory with your email templates", "./emails").action(buildPreview);
import_extra_typings.program.command("start").description("Starts the production build of the preview app").option("-p --port <port>", "Port to run production server on", "3000").action(startPreview);
import_extra_typings.program.command("export").description("Build the templates to the `out` directory").option("--outDir <path>", "Output directory", "out").option("-p, --pretty", "Pretty print the output", false).option("-t, --plainText", "Set output format as plain text", false).option("-d, --dir <path>", "Directory with your email templates", "./emails").action(function(param) {
    var outDir = param.outDir, pretty = param.pretty, plainText = param.plainText, srcDir = param.dir;
    return exportTemplates(outDir, srcDir, {
        pretty: pretty,
        plainText: plainText
    });
});
import_extra_typings.program.parse();
