var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/*
 * Copyright 2018 Yang Wu.
 *
 *	Licensed under the Apache License, Version 2.0 (the "License");
 *	you may not use this file except in compliance with the License.
 *	You may obtain a copy of the License at
 *
 *		http://www.apache.org/licenses/LICENSE-2.0
 *
 *		Unless required by applicable law or agreed to in writing, software
 *		distributed under the License is distributed on an "AS IS" BASIS,
 *		WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *		See the License for the specific language governing permissions and
 *		limitations under the License.
 */
/**
 * 注入绑定器类
 */
var riggerIOC;
(function (riggerIOC) {
    var InjectionBinder = /** @class */ (function () {
        function InjectionBinder() {
            this.bindedMap = {};
            this.stringBindedMap = {};
            this.registerKey = "_register_key";
        }
        Object.defineProperty(InjectionBinder, "instance", {
            // private nowBindId: number = 1;
            get: function () {
                if (!InjectionBinder.mInstance) {
                    InjectionBinder.mInstance = new InjectionBinder();
                }
                return InjectionBinder.mInstance;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 绑定一个类或字符串,不会重复绑定，如果已经存在绑定信息，则仅仅返回原来的绑定信息
         *
         * @param ctrOrStr 要绑定类的构造函数,推荐绑定抽象类
         * @return 返回对应的绑定信息
         */
        InjectionBinder.prototype.bind = function (ctrOrStr) {
            if (riggerIOC.Utils.isString(ctrOrStr)) {
                return this.bindString(ctrOrStr);
            }
            else {
                return this.bindClass(ctrOrStr);
            }
        };
        InjectionBinder.prototype.bindClass = function (cls) {
            // console.log("bind");
            if (!cls)
                return null;
            // 查找是否已经有绑定过了
            var info = this.findClassBindInfo(cls);
            if (!info) {
                var id = riggerIOC.InjectionWrapper.wrap(cls);
                info = new riggerIOC.InjectionBindInfo(cls);
                this.bindedMap[id] = info;
            }
            return info;
        };
        /**
         * 对字符串进行绑定
         * @param str
         */
        InjectionBinder.prototype.bindString = function (str) {
            if (!str)
                return null;
            var info = this.findStringBindInfo(str);
            if (!info) {
                this.stringBindedMap[str] = info = new riggerIOC.InjectionBindInfo(str, riggerIOC.BindInfoKeyType.STRING);
            }
            return info;
        };
        InjectionBinder.prototype.registerInjection = function (target, attName) {
            var arr = target[this.registerKey];
            if (!arr)
                arr = target[this.registerKey] = [];
            arr.push(attName);
        };
        InjectionBinder.prototype.getRegisteredInjection = function (target) {
            if (!target)
                return [];
            return target[this.registerKey] || [];
        };
        /**
         * 进行注入
         * @param obj
         */
        InjectionBinder.prototype.inject = function (obj) {
            var prototype = obj["__proto__"];
            var arr = prototype[this.registerKey];
            if (!arr || arr.length <= 0)
                return;
            var len = arr.length;
            for (var i = 0; i < len; ++i) {
                obj[arr[i]];
            }
        };
        /**
         * 解绑
         * @param ctrOrStr
         */
        InjectionBinder.prototype.unbind = function (ctrOrStr) {
            if (riggerIOC.Utils.isString(ctrOrStr)) {
                this.unbindString(ctrOrStr);
            }
            else {
                this.unbindClass(ctrOrStr);
            }
        };
        InjectionBinder.prototype.unbindString = function (str) {
            this.disposeStringBindInfo(str);
        };
        InjectionBinder.prototype.unbindClass = function (ctr) {
            this.disposeClassBindInfo(ctr);
        };
        /**
         * 从绑定列表中找到指定的绑定信息
         * @param ctrOrStr 指定的构造函数或字符串，是绑定信息的键
         */
        InjectionBinder.prototype.findBindInfo = function (ctrOrStr) {
            if (riggerIOC.Utils.isString(ctrOrStr)) {
                return this.findStringBindInfo(ctrOrStr);
            }
            return this.findClassBindInfo(ctrOrStr);
        };
        InjectionBinder.prototype.findClassBindInfo = function (ctr) {
            if (!ctr)
                return null;
            if (!this.bindedMap)
                return null;
            var id = riggerIOC.InjectionWrapper.getId(ctr);
            if (!id)
                return null;
            return this.bindedMap[id];
        };
        /**
         * 查找给定字符串的绑定信息
         * @param str
         */
        InjectionBinder.prototype.findStringBindInfo = function (str) {
            if (!str)
                return null;
            if (!this.stringBindedMap)
                return null;
            return this.stringBindedMap[str];
        };
        InjectionBinder.prototype.disposeBindInfo = function (clsOrStr) {
            if (riggerIOC.Utils.isString(clsOrStr)) {
                this.disposeStringBindInfo(clsOrStr);
            }
            else {
                this.disposeClassBindInfo(clsOrStr);
            }
        };
        InjectionBinder.prototype.disposeClassBindInfo = function (cls) {
            if (!cls)
                return;
            var id = riggerIOC.InjectionWrapper.getId(cls);
            if (!id)
                return;
            var info = this.bindedMap[id];
            if (info) {
                info.dispose();
                delete this.bindedMap[id];
            }
            info = null;
        };
        InjectionBinder.prototype.disposeStringBindInfo = function (str) {
            if (!str)
                return;
            var info = this.stringBindedMap[str];
            if (info) {
                info.dispose();
                delete this.stringBindedMap[str];
            }
            info = null;
        };
        return InjectionBinder;
    }());
    riggerIOC.InjectionBinder = InjectionBinder;
})(riggerIOC || (riggerIOC = {}));
var riggerIOC;
(function (riggerIOC) {
    var ApplicationInjectionBinder = /** @class */ (function (_super) {
        __extends(ApplicationInjectionBinder, _super);
        function ApplicationInjectionBinder(appId, injectionBinder, owner) {
            var _this = _super.call(this) || this;
            _this.infos = {};
            _this.stringBindInfos = {};
            _this.appId = appId;
            _this.owner = owner;
            if (injectionBinder instanceof ApplicationInjectionBinder) {
                _this.injectionBinder = injectionBinder.injectionBinder;
            }
            else {
                _this.injectionBinder = injectionBinder;
            }
            return _this;
        }
        ApplicationInjectionBinder.prototype.bind = function (ctrOrStr) {
            var info;
            if (riggerIOC.Utils.isString(ctrOrStr)) {
                info = this.injectionBinder.bindString(ctrOrStr);
                this.addStringBindInfo(ctrOrStr, info);
            }
            else {
                info = this.injectionBinder.bindClass(ctrOrStr);
                this.addClassBindInfo(ctrOrStr, info);
            }
            return info;
        };
        /**
         * debug 版
         * @param ctrOrStr
         */
        ApplicationInjectionBinder.prototype.bindDebug = function (ctrOrStr) {
            var info;
            if (riggerIOC.Utils.isString(ctrOrStr)) {
                info = this.injectionBinder.bindString(ctrOrStr);
                this.addStringBindInfo(ctrOrStr, info);
            }
            else {
                info = this.injectionBinder.bindClass(ctrOrStr);
                this.addClassBindInfo(ctrOrStr, info);
            }
            info.appId = this.appId;
            return info;
        };
        /**
         * 注册注入
         * @param target
         * @param attName
         */
        ApplicationInjectionBinder.prototype.registerInjection = function (target, attName) {
            this.injectionBinder.registerInjection(target, attName);
        };
        /**
         * 进行注入
         * @param obj
         */
        ApplicationInjectionBinder.prototype.inject = function (obj) {
            this.injectionBinder.inject(obj);
        };
        /**
         * 解绑
         * @param ctrOrStr
         */
        ApplicationInjectionBinder.prototype.unbind = function (ctrOrStr) {
            if (riggerIOC.Utils.isString(ctrOrStr)) {
                this.unbindString(ctrOrStr);
            }
            else {
                this.unbindClass(ctrOrStr);
            }
        };
        ApplicationInjectionBinder.prototype.unbindClass = function (ctr) {
            this.removeClassBindInfo(ctr);
            this.injectionBinder.unbindClass(ctr);
        };
        ApplicationInjectionBinder.prototype.unbindString = function (str) {
            this.removeStringBindInfo(str);
            this.injectionBinder.unbindString(str);
        };
        /**
         * 从绑定列表中找到指定的绑定信息
         * @param ctrOrStr 指定的构造函数或字符串，是绑定信息的键
         */
        ApplicationInjectionBinder.prototype.findBindInfo = function (ctrOrStr) {
            return this.injectionBinder.findBindInfo(ctrOrStr);
        };
        ApplicationInjectionBinder.prototype.dispose = function () {
            for (var k in this.infos) {
                this.unbindClass(this.infos[k].cls);
            }
            for (var k in this.stringBindInfos) {
                this.unbindString(this.stringBindInfos[k].cls);
            }
            this.infos = {};
            this.stringBindInfos = {};
            this.injectionBinder = null;
            this.owner = null;
        };
        /**
         * 增加绑定信息
         * @param ctrOrStr
         * @param info
         */
        // private addBindInfo(ctrOrStr: Function | string, info: InjectionBindInfo): void {
        // 	if (Utils.isString(ctrOrStr)) {
        // 		this.addStringBindInfo(ctrOrStr, info);
        // 	}
        // 	else {
        // 		this.addClassBindInfo(ctrOrStr, info);
        // 	}
        // }
        ApplicationInjectionBinder.prototype.addStringBindInfo = function (str, info) {
            if (!this.stringBindInfos)
                this.stringBindInfos = {};
            this.stringBindInfos[str] = info;
        };
        ApplicationInjectionBinder.prototype.addClassBindInfo = function (ctr, info) {
            if (!this.infos)
                this.infos = {};
            var bindId = riggerIOC.InjectionWrapper.getId(ctr);
            this.infos[bindId] = info;
        };
        /**
         * 移除绑定信息
         * @param ctrOrStr
         */
        // private removeBindInfo(ctrOrStr: Function | string): void {
        // 	if (Utils.isString(ctrOrStr)) {
        // 		this.removeStringBindInfo(ctrOrStr);
        // 	}
        // 	else {
        // 		this.removeClassBindInfo(ctrOrStr);
        // 	}
        // }
        ApplicationInjectionBinder.prototype.removeStringBindInfo = function (str) {
            delete this.stringBindInfos[str];
        };
        ApplicationInjectionBinder.prototype.removeClassBindInfo = function (ctr) {
            delete this.infos[riggerIOC.InjectionWrapper.getId(ctr)];
        };
        return ApplicationInjectionBinder;
    }(riggerIOC.InjectionBinder));
    riggerIOC.ApplicationInjectionBinder = ApplicationInjectionBinder;
    function setApplicationInjectionBinderDebug() {
        ApplicationInjectionBinder.prototype.bind = ApplicationInjectionBinder.prototype.bindDebug;
    }
    riggerIOC.setApplicationInjectionBinderDebug = setApplicationInjectionBinderDebug;
})(riggerIOC || (riggerIOC = {}));
/*
 * Copyright 2018 Yang Wu.
 *
 *	Licensed under the Apache License, Version 2.0 (the "License");
 *	you may not use this file except in compliance with the License.
 *	You may obtain a copy of the License at
 *
 *		http://www.apache.org/licenses/LICENSE-2.0
 *
 *		Unless required by applicable law or agreed to in writing, software
 *		distributed under the License is distributed on an "AS IS" BASIS,
 *		WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *		See the License for the specific language governing permissions and
 *		limitations under the License.
 */
var riggerIOC;
(function (riggerIOC) {
    var BindInfoKeyType;
    (function (BindInfoKeyType) {
        BindInfoKeyType[BindInfoKeyType["CONSTRUCTOR"] = 1] = "CONSTRUCTOR";
        BindInfoKeyType[BindInfoKeyType["STRING"] = 2] = "STRING";
    })(BindInfoKeyType = riggerIOC.BindInfoKeyType || (riggerIOC.BindInfoKeyType = {}));
    var InjectionBindInfo = /** @class */ (function () {
        function InjectionBindInfo(ctr, keyType) {
            if (keyType === void 0) { keyType = BindInfoKeyType.CONSTRUCTOR; }
            this.appId = null;
            this.cls = null;
            this.mBindCls = null;
            this.isSingleton = false;
            this.mInstance = null;
            this.isToValue = false;
            this.init(ctr, keyType);
        }
        Object.defineProperty(InjectionBindInfo.prototype, "realClass", {
            get: function () {
                if (this.mBindCls)
                    return this.mBindCls;
                if (this.keyType == BindInfoKeyType.STRING)
                    return null;
                return this.cls;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InjectionBindInfo.prototype, "instance", {
            // private isAutoDispose: boolean = false;
            /**
             * 实例，只有当为单例模式时才会给此字段赋值
             */
            get: function () {
                return this.mInstance;
            },
            set: function (v) {
                // 先将新值引用计数+1
                if (v) {
                    riggerIOC.addRefCount(v);
                }
                // 再将原来的值的引用计数-1
                var oldV = this.mInstance;
                if (oldV) {
                    riggerIOC.addRefCount(oldV, -1);
                }
                this.mInstance = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InjectionBindInfo.prototype, "hasInstance", {
            /**
             * 是否注入类的实例
             */
            get: function () {
                return !!this.instance;
            },
            enumerable: true,
            configurable: true
        });
        InjectionBindInfo.prototype.dispose = function () {
            this.cls = null;
            this.mBindCls = null;
            // if (riggerIOC.needAutoDispose(this.instance)) {
            // 	riggerIOC.doAutoDispose(this.instance);
            // }
            this.instance = null;
        };
        /**
         * 绑定到目标类
         * @param ctr 目标类的构造函数
         */
        InjectionBindInfo.prototype.to = function (ctr) {
            // 不能绑定到自身
            if (ctr === this.cls)
                throw new Error("can not bind to self.");
            this.mBindCls = ctr;
            return this;
        };
        /**
         * 绑定到值，此时会自动进行单例绑定
         * 可以绑定为null 或 undefined
         * @param value
         */
        InjectionBindInfo.prototype.toValue = function (value) {
            this.isToValue = true;
            this.toSingleton();
            this.instance = value;
            return this;
        };
        /**
         * 将绑定设置为单例模式
         */
        InjectionBindInfo.prototype.toSingleton = function () {
            this.isSingleton = true;
            return this;
        };
        /**
         * 获取实例
         */
        InjectionBindInfo.prototype.getInstance = function () {
            if (this.isToValue)
                return this.instance;
            if (this.instance)
                return this.instance;
            var rc = this.realClass;
            if (rc) {
                var inst = new (this.realClass)();
                if (this.isSingleton) {
                    this.instance = inst;
                }
                return inst;
            }
            return null;
        };
        /**
         * 获取实例(Debug版)
         */
        InjectionBindInfo.prototype.getInstanceDebug = function () {
            if (this.isToValue)
                return this.instance;
            if (this.instance)
                return this.instance;
            var rc = this.realClass;
            if (rc) {
                // 给对象的原型链写入appID信息，防止构造过程中因为引用了注入类型导致自己被加入全局追踪池
                var pt = rc["prototype"];
                var old = void 0;
                if (pt) {
                    old = riggerIOC.getAppId(pt);
                    riggerIOC.setAppId(pt, this.appId);
                }
                var inst = new (this.realClass)();
                // 还原
                if (pt) {
                    riggerIOC.setAppId(pt, old);
                }
                // 插入追踪信息
                riggerIOC.setAppId(inst, this.appId);
                riggerIOC.insertInjectionTrack(inst);
                if (this.isSingleton) {
                    this.instance = inst;
                }
                return inst;
            }
            return null;
        };
        /**
         * 绑定到值，此时会自动进行单例绑定
         * 可以绑定为null 或 undefined
         *
         * 此函数为toValue的Debug版
         * @param value
         */
        InjectionBindInfo.prototype.toValueDebug = function (value) {
            this.isToValue = true;
            this.toSingleton();
            this.instance = value;
            // 插入追踪信息
            if (value) {
                riggerIOC.setAppId(value, this.appId);
                riggerIOC.insertInjectionTrack(value, false);
            }
            return this;
        };
        InjectionBindInfo.prototype.init = function (ctr, keyType) {
            if (keyType === void 0) { keyType = BindInfoKeyType.CONSTRUCTOR; }
            this.cls = ctr;
            this.keyType = keyType;
        };
        InjectionBindInfo.prototype.initDebug = function (ctr, keyType) {
            if (keyType === void 0) { keyType = BindInfoKeyType.CONSTRUCTOR; }
            this.cls = ctr;
            this.keyType = keyType;
            // DEBUG追踪信息
            var id;
            switch (keyType) {
                case BindInfoKeyType.CONSTRUCTOR:
                    id = ctr["name"];
                    break;
                default:
                    id = ctr;
                    break;
            }
            this["riggerIOC_identifier"] = id;
        };
        return InjectionBindInfo;
    }());
    riggerIOC.InjectionBindInfo = InjectionBindInfo;
    function setInjectinBindInfoDebug() {
        InjectionBindInfo.prototype.toValue = InjectionBindInfo.prototype.toValueDebug;
        InjectionBindInfo.prototype.getInstance = InjectionBindInfo.prototype.getInstanceDebug;
        InjectionBindInfo.prototype["init"] = InjectionBindInfo.prototype["initDebug"];
    }
    riggerIOC.setInjectinBindInfoDebug = setInjectinBindInfoDebug;
})(riggerIOC || (riggerIOC = {}));
/*
 * Copyright 2018 Yang Wu.
 *
 *	Licensed under the Apache License, Version 2.0 (the "License");
 *	you may not use this file except in compliance with the License.
 *	You may obtain a copy of the License at
 *
 *		http://www.apache.org/licenses/LICENSE-2.0
 *
 *		Unless required by applicable law or agreed to in writing, software
 *		distributed under the License is distributed on an "AS IS" BASIS,
 *		WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *		See the License for the specific language governing permissions and
 *		limitations under the License.
 */
var riggerIOC;
(function (riggerIOC) {
    riggerIOC.debug = false;
    var InjectionTrackOwnerShip = /** @class */ (function () {
        function InjectionTrackOwnerShip() {
            /**
             * 被引用了多少次(当前)
             */
            this.refNum = 0;
            /**
             * 被注入的名字（总）
             */
            this.totalInjectionNames = [];
            /**
             * 至查询时仍然被注入的名字(当前)
             */
            this.injectionName = [];
        }
        InjectionTrackOwnerShip.prototype.add = function (name) {
            ++this.refNum;
            this.totalInjectionNames.push(name);
            this.injectionName.push(name);
        };
        InjectionTrackOwnerShip.prototype.remove = function (name) {
            --this.refNum;
            this.injectionName = this.injectionName.filter(function (v) { return v !== name; });
        };
        return InjectionTrackOwnerShip;
    }());
    riggerIOC.InjectionTrackOwnerShip = InjectionTrackOwnerShip;
    /**
     * 注入跟踪信息，用于调试
     */
    var InjectionTrack = /** @class */ (function () {
        function InjectionTrack(inst, isInjected) {
            if (isInjected === void 0) { isInjected = true; }
            /**
             * 此对象是否是直接注入产生
             */
            this.isInjected = true;
            /**
             * 类名
             */
            this.typeName = null;
            /**
             * 实例对象
             */
            this.inst = null;
            /**
             * 曾被注入到过的对象的追踪信息
             */
            this.owners = [];
            /**
             * 当前的所有权关系描述
             */
            this.ownershipStates = [];
            /**
             * 注入错误
             */
            this.injectError = null;
            /**
             * 析构错误
             */
            this.disposeError = null;
            /**
             * 是否已经被析构
             */
            this.disposeFlag = false;
            this.inst = inst;
            this.isInjected = isInjected;
            this.typeName = inst.constructor.name;
        }
        Object.defineProperty(InjectionTrack.prototype, "stickyOwners", {
            /**
             * 所有仍然粘住未释放的所有者(仍然引用本对象的所有者)
             *
             */
            get: function () {
                var ret = [];
                for (var i = 0; i < this.ownershipStates.length; ++i) {
                    if (this.ownershipStates[i].refNum > 0) {
                        ret.push([this.owners[i], this.ownershipStates[i]]);
                    }
                }
                return ret;
            },
            enumerable: true,
            configurable: true
        });
        InjectionTrack.prototype.toString = function () {
            var ret = "";
            ret += "========= " + this.typeName + " =========\r\n";
            ret += "\u662F\u5426\u7531\u6CE8\u5165\u4EA7\u751F:\t\t" + (this.isInjected ? "是" : "否") + "\r\n";
            ret += "App Id: \t\t" + riggerIOC.getAppId(this.inst) + "\r\n";
            ret += "\u5F15\u7528\u8BA1\u6570:\t\t" + riggerIOC.getRefCount(this.inst) + "\r\n";
            // 生成被引用情况
            var refDetails = "";
            var stickOwners = this.stickyOwners;
            for (var i = 0; i < stickOwners.length; ++i) {
                var fieldNames = "";
                for (var j = 0; j < stickOwners[i][1].injectionName.length; ++j) {
                    fieldNames += stickOwners[i][1].injectionName[j] + ", ";
                }
                if (fieldNames.length > 0) {
                    fieldNames = fieldNames.substring(0, fieldNames.length - 1);
                }
                refDetails += stickOwners[i][0].typeName + " : " + stickOwners[i][1].refNum + " => [" + fieldNames + "] ,";
            }
            if (refDetails.length <= 0)
                refDetails = "无";
            ret += "\u73B0\u5728\u88AB\u8C01\u5F15\u7528(sticky):\t" + refDetails + "\r\n";
            var error = this.injectError;
            ret += "\u6CE8\u5165\u9519\u8BEF: \t\t" + (error ? error.stack : "无") + "\r\n";
            error = this.disposeError;
            ret += "\u6790\u6784\u9519\u8BEF: \t\t" + (error ? error.stack : "无");
            return ret;
        };
        return InjectionTrack;
    }());
    riggerIOC.InjectionTrack = InjectionTrack;
    /**
     * 插入指定对象的注入追踪信息，如果已有，则无操作
     * @param obj
     * @param isInjected
     */
    function insertInjectionTrack(obj, isInjected) {
        if (isInjected === void 0) { isInjected = true; }
        var track = riggerIOC.getInjectionTrack(obj);
        if (track)
            return track;
        track = new InjectionTrack(obj, isInjected);
        var injectionTracks = riggerIOC.getInjectionTrackPool(obj);
        injectionTracks.push(track);
        return track;
    }
    riggerIOC.insertInjectionTrack = insertInjectionTrack;
    /**
     * 获取指定对象的追踪信息，可能返回null
     * @param obj
     */
    function getInjectionTrack(obj, pool) {
        if (pool === void 0) { pool = null; }
        var injectionTracks;
        if (pool) {
            injectionTracks = pool;
        }
        else {
            injectionTracks = riggerIOC.getInjectionTrackPool(obj);
        }
        // 是否已经有了
        var idx = injectionTracks.findIndex(function (v, i, arr) { return v.inst == obj; });
        if (idx >= 0)
            return injectionTracks[idx];
        return null;
    }
    riggerIOC.getInjectionTrack = getInjectionTrack;
    function getInjectionTrackPool(obj) {
        var injectionTracks;
        var appId = riggerIOC.getAppId(obj);
        if (!appId) {
            injectionTracks = riggerIOC.ApplicationContext.globalInjectionTracks;
        }
        else {
            injectionTracks = riggerIOC.ApplicationContext.getApplication(appId).injectionTracks;
        }
        return injectionTracks;
    }
    riggerIOC.getInjectionTrackPool = getInjectionTrackPool;
    function setAppId(obj, appId) {
        if (!obj)
            return;
        obj["debug_app_id"] = appId;
    }
    riggerIOC.setAppId = setAppId;
    function getAppId(obj) {
        if (!obj)
            return null;
        return obj["debug_app_id"];
    }
    riggerIOC.getAppId = getAppId;
    // function setGlobalTrackPoolFlag(obj: any, ifIn: boolean = true): void {
    // 	obj["debug_track_global"] = ifIn;
    // }
    // function getGlobalTrackPoolFlag(obj: any): boolean {
    // 	return obj["debug_track_global"];
    // }
    /**
     *
     * @param obj
     * @param attrName
     * @param owner
     * @param acc
     * @param ifInjected
     */
    function addOwnerShip(obj, attrName, owner, acc, ifInjected) {
        if (acc === void 0) { acc = 1; }
        if (ifInjected === void 0) { ifInjected = false; }
        // todo 如果此时没有obj的track，可能意味着，此obj是手动创建的
        var track = riggerIOC.insertInjectionTrack(obj, ifInjected);
        // if(!track) track = riggerIOC.insertInjectionTrack(obj, ifInjected)
        var owners = track.owners;
        var ownershipStates = track.ownershipStates;
        var idx = owners.findIndex(function (e) { return e.inst == owner; });
        if (idx < 0 && acc < 0) {
            throw new Error("try to minus owner ship num , while could not find, obj:" + obj.constructor.name + ", owner:" + owner.constructor.name);
        }
        if (idx < 0) {
            // 初始化
            var ownerTrack_1 = riggerIOC.insertInjectionTrack(owner, ifInjected);
            owners.push(ownerTrack_1);
            // 初始化关系描述
            var ownerShip = new InjectionTrackOwnerShip();
            ownershipStates.push(ownerShip);
            idx = owners.length - 1;
        }
        var ownerTrack = owners[idx];
        if (ownerTrack.disposeFlag && acc > 0) {
            throw new Error("owner has been disposed, owner:" + ownerTrack.typeName + ", field:" + attrName + ", obj:" + track.typeName);
        }
        if (acc > 0) {
            ownershipStates[idx].add(attrName);
        }
        else {
            ownershipStates[idx].remove(attrName);
        }
        if (ownershipStates[idx].refNum < 0) {
            throw new Error("owner ship state less than 0, obj:" + obj.constructor.name + ", attrName:" + attrName + ", owner:" + owner.constructor.name);
        }
    }
    riggerIOC.addOwnerShip = addOwnerShip;
    /**
     * 类装饰器，使类可以自动释放
     * 当用此装饰器装饰了类型时：
     * 1. 当其所属注入器被释放时，会自动调用对象的dispose()进行释放(如果有实现)
     * 2. 释放时，会自动将注入的属性置为null
     */
    function autoDispose(constructor) {
        // constructor[`$autoDispose`] = "!!!!!!!!!!";
        // 检查是否有实现dispose方法
        var protoType = constructor.prototype;
        if (!protoType) {
            throw new Error("has no prototype");
        }
        if (protoType["$autoDis"])
            return;
        var fun = protoType.dispose;
        // 获取注入的字段
        // let injections: string[] = InjectionBinder.instance.getRegisteredInjection(protoType);
        // hack dispose方法		
        protoType.dispose = riggerIOC.hackDispose(fun);
        protoType["$autoDis"] = true;
    }
    riggerIOC.autoDispose = autoDispose;
    /**
     * 是否满足自动释放的条件（引用计数,是否设置了自动释放)
     * @param obj
     */
    function needAutoDispose(obj) {
        if (!obj)
            return false;
        return (!obj[REF_COUNT_KEY] || obj[REF_COUNT_KEY] <= 0) && obj["$autoDis"];
    }
    riggerIOC.needAutoDispose = needAutoDispose;
    function doAutoDispose(obj) {
        obj.dispose();
    }
    riggerIOC.doAutoDispose = doAutoDispose;
    function hackDispose(disposeFun) {
        return function () {
            disposeFun && disposeFun.apply(this);
            var injections = riggerIOC.InjectionBinder.instance.getRegisteredInjection(this);
            if (injections && injections.length > 0) {
                for (var i = 0; i < injections.length; ++i) {
                    // console.log(`clear injection in obj:${this.constructor}, attr:${injections[i]}, value:${this[injections[i]]}`);
                    this[injections[i]] = null;
                }
            }
        };
    }
    riggerIOC.hackDispose = hackDispose;
    /**
     * 此版本会记录析构过程中出现的错误
     * @param disposeFun
     */
    function hackDisposeDebug(disposeFun) {
        return function () {
            setDisposeError(this, null);
            try {
                var disposeFlag = riggerIOC.getDisposeFlag(this);
                if (disposeFlag) {
                    var thisTrack = riggerIOC.getInjectionTrack(this);
                    throw new Error("has been disposed:" + thisTrack.typeName);
                }
                disposeFun && disposeFun.apply(this);
                var injections = riggerIOC.InjectionBinder.instance.getRegisteredInjection(this);
                if (injections && injections.length > 0) {
                    for (var i = 0; i < injections.length; ++i) {
                        // console.log(`clear injection in obj:${this.constructor}, attr:${injections[i]}, value:${this[injections[i]]}`);
                        this[injections[i]] = null;
                    }
                }
                riggerIOC.setDisposeFlag(this);
            }
            catch (error) {
                setDisposeError(this, error);
            }
        };
    }
    riggerIOC.hackDisposeDebug = hackDisposeDebug;
    function getDisposeError(obj) {
        if (!obj)
            return null;
        var track = riggerIOC.getInjectionTrack(obj);
        if (!track)
            return null;
        return track.disposeError;
    }
    riggerIOC.getDisposeError = getDisposeError;
    function setDisposeError(obj, error) {
        if (!obj)
            return;
        var track = riggerIOC.getInjectionTrack(obj);
        if (!track)
            track = riggerIOC.insertInjectionTrack(obj, false);
        track.disposeError = error;
    }
    riggerIOC.setDisposeError = setDisposeError;
    /**
     * 获取该对象是否已经被析构过
     * @param obj
     */
    function getDisposeFlag(obj) {
        if (!obj)
            return true;
        var track = riggerIOC.getInjectionTrack(obj);
        if (!track)
            return false;
        return track.disposeFlag;
    }
    riggerIOC.getDisposeFlag = getDisposeFlag;
    /**
     * 设置析构标记
     * @param obj
     * @param flag
     */
    function setDisposeFlag(obj, flag) {
        if (flag === void 0) { flag = true; }
        if (!obj)
            return;
        var track = riggerIOC.insertInjectionTrack(obj, false);
        track.disposeFlag = flag;
    }
    riggerIOC.setDisposeFlag = setDisposeFlag;
    /**
     * 注入装饰器
     * @param ctr
     */
    function inject(ctr) {
        return function (target, attrName, descripter) {
            // console.log(`in inject, attr:${attrName}, ctr:${ctr}`);
            if (descripter) {
                riggerIOC.doInjectGetterSetter(ctr, target, attrName, descripter);
            }
            else {
                riggerIOC.doInjectAttr(ctr, target, attrName);
            }
        };
    }
    riggerIOC.inject = inject;
    /**
     * 反向映射装饰器,即以字段的值为键，以字段的键为值建立一个新的字段，只推荐常量用
     */
    function retrievAble(v) {
        return function (target, keyStr) {
            // console.log(`key str:${keyStr}, v:${v}`);
            v = v || target[keyStr];
            target[v] = keyStr;
        };
    }
    riggerIOC.retrievAble = retrievAble;
    var REF_COUNT_KEY = "$ref_num";
    function addRefCount(obj, acc) {
        if (acc === void 0) { acc = 1; }
        if (!obj[REF_COUNT_KEY]) {
            obj[REF_COUNT_KEY] = 0;
        }
        obj[REF_COUNT_KEY] += acc;
        // 如果引用计数<=0,则检查是否要析构
        if (obj[REF_COUNT_KEY] <= 0) {
            delete obj[REF_COUNT_KEY];
            // 是否需要自动析构
            if (needAutoDispose(obj)) {
                doAutoDispose(obj);
            }
        }
    }
    riggerIOC.addRefCount = addRefCount;
    function getRefCount(obj) {
        return obj[REF_COUNT_KEY] || 0;
    }
    riggerIOC.getRefCount = getRefCount;
    function clearRefCount(obj) {
        delete obj[REF_COUNT_KEY];
        // 是否需要自动析构
        if (needAutoDispose(obj)) {
            doAutoDispose(obj);
        }
    }
    riggerIOC.clearRefCount = clearRefCount;
    /**
     * 注入的属性的键
     */
    var injectionAttrKey = "$$";
    /**
     * 对getter/setter方法进行注入
     * @param key
     * @param taget
     * @param attrName
     * @param descripter
     */
    function doInjectGetterSetter(key, target, attrName, descripter) {
        var k = injectionAttrKey + attrName;
        // 注册需要注入的属性名/存取器器名
        riggerIOC.InjectionBinder.instance.registerInjection(target, attrName);
        descripter.get = function () {
            var v = this[k];
            if (v === null || v === undefined) {
                var info = riggerIOC.InjectionBinder.instance.bind(key);
                // 使用setter赋值，可以统一维护引用计数器
                v = this[attrName] = info.getInstance();
                info = null;
            }
            return v;
        };
        descripter.set = function (v) {
            // 先将新值引用计数+1
            // 如果先减旧值计数，可能触发其析构
            if (v) {
                addRefCount(v);
            }
            // 再将原来的值的引用计数-1
            var oldV = this[k];
            if (oldV) {
                addRefCount(oldV, -1);
            }
            this[k] = v;
        };
    }
    riggerIOC.doInjectGetterSetter = doInjectGetterSetter;
    /**
     * 对getter/setter方法进行注入
     * @param key
     * @param taget
     * @param attrName
     * @param descripter
     */
    function doInjectGetterSetterDebug(key, target, attrName, descripter) {
        var k = injectionAttrKey + attrName;
        // 注册需要注入的属性名/存取器器名
        riggerIOC.InjectionBinder.instance.registerInjection(target, attrName);
        descripter.get = function () {
            var v = this[k];
            if (v === null || v === undefined) {
                var info = riggerIOC.InjectionBinder.instance.bind(key);
                // 使用setter赋值，可以统一维护引用计数器
                v = this[attrName] = info.getInstance();
                info = null;
            }
            return v;
        };
        descripter.set = function (v) {
            // 先将新值引用计数+1
            // 如果先减旧值计数，可能触发其析构
            if (v) {
                // 更新新值的追踪信息
                try {
                    riggerIOC.addOwnerShip(v, attrName, this);
                }
                catch (error) {
                    // 发生了注入错误
                    var track = riggerIOC.insertInjectionTrack(this, false);
                    track.injectError = error;
                }
                addRefCount(v);
            }
            // 再将原来的值的引用计数-1
            var oldV = this[k];
            if (oldV) {
                addRefCount(oldV, -1);
                // 更新旧值追踪信息
                riggerIOC.addOwnerShip(oldV, attrName, this, -1);
            }
            this[k] = v;
        };
    }
    /**
     * 对成员属性进行注入
     * @param key 构造函数
     * @param target 原型对象
     * @param attrName 属性名
     */
    function doInjectAttr(key, target, attrName) {
        var k = injectionAttrKey + attrName;
        // 注册需要注入的属性名/存取器器名
        riggerIOC.InjectionBinder.instance.registerInjection(target, attrName);
        Object.defineProperty(target, attrName, {
            get: function () {
                var v = this[k];
                if (v === null || v === undefined) {
                    var info = riggerIOC.InjectionBinder.instance.bind(key);
                    // 使用setter赋值，可以统一维护引用计数器					
                    v = this[attrName] = info.getInstance();
                    info = null;
                }
                return v;
            },
            set: function (v) {
                // 先将新值引用计数+1
                // 如果先减旧值计数，可能触发其析构
                if (v) {
                    addRefCount(v);
                }
                // 再将原来的值的引用计数-1
                var oldV = this[k];
                if (oldV) {
                    addRefCount(oldV, -1);
                }
                this[k] = v;
            },
            enumerable: true,
            configurable: true
        });
    }
    riggerIOC.doInjectAttr = doInjectAttr;
    /**
     * 对成员属性进行注入 (Debug版)
     * @param key 构造函数
     * @param target 原型对象
     * @param attrName 属性名
     */
    function doInjectAttrDebug(key, target, attrName) {
        var k = injectionAttrKey + attrName;
        // 注册需要注入的属性名/存取器器名
        riggerIOC.InjectionBinder.instance.registerInjection(target, attrName);
        Object.defineProperty(target, attrName, {
            get: function () {
                var v = this[k];
                if (v === null || v === undefined) {
                    var info = riggerIOC.InjectionBinder.instance.bind(key);
                    // 使用setter赋值，可以统一维护引用计数器					
                    v = this[attrName] = info.getInstance();
                    info = null;
                }
                return v;
            },
            set: function (v) {
                // 先将新值引用计数+1
                // 如果先减旧值计数，可能触发其析构
                if (v) {
                    // 更新新值的追踪信息
                    try {
                        riggerIOC.addOwnerShip(v, attrName, this);
                    }
                    catch (error) {
                        // 发生了注入错误
                        var track = riggerIOC.insertInjectionTrack(this, false);
                        track.injectError = error;
                    }
                    addRefCount(v);
                }
                // 再将原来的值的引用计数-1
                var oldV = this[k];
                if (oldV) {
                    addRefCount(oldV, -1);
                    // 更新旧值追踪信息
                    riggerIOC.addOwnerShip(oldV, attrName, this, -1);
                }
                this[k] = v;
            },
            enumerable: true,
            configurable: true
        });
    }
    function setDebug() {
        riggerIOC.debug = true;
        riggerIOC.hackDispose = riggerIOC.hackDisposeDebug;
        riggerIOC.doInjectAttr = doInjectAttrDebug;
        riggerIOC.doInjectGetterSetter = doInjectGetterSetterDebug;
        riggerIOC.setApplicationInjectionBinderDebug();
        riggerIOC.setInjectinBindInfoDebug();
    }
    riggerIOC.setDebug = setDebug;
    if (riggerIOC.debug || (window && (window["riggerIOC-debug"] || window["CC_DEBUG"]))) {
        riggerIOC.setDebug();
    }
})(riggerIOC || (riggerIOC = {}));
/*
 * Copyright 2018 Yang Wu.
 *
 *	Licensed under the Apache License, Version 2.0 (the "License");
 *	you may not use this file except in compliance with the License.
 *	You may obtain a copy of the License at
 *
 *		http://www.apache.org/licenses/LICENSE-2.0
 *
 *		Unless required by applicable law or agreed to in writing, software
 *		distributed under the License is distributed on an "AS IS" BASIS,
 *		WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *		See the License for the specific language governing permissions and
 *		limitations under the License.
 */
/**
* 一个可以使用协程等待的基础实现
* @autoDispose
*/
var riggerIOC;
(function (riggerIOC) {
    var BaseWaitable = /** @class */ (function () {
        function BaseWaitable() {
            // protected mContent: T = null;
            this.mIsDone = false;
            this.mResult = null;
            this.mIsCanceled = false;
            this.mReason = null;
            this.waitingTask = null;
        }
        /**
         * 析构，析构时会先执行 cancel以退出执行
         */
        BaseWaitable.prototype.dispose = function () {
            this.cancel();
            this.mReason = null;
            this.mResult = null;
            this.mDoneCallback = null;
            this.mCanceledCallback = null;
            this.waitingTask = null;
        };
        /**
         * 任务是否已经完成
        */
        BaseWaitable.prototype.isDone = function () {
            return this.mIsDone;
        };
        /**
         * 是否取消了
        */
        BaseWaitable.prototype.isCanceled = function () {
            return this.mIsCanceled;
        };
        /**
         * 是否正在等待
        */
        BaseWaitable.prototype.isWaitting = function () {
            return this.waitingTask != null;
        };
        /**
         * 开启任务,开启之后，进行等待状态
        */
        BaseWaitable.prototype.startTask = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this.mIsDone = false;
            this.mIsCanceled = false;
            this.mResult = null;
            this.mReason = null;
            return this;
        };
        BaseWaitable.prototype.getResult = function () {
            return this.mResult;
        };
        BaseWaitable.prototype.getReason = function () {
            return this.mReason;
        };
        /**
         * 等待任务完成
         * @param args
         */
        BaseWaitable.prototype.wait = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (this.isWaitting())
                return this.waitingTask;
            if (this.mIsDone)
                return this.mResult;
            if (this.mIsCanceled)
                return this.mReason;
            this.waitingTask = riggerIOC.waitFor(this);
            this.startTask.apply(this, args);
            if (!this.waitingTask) {
                // 可能在开始任务时直接就完成了
                if (this.mIsDone)
                    return this.mResult;
                if (this.mIsCanceled)
                    return this.mReason;
            }
            return this.waitingTask;
        };
        /**
         * 任务完成
        */
        BaseWaitable.prototype.done = function (result) {
            if (result === void 0) { result = null; }
            if (this.mIsDone)
                return;
            if (this.mIsCanceled)
                return;
            this.mIsDone = true;
            this.mResult = result;
            if (this.mDoneCallback) {
                this.mDoneCallback(result);
                // this.reset();
            }
            this.mDoneCallback = null;
            this.mCanceledCallback = null;
            this.mIsCanceled = false;
            this.waitingTask = null;
        };
        /**
         * 取消执行
         * @param reason
         */
        BaseWaitable.prototype.cancel = function (reason) {
            if (reason === void 0) { reason = null; }
            if (this.mIsCanceled)
                return;
            if (this.mIsDone)
                return;
            this.mIsCanceled = true;
            this.mReason = reason;
            if (this.mCanceledCallback) {
                this.mCanceledCallback(reason);
                // this.reset();
            }
            this.mCanceledCallback = null;
            this.mDoneCallback = null;
            this.mIsDone = false;
            this.waitingTask = null;
        };
        /**
         * 重置，使得可以再次使用
         * 如果正在等待，则重置无效，需要先手动打断
         */
        BaseWaitable.prototype.reset = function () {
            if (this.isWaitting())
                return this;
            this.mIsCanceled = false;
            this.mIsDone = false;
            this.mResult = null;
            this.mReason = null;
            this.mCanceledCallback = null;
            this.mDoneCallback = null;
            this.waitingTask = null;
            return this;
        };
        /**
         * 供框架的协程库调用
         * @param fun
         */
        BaseWaitable.prototype.setDoneCallback = function (fun) {
            this.mDoneCallback = fun;
        };
        /**
         * 供框架的协程库调用
         *
         * @param act
         */
        BaseWaitable.prototype.setCancelCallback = function (act) {
            this.mCanceledCallback = act;
        };
        BaseWaitable = __decorate([
            riggerIOC.autoDispose
        ], BaseWaitable);
        return BaseWaitable;
    }());
    riggerIOC.BaseWaitable = BaseWaitable;
})(riggerIOC || (riggerIOC = {}));
/*
 * Copyright 2018 Yang Wu.
 *
 *	Licensed under the Apache License, Version 2.0 (the "License");
 *	you may not use this file except in compliance with the License.
 *	You may obtain a copy of the License at
 *
 *		http://www.apache.org/licenses/LICENSE-2.0
 *
 *		Unless required by applicable law or agreed to in writing, software
 *		distributed under the License is distributed on an "AS IS" BASIS,
 *		WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *		See the License for the specific language governing permissions and
 *		limitations under the License.
 */
/**
* Mediator绑定器
*/
var riggerIOC;
(function (riggerIOC) {
    var MediationBinder = /** @class */ (function () {
        function MediationBinder(injectionBinder) {
            this.mInfos = {};
            this.injectionBinder = injectionBinder;
        }
        /**
         *
         *
         * @param cls View构造函数
         */
        MediationBinder.prototype.bind = function (cls) {
            if (!this.mInfos)
                this.mInfos = {};
            var info = this.findBindInfo(cls);
            if (!info) {
                info = new riggerIOC.MediationBindInfo(cls);
                var id = riggerIOC.InjectionWrapper.getId(cls);
                this.mInfos[id] = info;
            }
            return info;
        };
        /**
         * 根据视图信息获取其绑定的Mediator实例
         * @param viewCls 视图类的构造函数
         * @param view 视图的实例
         */
        MediationBinder.prototype.createAndAttach = function (viewCls, view) {
            var info = this.findBindInfo(viewCls);
            if (!info)
                return null;
            if (!info.bindMediatorConstructor)
                return null;
            // 将View 注入Mediator
            var injectionInfo = this.injectionBinder.bind(viewCls);
            if (!injectionInfo.hasInstance) {
                injectionInfo.toValue(view);
            }
            var inst = this.injectionBinder.bind(info.bindMediatorConstructor).getInstance();
            riggerIOC.InjectionBinder.instance.inject(inst);
            // 取消绑定
            injectionInfo.toValue(null);
            // this.addBindTuple(view, inst);
            return inst;
        };
        /**
         * 将视图与mediator分离
         * @param view
         * @param mediator
         */
        MediationBinder.prototype.detach = function (view, mediator) {
            if (view)
                riggerIOC.clearRefCount(view);
            if (mediator)
                riggerIOC.clearRefCount(mediator);
        };
        // public detach(view: View, mediator: Mediator) {
        // 	let tuples: ViewMediatorTuple[] = this.bindTuples;
        // 	if (!tuples) return;
        // 	let len: number = tuples.length;
        // 	if (len <= 0) return;
        // 	let temp: ViewMediatorTuple[] = [];
        // 	for (var i: number = 0; i < len; ++i) {
        // 		if (tuples[i].view === view && tuples[i].mediator == mediator) {
        // 			tuples[i].dispose();
        // 		}
        // 		else {
        // 			temp.push(tuples[i]);
        // 		}
        // 	}
        // 	this.bindTuples = temp;
        // }
        /**
         * 获取已经和视图绑定的mediator实例
         * @param view
         */
        MediationBinder.prototype.getAttachedMediatorInstance = function (view) {
            var tuples = this.bindTuples;
            if (!tuples)
                return null;
            var len = tuples.length;
            if (len <= 0)
                return null;
            for (var i = 0; i < len; ++i) {
                if (tuples[i].view === view) {
                    return tuples[i].mediator;
                }
            }
            return null;
        };
        MediationBinder.prototype.dispose = function () {
            for (var k in this.mInfos) {
                this.mInfos[k].dispose();
            }
            if (this.bindTuples && this.bindTuples.length > 0) {
                for (var i = this.bindTuples.length - 1; i >= 0; --i) {
                    this.bindTuples[i].dispose();
                }
            }
            this.injectionBinder = null;
            this.bindTuples = [];
        };
        /**
         * 查找绑定信息
         * @param viewCls
         */
        MediationBinder.prototype.findBindInfo = function (viewCls) {
            if (!viewCls)
                return null;
            var id = riggerIOC.InjectionWrapper.getId(viewCls);
            if (!id)
                return null;
            return this.mInfos[id];
        };
        MediationBinder.prototype.addBindTuple = function (view, mediator) {
            if (!this.bindTuples)
                this.bindTuples = [];
            this.bindTuples.push(new riggerIOC.ViewMediatorTuple(view, mediator));
        };
        return MediationBinder;
    }());
    riggerIOC.MediationBinder = MediationBinder;
})(riggerIOC || (riggerIOC = {}));
var riggerIOC;
(function (riggerIOC) {
    /**
     * 一个可以安全打断的可等待类型
     * 此类型的可等待对象，在正常执行或被打断时都返回一个 Result<T, M>类型的对象
     */
    var SafeWaitable = /** @class */ (function (_super) {
        __extends(SafeWaitable, _super);
        function SafeWaitable() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SafeWaitable.prototype.done = function (reason) {
            if (reason === void 0) { reason = null; }
            if (this.mIsCanceled)
                return;
            if (this.mIsDone)
                return;
            this.mIsDone = true;
            // 执行结果
            var result = new riggerIOC.Result();
            result.result = reason;
            this.mResult = result;
            if (this.mDoneCallback) {
                this.mDoneCallback(this.mResult);
            }
            this.mCanceledCallback = null;
            this.mDoneCallback = null;
            this.mIsCanceled = false;
            this.waitingTask = null;
        };
        SafeWaitable.prototype.cancel = function (reason) {
            if (reason === void 0) { reason = null; }
            if (this.mIsCanceled)
                return;
            if (this.mIsDone)
                return;
            this.mIsCanceled = true;
            var result = new riggerIOC.Result();
            if (reason == null || reason == undefined) {
                result.error = (new Error());
            }
            else {
                result.error = reason;
            }
            this.mReason = result;
            if (this.mDoneCallback) {
                this.mDoneCallback(this.mReason);
            }
            this.mCanceledCallback = null;
            this.mDoneCallback = null;
            this.mIsDone = false;
            this.waitingTask = null;
        };
        SafeWaitable.prototype.wait = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return _super.prototype.wait.apply(this, args);
        };
        /**
         * 获取原因(打断,出错等)
         */
        SafeWaitable.prototype.getReason = function () {
            var ret = _super.prototype.getReason.call(this);
            if (!ret)
                return null;
            return ret.reason;
        };
        /**
         * 获取结果
         */
        SafeWaitable.prototype.getResult = function () {
            var ret = _super.prototype.getResult.call(this);
            if (!ret)
                return null;
            return ret.result;
        };
        return SafeWaitable;
    }(riggerIOC.BaseWaitable));
    riggerIOC.SafeWaitable = SafeWaitable;
})(riggerIOC || (riggerIOC = {}));
/*
 * Copyright 2018 Yang Wu.
 *
 *	Licensed under the Apache License, Version 2.0 (the "License");
 *	you may not use this file except in compliance with the License.
 *	You may obtain a copy of the License at
 *
 *		http://www.apache.org/licenses/LICENSE-2.0
 *
 *		Unless required by applicable law or agreed to in writing, software
 *		distributed under the License is distributed on an "AS IS" BASIS,
 *		WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *		See the License for the specific language governing permissions and
 *		limitations under the License.
 */
var riggerIOC;
(function (riggerIOC) {
    var CommandBinder = /** @class */ (function () {
        function CommandBinder(injectionBinder) {
            this.injectionBinder = injectionBinder;
            this.bindInfos = [];
        }
        CommandBinder.prototype.dispose = function () {
            for (var i = this.bindInfos.length - 1; i >= 0; --i) {
                this.bindInfos[i].dispose();
            }
            this.bindInfos = [];
            this.injectionBinder = null;
        };
        return CommandBinder;
    }());
    riggerIOC.CommandBinder = CommandBinder;
})(riggerIOC || (riggerIOC = {}));
/*
 * Copyright 2018 Yang Wu.
 *
 *	Licensed under the Apache License, Version 2.0 (the "License");
 *	you may not use this file except in compliance with the License.
 *	You may obtain a copy of the License at
 *
 *		http://www.apache.org/licenses/LICENSE-2.0
 *
 *		Unless required by applicable law or agreed to in writing, software
 *		distributed under the License is distributed on an "AS IS" BASIS,
 *		WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *		See the License for the specific language governing permissions and
 *		limitations under the License.
 */
///<reference path = "../../coroutine/BaseWaitable.ts" />
var riggerIOC;
(function (riggerIOC) {
    var Command = /** @class */ (function () {
        function Command() {
        }
        Command.prototype.dispose = function () { };
        Command = __decorate([
            riggerIOC.autoDispose
        ], Command);
        return Command;
    }());
    riggerIOC.Command = Command;
})(riggerIOC || (riggerIOC = {}));
/*
 * Copyright 2018 Yang Wu.
 *
 *	Licensed under the Apache License, Version 2.0 (the "License");
 *	you may not use this file except in compliance with the License.
 *	You may obtain a copy of the License at
 *
 *		http://www.apache.org/licenses/LICENSE-2.0
 *
 *		Unless required by applicable law or agreed to in writing, software
 *		distributed under the License is distributed on an "AS IS" BASIS,
 *		WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *		See the License for the specific language governing permissions and
 *		limitations under the License.
 */
var riggerIOC;
(function (riggerIOC) {
    var WaitForTime = /** @class */ (function (_super) {
        __extends(WaitForTime, _super);
        function WaitForTime() {
            var _this = _super.call(this) || this;
            _this.waitingMSeconds = null;
            _this.timerId = null;
            return _this;
        }
        /**
         * 设置要等待的秒数，并开始计时
         * 如果未设置任何时间就开始等待，则会永远等待直到被打断(WaitForTime.cancel())
         * @param seconds
         */
        WaitForTime.prototype.forSeconds = function (seconds, immediately) {
            if (immediately === void 0) { immediately = true; }
            return this.forMSeconds(seconds * 1000, immediately);
        };
        /**
         * 设置要等待的毫秒数, 并开始计时
         * 如果未设置任何时间就开始等待，则会永远等待直到被打断(WaitForTime.cancel())
         * @param mSeconds
         */
        WaitForTime.prototype.forMSeconds = function (mSeconds, immediately) {
            if (immediately === void 0) { immediately = true; }
            if (this.timerId !== null)
                return this;
            if (immediately) {
                this.waitingMSeconds = null;
                var obj_1 = this;
                this.timerId = setTimeout(function () {
                    obj_1.timerId = null;
                    obj_1.done();
                    obj_1 = null;
                }, mSeconds);
            }
            else {
                this.waitingMSeconds = mSeconds;
            }
            return this;
        };
        /**
         * 等一帧
        */
        WaitForTime.prototype.forFrame = function () {
            return this.forMSeconds(0);
        };
        /**
         * 持续等待直到被打断
        */
        WaitForTime.prototype.forever = function () {
            if (this.timerId)
                clearTimeout(this.timerId);
            this.timerId = null;
            this.waitingMSeconds = null;
            return this;
        };
        /**
         * 开始等待，等待之前应该先设置好时间，
         * 如果未设置时间，则会一直等待，直到被打断，效果同:forever().wait()
        */
        WaitForTime.prototype.wait = function () {
            if (this.timerId == null && this.waitingMSeconds != null && !this.isWaitting()) {
                this.forMSeconds(this.waitingMSeconds);
            }
            return _super.prototype.wait.call(this);
        };
        /**
         * 取消等待
         * @param reason
         */
        WaitForTime.prototype.cancel = function (reason) {
            this.waitingMSeconds = null;
            if (this.timerId !== null)
                clearTimeout(this.timerId);
            this.timerId = null;
            _super.prototype.cancel.call(this, reason);
        };
        return WaitForTime;
    }(riggerIOC.SafeWaitable));
    riggerIOC.WaitForTime = WaitForTime;
})(riggerIOC || (riggerIOC = {}));
/*
 * Copyright 2018 Yang Wu.
 *
 *	Licensed under the Apache License, Version 2.0 (the "License");
 *	you may not use this file except in compliance with the License.
 *	You may obtain a copy of the License at
 *
 *		http://www.apache.org/licenses/LICENSE-2.0
 *
 *		Unless required by applicable law or agreed to in writing, software
 *		distributed under the License is distributed on an "AS IS" BASIS,
 *		WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *		See the License for the specific language governing permissions and
 *		limitations under the License.
 */
/**
* 消息与命令的绑定器
* 一个消息可以同时绑定多个命令(即一个消息可以导致多个命令的执行)
* 但一个命令不能同时被绑定到多个消息
*/
var riggerIOC;
(function (riggerIOC) {
    var EventCommandBinder = /** @class */ (function (_super) {
        __extends(EventCommandBinder, _super);
        function EventCommandBinder(injectionBinder) {
            return _super.call(this, injectionBinder) || this;
        }
        EventCommandBinder.prototype.dispose = function () {
            throw new Error("NOT IMPLEMENTED");
        };
        /**
         * 绑定消息
         * @param msg
         */
        EventCommandBinder.prototype.bind = function (msg) {
            if (!this.commandsMap)
                this.commandsMap = {};
            var info = this.findBindInfo(msg);
            if (!info)
                return this.commandsMap[msg] = new riggerIOC.EventCommandBindInfo(msg);
            return info;
        };
        EventCommandBinder.prototype.unbind = function (event) {
            throw new Error("NOT IMPLEMENTED");
        };
        /**
         * 查找绑定消息
         * @param msg
         */
        EventCommandBinder.prototype.findBindInfo = function (msg) {
            var info = this.commandsMap[msg];
            if (info)
                return info;
            return null;
        };
        return EventCommandBinder;
    }(riggerIOC.CommandBinder));
    riggerIOC.EventCommandBinder = EventCommandBinder;
})(riggerIOC || (riggerIOC = {}));
/*
 * Copyright 2018 Yang Wu.
 *
 *	Licensed under the Apache License, Version 2.0 (the "License");
 *	you may not use this file except in compliance with the License.
 *	You may obtain a copy of the License at
 *
 *		http://www.apache.org/licenses/LICENSE-2.0
 *
 *		Unless required by applicable law or agreed to in writing, software
 *		distributed under the License is distributed on an "AS IS" BASIS,
 *		WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *		See the License for the specific language governing permissions and
 *		limitations under the License.
 */
/**
* Mediation的绑定信息
*/
var riggerIOC;
(function (riggerIOC) {
    var MediationBindInfo = /** @class */ (function () {
        function MediationBindInfo(cls) {
            riggerIOC.InjectionWrapper.wrap(cls);
            this.mViewConstructor = cls;
        }
        Object.defineProperty(MediationBindInfo.prototype, "viewConstructor", {
            /**
             * 绑定的视图类构造函数
             */
            get: function () {
                return this.mViewConstructor;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MediationBindInfo.prototype, "bindMediatorConstructor", {
            /**
             * 与视图绑定的中介类
             */
            get: function () {
                return this.mBindMediatorConstructor;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 将视图绑定到中介类
         * @param mediatorCls
         */
        MediationBindInfo.prototype.to = function (mediatorCls) {
            this.mBindMediatorConstructor = mediatorCls;
            return this;
        };
        MediationBindInfo.prototype.dispose = function () {
            this.mViewConstructor = null;
            this.mBindMediatorConstructor = null;
        };
        return MediationBindInfo;
    }());
    riggerIOC.MediationBindInfo = MediationBindInfo;
})(riggerIOC || (riggerIOC = {}));
/*
 * Copyright 2018 Yang Wu.
 *
 *	Licensed under the Apache License, Version 2.0 (the "License");
 *	you may not use this file except in compliance with the License.
 *	You may obtain a copy of the License at
 *
 *		http://www.apache.org/licenses/LICENSE-2.0
 *
 *		Unless required by applicable law or agreed to in writing, software
 *		distributed under the License is distributed on an "AS IS" BASIS,
 *		WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *		See the License for the specific language governing permissions and
 *		limitations under the License.
 */
/**
 * 信号与命令的绑定信息类
 */
var riggerIOC;
(function (riggerIOC) {
    var CommandInfo = /** @class */ (function () {
        function CommandInfo() {
        }
        return CommandInfo;
    }());
    var SignalCommandBindInfo = /** @class */ (function () {
        function SignalCommandBindInfo(signal, injectionBinder) {
            if (injectionBinder === void 0) { injectionBinder = null; }
            this.appInjectionBinder = null;
            this.executingCommand = null;
            this.appInjectionBinder = injectionBinder;
            this.commandsCls = [];
            this.bindSignal = signal;
            this.isOnce = false;
            this.isInSequence = false;
            signal.on(this, this.onSignal);
        }
        /**
         * 析构时会取消信号的监听，但不会直接析构信号
         */
        SignalCommandBindInfo.prototype.dispose = function () {
            this.appInjectionBinder = null;
            this.bindSignal && this.bindSignal.off(this, this.onSignal);
            // this.bindSignal.dispose();
            this.bindSignal = null;
            this.commandsCls = [];
            //是否有正在执行的命令序列
            if (this.executingCommand) {
                this.executingCommand.cancel("canceled by riggIOC");
            }
        };
        Object.defineProperty(SignalCommandBindInfo.prototype, "injectionBinder", {
            get: function () {
                return this.appInjectionBinder || riggerIOC.InjectionBinder.instance;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 将信号绑定到命令，可以重复执行以绑定到多个命令
         * @param cmdCls
         */
        SignalCommandBindInfo.prototype.to = function (cmdCls) {
            this.injectionBinder.bind(cmdCls);
            this.commandsCls.push({ cls: cmdCls, inst: null });
            return this;
        };
        /**
         * 绑定到值，此时会自动进行单例绑定
         * 绑定到值的命令，在命令绑定器回收时，会自动析构命令
         * @param value
         */
        SignalCommandBindInfo.prototype.toValue = function (value) {
            // this.toSingleton();
            // InjectionBinder.instance.bind(cmdCls);			
            this.commandsCls.push({ cls: null, inst: value });
            return this;
        };
        /**
         * 设置为一次性绑定
         */
        SignalCommandBindInfo.prototype.once = function () {
            this.isOnce = true;
            return this;
        };
        /**
         * 设置为顺序命令
         */
        SignalCommandBindInfo.prototype.inSequence = function () {
            this.isInSequence = true;
            return this;
        };
        SignalCommandBindInfo.prototype.onSignal = function (arg) {
            if (this.isInSequence) {
                this.executeWaitableCommands(arg);
            }
            else {
                this.executeCommands(arg);
            }
        };
        /**
         * 执行绑定的命令, 如果命令序列中有WaitableCommand会抛错
         * @param arg
         */
        SignalCommandBindInfo.prototype.executeCommands = function (arg) {
            var ret = null;
            var cmd;
            var cmdInfo;
            // let canDispose: boolean = false;
            var injectionInfo;
            for (var i = 0; i < this.commandsCls.length; ++i) {
                cmdInfo = this.commandsCls[i];
                if (cmdInfo.inst) {
                    cmd = cmdInfo.inst;
                }
                else {
                    injectionInfo = this.injectionBinder.bind(cmdInfo.cls);
                    // canDispose = injectionInfo.isInstanceTemporary;
                    cmd = injectionInfo.getInstance();
                }
                ret = cmd.execute(arg, ret);
                if (riggerIOC.needAutoDispose(cmd)) {
                    riggerIOC.doAutoDispose(cmd);
                }
            }
            // 如果是一次性的，则释放
            if (this.isOnce)
                this.dispose();
        };
        SignalCommandBindInfo.prototype.executeWaitableCommands = function (arg) {
            return __awaiter(this, void 0, void 0, function () {
                var ret, cmd, cmdInfo, injectionBindInfo, i, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            ret = null;
                            i = 0;
                            _a.label = 1;
                        case 1:
                            if (!(i < this.commandsCls.length)) return [3 /*break*/, 5];
                            cmdInfo = this.commandsCls[i];
                            if (cmdInfo.inst) {
                                cmd = cmdInfo.inst;
                            }
                            else {
                                injectionBindInfo = this.injectionBinder.bind(cmdInfo.cls);
                                // canDispose = injectionBindInfo.isInstanceTemporary();
                                cmd = injectionBindInfo.getInstance();
                            }
                            if (!(cmd instanceof riggerIOC.WaitableCommand)) return [3 /*break*/, 3];
                            this.executingCommand = cmd;
                            cmd.execute(arg, ret);
                            return [4 /*yield*/, cmd.wait()];
                        case 2:
                            result = _a.sent();
                            if (riggerIOC.needAutoDispose(cmd)) {
                                riggerIOC.doAutoDispose(cmd);
                            }
                            if (result.isOk) {
                                ret = result.result;
                                this.executingCommand = null;
                            }
                            else {
                                // 执行失败打断,停止后续执行
                                this.executingCommand = null;
                                return [3 /*break*/, 5];
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            ret = cmd.execute(arg, ret);
                            if (riggerIOC.needAutoDispose(cmd)) {
                                riggerIOC.doAutoDispose(cmd);
                            }
                            _a.label = 4;
                        case 4:
                            ++i;
                            return [3 /*break*/, 1];
                        case 5:
                            cmd = cmdInfo = null;
                            this.executingCommand = null;
                            // 如果是一次性的，则释放
                            if (this.isOnce)
                                this.dispose();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return SignalCommandBindInfo;
    }());
    riggerIOC.SignalCommandBindInfo = SignalCommandBindInfo;
})(riggerIOC || (riggerIOC = {}));
/*
* Copyright 2018 Yang Wu.
*
*	Licensed under the Apache License, Version 2.0 (the "License");
*	you may not use this file except in compliance with the License.
*	You may obtain a copy of the License at
*
*		http://www.apache.org/licenses/LICENSE-2.0
*
*		Unless required by applicable law or agreed to in writing, software
*		distributed under the License is distributed on an "AS IS" BASIS,
*		WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*		See the License for the specific language governing permissions and
*		limitations under the License.
*/
/**
* View和Mediator的绑定元组
*/
var riggerIOC;
(function (riggerIOC) {
    var ViewMediatorTuple = /** @class */ (function () {
        function ViewMediatorTuple(view, mediator) {
            this.view = view;
            this.mediator = mediator;
        }
        ViewMediatorTuple.prototype.dispose = function () {
            this.view = null;
            this.mediator = null;
        };
        return ViewMediatorTuple;
    }());
    riggerIOC.ViewMediatorTuple = ViewMediatorTuple;
})(riggerIOC || (riggerIOC = {}));
/*
 * Copyright 2018 Yang Wu.
 *
 *	Licensed under the Apache License, Version 2.0 (the "License");
 *	you may not use this file except in compliance with the License.
 *	You may obtain a copy of the License at
 *
 *		http://www.apache.org/licenses/LICENSE-2.0
 *
 *		Unless required by applicable law or agreed to in writing, software
 *		distributed under the License is distributed on an "AS IS" BASIS,
 *		WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *		See the License for the specific language governing permissions and
 *		limitations under the License.
 */
var riggerIOC;
(function (riggerIOC) {
    var SignalCommandBinder = /** @class */ (function (_super) {
        __extends(SignalCommandBinder, _super);
        function SignalCommandBinder() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * 绑定一个信号
         * 绑定后，信号将被注入为单例模式，并且同时会立即产生一个实例
         * @param cls
         */
        SignalCommandBinder.prototype.bind = function (cls) {
            // 将信号注入为单例,并返回对应的命令绑定信息
            var info = new riggerIOC.SignalCommandBindInfo(this.injectionBinder.bind(cls).toSingleton().getInstance(), this.injectionBinder);
            this.bindInfos.push(info);
            return info;
        };
        SignalCommandBinder.prototype.unbind = function (sigObj, ifAll) {
            if (ifAll === void 0) { ifAll = false; }
            throw new Error("not implemented");
            // for (let i: number = 0; i < this.bindInfos.length; ++i) {
            // 	if()
            // }
        };
        return SignalCommandBinder;
    }(riggerIOC.CommandBinder));
    riggerIOC.SignalCommandBinder = SignalCommandBinder;
})(riggerIOC || (riggerIOC = {}));
/*
 * Copyright 2018 Yang Wu.
 *
 *	Licensed under the Apache License, Version 2.0 (the "License");
 *	you may not use this file except in compliance with the License.
 *	You may obtain a copy of the License at
 *
 *		http://www.apache.org/licenses/LICENSE-2.0
 *
 *		Unless required by applicable law or agreed to in writing, software
 *		distributed under the License is distributed on an "AS IS" BASIS,
 *		WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *		See the License for the specific language governing permissions and
 *		limitations under the License.
 */
var riggerIOC;
(function (riggerIOC) {
    // export async function startCoroutine(caller: any, method: Function, ...args: any[]) {
    // 	await method.apply(caller, args);
    // }
    /**
     * 等下一帧，注意，这里的帧是指浏览器的帧（一般为4MS），而非游戏帧
     */
    function waitForNextFrame() {
        return new Promise(function (resolve) {
            setTimeout(resolve, 0);
        });
    }
    riggerIOC.waitForNextFrame = waitForNextFrame;
    function waitForSeconds(ms, conditinHandler, args) {
        if (args === void 0) { args = []; }
        var promise;
        if (!conditinHandler) {
            promise = new Promise(function (resolve) {
                setTimeout(resolve, ms);
            });
        }
        else {
            var ret = void 0;
            if (conditinHandler instanceof riggerIOC.Handler) {
                ret = conditinHandler.runWith(args);
            }
            else {
                ret = conditinHandler();
            }
            if (ret) {
                promise = new Promise(function (resolve) {
                    setTimeout(resolve, ms);
                });
            }
            else {
                promise = promise = new Promise(function (resolve) {
                    resolve();
                });
            }
        }
        return promise;
    }
    riggerIOC.waitForSeconds = waitForSeconds;
    /**
     * 等待执行完成
     * @param waitable
     */
    function waitFor(waitable) {
        return new Promise(function (resolve, reject) {
            if (waitable.isDone()) {
                resolve(waitable.getResult());
                // waitable.reset();
            }
            else if (waitable.isCanceled()) {
                reject(waitable.getReason());
                // waitable.reset();				
            }
            else {
                waitable.setDoneCallback(resolve);
                waitable.setCancelCallback(reject);
            }
        });
    }
    riggerIOC.waitFor = waitFor;
})(riggerIOC || (riggerIOC = {}));
/*
 * Copyright 2018 Yang Wu.
 *
 *	Licensed under the Apache License, Version 2.0 (the "License");
 *	you may not use this file except in compliance with the License.
 *	You may obtain a copy of the License at
 *
 *		http://www.apache.org/licenses/LICENSE-2.0
 *
 *		Unless required by applicable law or agreed to in writing, software
 *		distributed under the License is distributed on an "AS IS" BASIS,
 *		WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *		See the License for the specific language governing permissions and
 *		limitations under the License.
 */
/**
 * 绑定信息类
 */
var riggerIOC;
(function (riggerIOC) {
    var CommandBindInfo = /** @class */ (function () {
        function CommandBindInfo() {
        }
        return CommandBindInfo;
    }());
    riggerIOC.CommandBindInfo = CommandBindInfo;
})(riggerIOC || (riggerIOC = {}));
/*
 * Copyright 2018 Yang Wu.
 *
 *	Licensed under the Apache License, Version 2.0 (the "License");
 *	you may not use this file except in compliance with the License.
 *	You may obtain a copy of the License at
 *
 *		http://www.apache.org/licenses/LICENSE-2.0
 *
 *		Unless required by applicable law or agreed to in writing, software
 *		distributed under the License is distributed on an "AS IS" BASIS,
 *		WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *		See the License for the specific language governing permissions and
 *		limitations under the License.
 */
/**
* 任务执行器
*/
/// 
var riggerIOC;
(function (riggerIOC) {
    var TaskExecutor = /** @class */ (function () {
        function TaskExecutor() {
            /**
             * 所有需要执行的任务
             */
            this.mTasks = [];
            /**
             * 每一个任务执行后的回调
             */
            this.mSingleHandlers = [];
            this.mSingleHandlerArgs = [];
            /**
             * 每一个任务被取消后的回调
             */
            this.mSingleCancelHandlers = [];
            this.mSingleCancelHandlerArgs = [];
            /**
             * 所有任务执行完成后的回调
             */
            this.mCompleteHandler = null;
            this.mCompleteHandlerArgs = [];
            /**
             * 所有任务取消完成后的回调
             */
            this.mCancelHandler = null;
            this.mCancelHandlerArgs = [];
            /**
             * 当前正在执行的任务的游标
             */
            this.mCursor = -1;
            /**
             * 异步执行任务时的同步锁(保证所有任务执行完成后才会调用总的回调)
             */
            this.syncLock = null;
            /**
             * 异步执行任务时的计时器列表，用于保证每个任务之间的间隔
             */
            this.timers = null;
        }
        Object.defineProperty(TaskExecutor, "pool", {
            get: function () {
                if (!this.mPool)
                    this.mPool = new riggerIOC.Pool();
                return this.mPool;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 创建一个实例
        */
        TaskExecutor.create = function () {
            return TaskExecutor.pool.getItemByClass(TaskExecutor._sign, TaskExecutor);
        };
        Object.defineProperty(TaskExecutor.prototype, "isRunning", {
            /**
             * 是否正在执行任务
             */
            get: function () {
                return this.mCursor >= 0 || this.syncLock != null;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 重置
         */
        TaskExecutor.prototype.reset = function () {
            this.dispose();
            return this;
        };
        /**
         * 回收
        */
        TaskExecutor.prototype.recover = function () {
            this.reset();
            TaskExecutor.pool.recover(TaskExecutor._sign, this);
        };
        /**
         * 执行任务，如果已经有任务正在执行，则会先打断之前的任务
         * @param ifSingleCallback
         */
        TaskExecutor.prototype.execute = function () {
            return __awaiter(this, void 0, void 0, function () {
                var executors, singleArgs, singleHandlers, cancelHandlers, cancelArgs, canceled, cancelReason, ret, reason_1, i;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!!this.isRunning) return [3 /*break*/, 7];
                            executors = this.mTasks;
                            singleArgs = this.mSingleHandlerArgs;
                            singleHandlers = this.mSingleHandlers;
                            cancelHandlers = this.mSingleCancelHandlers;
                            cancelArgs = this.mSingleCancelHandlerArgs;
                            this.mCursor = 0;
                            canceled = false;
                            cancelReason = null;
                            _a.label = 1;
                        case 1:
                            if (!(this.mCursor < executors.length)) return [3 /*break*/, 6];
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, executors[this.mCursor].wait()];
                        case 3:
                            ret = _a.sent();
                            singleHandlers[this.mCursor]
                                && singleHandlers[this.mCursor].runWith([].concat(singleArgs[this.mCursor], ret));
                            return [3 /*break*/, 5];
                        case 4:
                            reason_1 = _a.sent();
                            canceled = true;
                            cancelReason = reason_1;
                            cancelHandlers[this.mCursor]
                                && cancelHandlers[this.mCursor].runWith([].concat(cancelArgs[this.mCursor], reason_1));
                            return [3 /*break*/, 6];
                        case 5:
                            ++this.mCursor;
                            return [3 /*break*/, 1];
                        case 6:
                            // 执行后面未执行任务的取消回调
                            if (canceled) {
                                for (i = this.mCursor + 1; i < this.mSingleCancelHandlers.length; ++i) {
                                    this.mSingleCancelHandlers[i]
                                        && this.mSingleCancelHandlers[i].runWith([].concat(this.mSingleCancelHandlerArgs[i], cancelReason));
                                }
                                this.mCancelHandler
                                    && this.mCancelHandler.runWith([].concat(this.mCancelHandlerArgs, cancelReason));
                            }
                            else {
                                this.mCompleteHandler && this.mCompleteHandler.runWith(this.mCompleteHandlerArgs);
                            }
                            // 游标归位
                            this.mCursor = -1;
                            return [3 /*break*/, 9];
                        case 7:
                            this.cancel();
                            return [4 /*yield*/, this.execute()];
                        case 8:
                            _a.sent();
                            _a.label = 9;
                        case 9: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * 异步执行
        */
        TaskExecutor.prototype.executeAsync = function (interval) {
            if (interval === void 0) { interval = null; }
            return __awaiter(this, void 0, void 0, function () {
                var totalWait, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!!this.isRunning) return [3 /*break*/, 5];
                            if (interval == null || interval == undefined || interval < 0)
                                interval = 0;
                            this.syncLock = new riggerIOC.TaskExecutorLock(this.mTasks.length);
                            totalWait = this.syncLock.wait();
                            this.mCursor = 0;
                            for (; this.mCursor < this.mTasks.length; ++this.mCursor) {
                                this.executeSingle(this.mCursor, this.mCursor * interval);
                                // ++realTaskNum;
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, totalWait];
                        case 2:
                            _a.sent();
                            this.mCompleteHandler && this.mCompleteHandler.runWith(this.mCompleteHandlerArgs);
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            this.mCancelHandler && this.mCancelHandler.runWith(this.mCancelHandlerArgs);
                            return [3 /*break*/, 4];
                        case 4:
                            // 清除计时器
                            this.clearTimer();
                            this.syncLock.dispose();
                            this.syncLock = null;
                            this.mCursor = -1;
                            return [3 /*break*/, 7];
                        case 5:
                            this.cancel();
                            return [4 /*yield*/, this.executeAsync(interval)];
                        case 6:
                            _a.sent();
                            _a.label = 7;
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         *
         * @param ifTotalCallback
         * 如果没有任务正在执行，则调用此接口没有任何效果
         */
        TaskExecutor.prototype.cancel = function (reason) {
            if (reason === void 0) { reason = null; }
            if (!this.isRunning)
                return;
            if (this.syncLock) {
                for (var i = 0; i < this.mTasks.length; ++i) {
                    this.mTasks[i].cancel(reason);
                }
                if (this.timers) {
                    for (var k in this.timers) {
                        this.timers[k].cancel(reason);
                    }
                    this.timers = null;
                }
            }
            else {
                this.mTasks[this.mCursor].cancel(reason);
            }
            return this;
        };
        /**
         * 析构函数，释放所有资源
         * 析构之前会先调用一次cancel(),打断所有正在执行的任务
        */
        TaskExecutor.prototype.dispose = function () {
            this.cancel();
            // this.mCompleteHandler && this.mCompleteHandler.recover();
            this.mCompleteHandler = null;
            this.mCompleteHandlerArgs = [];
            // this.mCancelHandler && this.mCancelHandler.recover();
            this.mCancelHandler = null;
            this.mCancelHandlerArgs = [];
            // 回收
            // this.mTasks.forEach(exe => exe.dispose());
            this.mTasks = [];
            // this.mSingleHandlers.forEach((handler) => handler.recover());
            this.mSingleHandlers = [];
            this.mSingleHandlerArgs = [];
            // this.mSingleCancelHandlers.forEach(Handler => Handler.recover());
            this.mSingleCancelHandlers = [];
            this.mSingleCancelHandlerArgs = [];
            // this.syncLock && this.syncLock.dispose();
            // this.syncLock = null;
            this.clearTimer();
        };
        /**
         *
         * @param waitable
         * @param completeHandler
         * @param args
         * @param cancelHandler
         * @param cancelArgs
         */
        TaskExecutor.prototype.add = function (waitable, completeHandler, args, cancelHandler, cancelArgs) {
            if (completeHandler === void 0) { completeHandler = null; }
            if (args === void 0) { args = []; }
            if (cancelHandler === void 0) { cancelHandler = null; }
            if (cancelArgs === void 0) { cancelArgs = []; }
            this.mTasks.push(waitable);
            this.mSingleHandlers.push(completeHandler);
            this.mSingleHandlerArgs.push(args);
            this.mSingleCancelHandlers.push(cancelHandler);
            this.mSingleCancelHandlerArgs.push(cancelArgs);
            return this;
        };
        /**
         * 设置完成时的回调，此回调是在所有执行队列都执行完成后才会回调
         * @param handler 回调
         * @param args 参数
         */
        TaskExecutor.prototype.setCompleteHandler = function (handler, args) {
            if (args === void 0) { args = []; }
            // this.mCompleteHandler && this.mCompleteHandler.recover();
            this.mCompleteHandler = handler;
            this.mCompleteHandlerArgs = args;
            return this;
        };
        /**
         * 设置取消时的回调
         * @param handler
         * @param args
         */
        TaskExecutor.prototype.setCancelHandler = function (handler, args) {
            if (args === void 0) { args = []; }
            // this.mCancelHandler && this.mCancelHandler.recover();
            this.mCancelHandler = handler;
            this.mCancelHandlerArgs = args;
            return this;
        };
        TaskExecutor.prototype.executeSingle = function (idx, delay) {
            return __awaiter(this, void 0, void 0, function () {
                var cancel, cancelArgs, timer, ret, exe, handler, args, ret, reason_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            cancel = this.mSingleCancelHandlers[idx];
                            cancelArgs = this.mSingleCancelHandlerArgs[idx];
                            if (!(delay > 0)) return [3 /*break*/, 2];
                            timer = this.addTimer(idx);
                            return [4 /*yield*/, timer.forMSeconds(delay).wait()];
                        case 1:
                            ret = _a.sent();
                            if (ret.isFailed) {
                                cancel && cancel.runWith([].concat(cancelArgs, ret.error));
                                this.syncLock.cancel();
                                timer.dispose();
                                timer = null;
                                return [2 /*return*/];
                            }
                            timer.dispose();
                            timer = null;
                            _a.label = 2;
                        case 2:
                            if (idx < 0 || idx >= this.mTasks.length)
                                return [2 /*return*/];
                            exe = this.mTasks[idx];
                            handler = this.mSingleHandlers[idx];
                            args = this.mSingleCancelHandlerArgs[idx];
                            _a.label = 3;
                        case 3:
                            _a.trys.push([3, 5, , 6]);
                            return [4 /*yield*/, exe.wait()];
                        case 4:
                            ret = _a.sent();
                            handler && handler.runWith([].concat(args, ret));
                            this.syncLock.done();
                            return [3 /*break*/, 6];
                        case 5:
                            reason_2 = _a.sent();
                            cancel && cancel.runWith([].concat(cancelArgs, reason_2));
                            this.syncLock.cancel();
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        TaskExecutor.prototype.addTimer = function (idx) {
            var timer = new riggerIOC.WaitForTime();
            if (!this.timers)
                this.timers = {};
            this.timers[idx] = timer;
            return timer;
        };
        TaskExecutor.prototype.clearTimer = function () {
            if (!this.timers)
                return;
            for (var k in this.timers) {
                // console.log("k in timer:" + k);
                this.timers[k].dispose();
                this.timers[k] = null;
                delete this.timers[k];
            }
            this.timers = null;
        };
        TaskExecutor._sign = "_sign_sequent_executor";
        return TaskExecutor;
    }());
    riggerIOC.TaskExecutor = TaskExecutor;
})(riggerIOC || (riggerIOC = {}));
/*
 * Copyright 2018 Yang Wu.
 *
 *	Licensed under the Apache License, Version 2.0 (the "License");
 *	you may not use this file except in compliance with the License.
 *	You may obtain a copy of the License at
 *
 *		http://www.apache.org/licenses/LICENSE-2.0
 *
 *		Unless required by applicable law or agreed to in writing, software
 *		distributed under the License is distributed on an "AS IS" BASIS,
 *		WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *		See the License for the specific language governing permissions and
 *		limitations under the License.
 */
/**
* 任务执行器的同步锁
* 辅助确保所有任务并发执行时，都执行完毕或被打断
*/
var riggerIOC;
(function (riggerIOC) {
    var TaskExecutorLock = /** @class */ (function (_super) {
        __extends(TaskExecutorLock, _super);
        function TaskExecutorLock(totalNum) {
            var _this = _super.call(this) || this;
            _this.totalTaskNum = 0;
            _this.doneNum = 0;
            _this.canceledNum = 0;
            _this.totalTaskNum = totalNum;
            _this.doneNum = 0;
            _this.canceledNum = 0;
            return _this;
        }
        TaskExecutorLock.prototype.adjustTotalNum = function (num) {
            this.totalTaskNum = num;
            this.check();
        };
        TaskExecutorLock.prototype.done = function () {
            ++this.doneNum;
            this.check();
        };
        TaskExecutorLock.prototype.cancel = function () {
            ++this.canceledNum;
            this.check();
        };
        TaskExecutorLock.prototype.check = function () {
            if (this.doneNum + this.canceledNum >= this.totalTaskNum) {
                if (this.canceledNum > 0) {
                    _super.prototype.cancel.call(this);
                }
                else {
                    _super.prototype.done.call(this);
                }
            }
        };
        return TaskExecutorLock;
    }(riggerIOC.BaseWaitable));
    riggerIOC.TaskExecutorLock = TaskExecutorLock;
})(riggerIOC || (riggerIOC = {}));
/*
 * Copyright 2018 Yang Wu.
 *
 *	Licensed under the Apache License, Version 2.0 (the "License");
 *	you may not use this file except in compliance with the License.
 *	You may obtain a copy of the License at
 *
 *		http://www.apache.org/licenses/LICENSE-2.0
 *
 *		Unless required by applicable law or agreed to in writing, software
 *		distributed under the License is distributed on an "AS IS" BASIS,
 *		WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *		See the License for the specific language governing permissions and
 *		limitations under the License.
 */
var riggerIOC;
(function (riggerIOC) {
    var CommandBindTuple = /** @class */ (function () {
        function CommandBindTuple(cls) {
            this.ctr = cls;
            this.inst = null;
        }
        return CommandBindTuple;
    }());
    riggerIOC.CommandBindTuple = CommandBindTuple;
})(riggerIOC || (riggerIOC = {}));
/*
 * Copyright 2018 Yang Wu.
 *
 *	Licensed under the Apache License, Version 2.0 (the "License");
 *	you may not use this file except in compliance with the License.
 *	You may obtain a copy of the License at
 *
 *		http://www.apache.org/licenses/LICENSE-2.0
 *
 *		Unless required by applicable law or agreed to in writing, software
 *		distributed under the License is distributed on an "AS IS" BASIS,
 *		WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *		See the License for the specific language governing permissions and
 *		limitations under the License.
 */
/**
* 一个可以等待的任务基类
*/
var riggerIOC;
(function (riggerIOC) {
    var WaitableTask = /** @class */ (function (_super) {
        __extends(WaitableTask, _super);
        function WaitableTask(content) {
            if (content === void 0) { content = null; }
            var _this = _super.call(this) || this;
            _this.mContent = null;
            _this.setContent(content);
            return _this;
        }
        WaitableTask.prototype.dispose = function () {
            this.mContent = null;
            _super.prototype.dispose.call(this);
        };
        Object.defineProperty(WaitableTask.prototype, "content", {
            /**
             * 获取任务内容
             */
            get: function () {
                return this.mContent;
            },
            /**
             * 设置任务内容
             */
            set: function (content) {
                this.setContent(content);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 设置任务内容
         */
        WaitableTask.prototype.setContent = function (content) {
            this.mContent = content;
            return this;
        };
        return WaitableTask;
    }(riggerIOC.BaseWaitable));
    riggerIOC.WaitableTask = WaitableTask;
})(riggerIOC || (riggerIOC = {}));
/*
 * Copyright 2018 Yang Wu.
 *
 *	Licensed under the Apache License, Version 2.0 (the "License");
 *	you may not use this file except in compliance with the License.
 *	You may obtain a copy of the License at
 *
 *		http://www.apache.org/licenses/LICENSE-2.0
 *
 *		Unless required by applicable law or agreed to in writing, software
 *		distributed under the License is distributed on an "AS IS" BASIS,
 *		WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *		See the License for the specific language governing permissions and
 *		limitations under the License.
 */
var riggerIOC;
(function (riggerIOC) {
    var Event = /** @class */ (function () {
        function Event(mgr) {
            this.listenerManager = mgr;
        }
        Event.prototype.stop = function () {
            this.listenerManager && this.listenerManager.stop();
        };
        return Event;
    }());
    riggerIOC.Event = Event;
})(riggerIOC || (riggerIOC = {}));
/*
 * Copyright 2018 Yang Wu.
 *
 *	Licensed under the Apache License, Version 2.0 (the "License");
 *	you may not use this file except in compliance with the License.
 *	You may obtain a copy of the License at
 *
 *		http://www.apache.org/licenses/LICENSE-2.0
 *
 *		Unless required by applicable law or agreed to in writing, software
 *		distributed under the License is distributed on an "AS IS" BASIS,
 *		WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *		See the License for the specific language governing permissions and
 *		limitations under the License.
 */
var riggerIOC;
(function (riggerIOC) {
    var EventDispatcher = /** @class */ (function () {
        function EventDispatcher() {
            this.eventsMap = {}; //{key:[]}
        }
        EventDispatcher.prototype.dispatch = function (eventName) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var listenerMgr = this.eventsMap[eventName];
            if (!listenerMgr)
                return;
            var e = new riggerIOC.Event(listenerMgr);
            listenerMgr.execute.apply(listenerMgr, [e].concat(args));
        };
        EventDispatcher.prototype.on = function (eventName, caller, method) {
            var args = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                args[_i - 3] = arguments[_i];
            }
            var listenerMgr = this.eventsMap[eventName];
            if (!listenerMgr)
                listenerMgr = this.eventsMap[eventName] = new riggerIOC.ListenerManager();
            return listenerMgr.on(caller, method, args);
        };
        EventDispatcher.prototype.off = function (eventName, caller, method) {
            var listenerMgr = this.eventsMap[eventName];
            if (!listenerMgr)
                return;
            return listenerMgr.off(caller, method);
        };
        EventDispatcher.prototype.dispose = function () {
            this.clear();
            this.eventsMap = null;
        };
        EventDispatcher.prototype.clear = function () {
            for (var k in this.eventsMap) {
                this.eventsMap[k].dispose();
                delete this.eventsMap[k];
            }
        };
        return EventDispatcher;
    }());
    riggerIOC.EventDispatcher = EventDispatcher;
})(riggerIOC || (riggerIOC = {}));
/*
 * Copyright 2018 Yang Wu.
 *
 *	Licensed under the Apache License, Version 2.0 (the "License");
 *	you may not use this file except in compliance with the License.
 *	You may obtain a copy of the License at
 *
 *		http://www.apache.org/licenses/LICENSE-2.0
 *
 *		Unless required by applicable law or agreed to in writing, software
 *		distributed under the License is distributed on an "AS IS" BASIS,
 *		WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *		See the License for the specific language governing permissions and
 *		limitations under the License.
 */
var riggerIOC;
(function (riggerIOC) {
    var EventCommandBindInfo = /** @class */ (function () {
        function EventCommandBindInfo(msg) {
            this.message = null;
            this.message = msg;
            this.bindTuples = [];
        }
        /**
         * 绑定到指定命令
         * @param cls
         */
        EventCommandBindInfo.prototype.to = function (cls) {
            var infos = this.bindTuples;
            var len = infos.length;
            var tuple;
            for (var i = 0; i < len; ++i) {
                tuple = infos[i];
                if (tuple.ctr === cls) {
                    return this;
                }
            }
            infos.push(new riggerIOC.CommandBindTuple(cls));
            return this;
        };
        EventCommandBindInfo.prototype.toValue = function (value) {
            // TODO 等待实现
            return this;
        };
        EventCommandBindInfo.prototype.once = function () {
            return this;
        };
        EventCommandBindInfo.prototype.inSequence = function () {
            return this;
        };
        /**
         * 将绑定设置为单例模式
         * ！！！对于Command而言，其总是单例的，此接口只是为了提醒使用者
         */
        EventCommandBindInfo.prototype.toSingleton = function () {
            throw new Error("command is always Singleton.");
        };
        EventCommandBindInfo.prototype.dispose = function () {
        };
        return EventCommandBindInfo;
    }());
    riggerIOC.EventCommandBindInfo = EventCommandBindInfo;
})(riggerIOC || (riggerIOC = {}));
/*
 * Copyright 2018 Yang Wu.
 *
 *	Licensed under the Apache License, Version 2.0 (the "License");
 *	you may not use this file except in compliance with the License.
 *	You may obtain a copy of the License at
 *
 *		http://www.apache.org/licenses/LICENSE-2.0
 *
 *		Unless required by applicable law or agreed to in writing, software
 *		distributed under the License is distributed on an "AS IS" BASIS,
 *		WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *		See the License for the specific language governing permissions and
 *		limitations under the License.
 */
///<reference path = "../../coroutine/SafeWaitable.ts" />
/**
 * 这是一个可等待的命令（异步)
 */
var riggerIOC;
(function (riggerIOC) {
    var WaitableCommand = /** @class */ (function (_super) {
        __extends(WaitableCommand, _super);
        function WaitableCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        WaitableCommand.prototype.cancel = function (reason) {
            if (reason === void 0) { reason = null; }
            _super.prototype.cancel.call(this, reason);
            this.onCancel(reason);
        };
        WaitableCommand.prototype.onCancel = function (reason) {
        };
        return WaitableCommand;
    }(riggerIOC.SafeWaitable));
    riggerIOC.WaitableCommand = WaitableCommand;
})(riggerIOC || (riggerIOC = {}));
/**
* name
*/
/// <reference path = "./WaitableCommand.ts" />
var riggerIOC;
(function (riggerIOC) {
    /**
     * 模块启动完成的命令
     */
    var ModuleDoneCommand = /** @class */ (function (_super) {
        __extends(ModuleDoneCommand, _super);
        function ModuleDoneCommand() {
            return _super.call(this) || this;
        }
        ModuleDoneCommand.prototype.execute = function () {
            this.moduleContext && this.moduleContext.done();
            // this.done();
        };
        ModuleDoneCommand.prototype.setModuleContext = function (moduleContext) {
            this.moduleContext = moduleContext;
        };
        ModuleDoneCommand.prototype.dispose = function () {
            this.moduleContext = null;
        };
        return ModuleDoneCommand;
    }(riggerIOC.Command));
    riggerIOC.ModuleDoneCommand = ModuleDoneCommand;
})(riggerIOC || (riggerIOC = {}));
/*
 * Copyright 2018 Yang Wu.
 *
 *	Licensed under the Apache License, Version 2.0 (the "License");
 *	you may not use this file except in compliance with the License.
 *	You may obtain a copy of the License at
 *
 *		http://www.apache.org/licenses/LICENSE-2.0
 *
 *		Unless required by applicable law or agreed to in writing, software
 *		distributed under the License is distributed on an "AS IS" BASIS,
 *		WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *		See the License for the specific language governing permissions and
 *		limitations under the License.
 */
var riggerIOC;
(function (riggerIOC) {
    // export class InjectionStatistics {
    // 	constructor(id: string | number, owner?: any, fromConstructor?: any, toConstructor?: any) {
    // 		this.id = id;
    // 		this.owner = owner;
    // 		this.fromConstructor = fromConstructor;
    // 		this.toConstructor = toConstructor;
    // 	}
    // 	dispose() {
    // 		this.owner = this.fromConstructor = this.toConstructor = null;
    // 	}
    // 	id: string | number;
    // 	owner: any;
    // 	fromConstructor: any;
    // 	toConstructor: any;
    // }
    /**
     * 应用上下文，表示一个应用
     * 可以等待应用启动完成
     */
    var ApplicationContext = /** @class */ (function (_super) {
        __extends(ApplicationContext, _super);
        /**
         * @param appId 应用ID，如果不传入，则自动生成,必须全局唯一
         * @param ifStartImmediatly 是否立刻启动应用,默认为true
         */
        function ApplicationContext(appId, ifLaunchImmediatly) {
            if (ifLaunchImmediatly === void 0) { ifLaunchImmediatly = true; }
            var _this = _super.call(this) || this;
            // exit(): Promise<any> {
            // 	return 
            // }
            _this.disposing = false;
            _this.mInjectionBinder = null;
            _this.injectionTracks = [];
            _this.disposing = false;
            // 分配appId
            if (appId == null || appId == undefined) {
                appId = ApplicationContext.mallocAppId();
            }
            else {
                if (!ApplicationContext.isAppIdValid(appId)) {
                    throw new Error("\"" + appId + "\" is not a valid app id.");
                }
            }
            _this.appId = appId;
            if (!ApplicationContext.appIdsMap)
                ApplicationContext.appIdsMap = {};
            ApplicationContext.appIdsMap[appId] = _this;
            if (riggerIOC.debug) {
                _this.analyser = new ApplicationContextAnalyser(_this);
            }
            // 绑定命令绑定器，默认绑定为SignalCommandBinder
            _this.bindCommandBinder();
            _this.bindMediationBinder();
            _this.onInit();
            if (ifLaunchImmediatly) {
                _this.launch();
            }
            return _this;
        }
        ApplicationContext.getApplication = function (appId) {
            return ApplicationContext.appIdsMap[appId];
        };
        /**
         * 释放appID,只在debug模式下有效
         * @param appId
         */
        ApplicationContext.freeAppId = function (appId) {
            if (!riggerIOC.debug)
                return;
            delete ApplicationContext.appIdsMap[appId];
        };
        /**
         * 分配一个有效的appId;
         */
        ApplicationContext.mallocAppId = function () {
            if (!ApplicationContext.isAppIdValid(ApplicationContext.mNowAppId)) {
                ++ApplicationContext.mNowAppId;
                return ApplicationContext.mallocAppId();
            }
            else {
                return ApplicationContext.mNowAppId;
            }
        };
        /**
         * 检查appID是否有效
         * @param appId
         */
        ApplicationContext.isAppIdValid = function (appId) {
            if (!ApplicationContext.appIdsMap)
                return true;
            return !ApplicationContext.appIdsMap[appId];
        };
        Object.defineProperty(ApplicationContext.prototype, "injectionBinder", {
            get: function () {
                if (!this.mInjectionBinder) {
                    this.mInjectionBinder = new riggerIOC.ApplicationInjectionBinder(this.appId, riggerIOC.InjectionBinder.instance, this);
                }
                return this.mInjectionBinder;
            },
            enumerable: true,
            configurable: true
        });
        ApplicationContext.prototype.launch = function () {
            return this.wait();
        };
        /**
         * 应用模块初始化回调
         */
        ApplicationContext.prototype.onInit = function () {
        };
        ApplicationContext.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                var i;
                return __generator(this, function (_a) {
                    if (this.disposing)
                        return [2 /*return*/];
                    this.disposing = true;
                    if (!riggerIOC.debug) {
                        delete ApplicationContext.appIdsMap[this.appId];
                    }
                    for (i = this.modules.length - 1; i >= 0; --i) {
                        this.injectionBinder.unbind(this.modules[i]);
                    }
                    // this.injectionBinder = null;
                    this.modules = null;
                    this.modulesInstance = null;
                    // this.commandBinder.dispose();
                    this.commandBinder.dispose();
                    this.commandBinder = null;
                    this.mediationBinder.dispose();
                    this.mediationBinder = null;
                    // 清除绑定信息
                    if (this.mInjectionBinder) {
                        this.mInjectionBinder.dispose();
                        this.mInjectionBinder = null;
                    }
                    _super.prototype.dispose.call(this);
                    return [2 /*return*/];
                });
            });
        };
        ApplicationContext.prototype.getInjectionBinder = function () {
            return this.injectionBinder;
        };
        ApplicationContext.prototype.getCommandBinder = function () {
            return this.commandBinder;
        };
        ApplicationContext.prototype.getMediationBinder = function () {
            return this.mediationBinder;
        };
        ApplicationContext.prototype.startTask = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _super.prototype.startTask.apply(this, args);
            // this.injectionBinder = InjectionBinder.instance;
            // 注入自身
            // this.injectionBinder.bind(ApplicationContext).toValue(this);
            // 绑定用户的注入
            this.bindInjections();
            // 绑定用户的命令
            this.bindCommands();
            this.modules = [];
            // 注册模块
            this.registerModuleContexts();
            // 实例化所有的模块
            this.initializeModuleContexts();
            return this;
        };
        ApplicationContext.prototype.initializeModuleContexts = function () {
            return __awaiter(this, void 0, void 0, function () {
                var m, i, info;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.modulesInstance = [];
                            i = 0;
                            _a.label = 1;
                        case 1:
                            if (!(i < this.modules.length)) return [3 /*break*/, 4];
                            info = this.injectionBinder.bind(this.modules[i]);
                            m = new info.realClass(this);
                            this.modulesInstance.push(m);
                            info.toValue(m);
                            m.start();
                            return [4 /*yield*/, m.wait()];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            ++i;
                            return [3 /*break*/, 1];
                        case 4:
                            this.done();
                            return [2 /*return*/];
                    }
                });
            });
        };
        ApplicationContext.prototype.addModuleContext = function (contextCls) {
            this.modules.push(contextCls);
            return this;
        };
        ApplicationContext.prototype.bindCommandBinder = function () {
            // 绑定 命令绑定器
            this.injectionBinder.bind(riggerIOC.CommandBinder).toValue(new riggerIOC.SignalCommandBinder(this.injectionBinder));
        };
        ApplicationContext.prototype.bindMediationBinder = function () {
            this.injectionBinder.bind(riggerIOC.MediationBinder).toValue(new riggerIOC.MediationBinder(this.injectionBinder));
        };
        /**
         * 全局的注入追踪信息（不属于任何一个App)
         */
        ApplicationContext.globalInjectionTracks = [];
        /**
         * 当前自增的appId
         */
        ApplicationContext.mNowAppId = 1;
        __decorate([
            riggerIOC.inject(riggerIOC.CommandBinder)
        ], ApplicationContext.prototype, "commandBinder", void 0);
        __decorate([
            riggerIOC.inject(riggerIOC.MediationBinder)
        ], ApplicationContext.prototype, "mediationBinder", void 0);
        return ApplicationContext;
    }(riggerIOC.BaseWaitable));
    riggerIOC.ApplicationContext = ApplicationContext;
    var AnalyseResult = /** @class */ (function () {
        function AnalyseResult() {
            this.stickInsts = [];
            this.instsWithInjectionError = [];
            this.instsWithDisposeError = [];
            this.analyseReport = "";
        }
        return AnalyseResult;
    }());
    riggerIOC.AnalyseResult = AnalyseResult;
    var ApplicationContextAnalyser = /** @class */ (function () {
        function ApplicationContextAnalyser(app) {
            this.injectionTracks = [];
            this.appId = app.appId;
            this.injectionTracks = app.injectionTracks;
        }
        /**
         * 分析
         */
        ApplicationContextAnalyser.prototype.analyze = function () {
            var ret = new AnalyseResult();
            // 未释放的
            var stickyInsts = this.stickyInsts;
            ret.stickInsts = stickyInsts;
            var retReport = "======= 尚未释放的对象 ======\r\n";
            for (var i = 0; i < stickyInsts.length; ++i) {
                retReport += stickyInsts[i].toString() + "\r\n";
            }
            retReport += "======= 注入时发生了错误的对象 ======\r\n";
            var errorInsts = this.injectErrorInsts;
            ret.instsWithInjectionError = errorInsts;
            if (errorInsts.length > 0) {
                for (var i = 0; i < errorInsts.length; ++i) {
                    retReport += errorInsts[i].toString() + "\r\n";
                }
            }
            else {
                retReport += "\r\n";
            }
            retReport += "====== 析构时发生错误的对象 =====\r\n";
            ret.instsWithDisposeError = errorInsts = this.disposeErrorInsts;
            for (var j = 0; j < errorInsts.length; ++j) {
                retReport += errorInsts[j].toString() + "\r\n";
            }
            ret.analyseReport = retReport;
            return ret;
        };
        Object.defineProperty(ApplicationContextAnalyser.prototype, "stickyInsts", {
            /**
             * 获取未释放的追踪信息
             */
            get: function () {
                var ret = [];
                var total = this.injectionTracks.concat(ApplicationContext.globalInjectionTracks);
                for (var i = 0; i < total.length; ++i) {
                    var tempTrack = total[i];
                    var refCount = riggerIOC.getRefCount(tempTrack.inst);
                    if (refCount > 0) {
                        ret.push(tempTrack);
                    }
                }
                return ret;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ApplicationContextAnalyser.prototype, "injectErrorInsts", {
            /**
             * 注入发生错误的实例
             */
            get: function () {
                var ret = [];
                var total = this.injectionTracks.concat(ApplicationContext.globalInjectionTracks);
                for (var i = 0; i < total.length; ++i) {
                    var tempTrack = total[i];
                    var error = tempTrack.injectError;
                    if (error) {
                        ret.push(tempTrack);
                    }
                }
                return ret;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ApplicationContextAnalyser.prototype, "disposeErrorInsts", {
            /**
             * 析构发生错误的实例
             */
            get: function () {
                var ret = [];
                var total = this.injectionTracks.concat(ApplicationContext.globalInjectionTracks);
                for (var i = 0; i < total.length; ++i) {
                    var tempTrack = total[i];
                    var error = tempTrack.disposeError;
                    if (error) {
                        ret.push(tempTrack);
                    }
                }
                return ret;
            },
            enumerable: true,
            configurable: true
        });
        return ApplicationContextAnalyser;
    }());
    riggerIOC.ApplicationContextAnalyser = ApplicationContextAnalyser;
})(riggerIOC || (riggerIOC = {}));
/*
 * Copyright 2018 Yang Wu.
 *
 *	Licensed under the Apache License, Version 2.0 (the "License");
 *	you may not use this file except in compliance with the License.
 *	You may obtain a copy of the License at
 *
 *		http://www.apache.org/licenses/LICENSE-2.0
 *
 *		Unless required by applicable law or agreed to in writing, software
 *		distributed under the License is distributed on an "AS IS" BASIS,
 *		WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *		See the License for the specific language governing permissions and
 *		limitations under the License.
 */
///<reference path = "../../coroutine/BaseWaitable.ts" />
var riggerIOC;
(function (riggerIOC) {
    /**
     * 模块上下文
     * 模块上下文初始化（启动）完成后，需要通过以下语句显式（在onStart）通知：
     * 		this.doneCommand.execute()
     * 或
     * 		this.done()
    */
    var ModuleContext = /** @class */ (function (_super) {
        __extends(ModuleContext, _super);
        function ModuleContext(appContext) {
            var _this = _super.call(this) || this;
            _this.applicationContext = appContext;
            _this.doneCommand = new riggerIOC.ModuleDoneCommand();
            _this.doneCommand.setModuleContext(_this);
            _this.bindInjections();
            _this.bindCommands();
            _this.bindMediators();
            _this.onInit();
            return _this;
        }
        /**
         * 各种注入完成之后调用，模块生命周期内只调用一次
         */
        ModuleContext.prototype.onInit = function () {
        };
        ModuleContext.prototype.dispose = function () {
            this.doneCommand.dispose();
            this.doneCommand = null;
            // 
            // if(this.mInjectionBinder){
            // 	this.mInjectionBinder.dispose();
            // 	this.mInjectionBinder = null;
            // }
            this.applicationContext = null;
            _super.prototype.dispose.call(this);
        };
        Object.defineProperty(ModuleContext.prototype, "injectionBinder", {
            get: function () {
                // if(!this.mInjectionBinder){
                // 	this.mInjectionBinder = new ApplicationInjectionBinder(this.applicationContext.appId, this.applicationContext.getInjectionBinder(), this)
                // }
                // return this.mInjectionBinder;
                return this.applicationContext.getInjectionBinder();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModuleContext.prototype, "commandBinder", {
            // protected mInjectionBinder: ApplicationInjectionBinder = null;
            get: function () {
                return this.getCommandBinder();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModuleContext.prototype, "mediationBinder", {
            get: function () {
                return this.getMediationBinder();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 获取注入绑定器
         */
        ModuleContext.prototype.getInjectionBinder = function () {
            return this.injectionBinder;
        };
        /**
         * 获取命令绑定器
         */
        ModuleContext.prototype.getCommandBinder = function () {
            return this.applicationContext.getCommandBinder();
        };
        ModuleContext.prototype.getMediationBinder = function () {
            return this.applicationContext.getMediationBinder();
        };
        ModuleContext.prototype.start = function () {
            _super.prototype.startTask.call(this);
            this.onStart();
        };
        ModuleContext = __decorate([
            riggerIOC.autoDispose
        ], ModuleContext);
        return ModuleContext;
    }(riggerIOC.BaseWaitable));
    riggerIOC.ModuleContext = ModuleContext;
})(riggerIOC || (riggerIOC = {}));
/*
 * Copyright 2018 Yang Wu.
 *
 *	Licensed under the Apache License, Version 2.0 (the "License");
 *	you may not use this file except in compliance with the License.
 *	You may obtain a copy of the License at
 *
 *		http://www.apache.org/licenses/LICENSE-2.0
 *
 *		Unless required by applicable law or agreed to in writing, software
 *		distributed under the License is distributed on an "AS IS" BASIS,
 *		WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *		See the License for the specific language governing permissions and
 *		limitations under the License.
 */
var riggerIOC;
(function (riggerIOC) {
    var Model = /** @class */ (function () {
        function Model() {
        }
        Model.prototype.dispose = function () { };
        Model = __decorate([
            riggerIOC.autoDispose
        ], Model);
        return Model;
    }());
    riggerIOC.Model = Model;
})(riggerIOC || (riggerIOC = {}));
/*
 * Copyright 2018 Yang Wu.
 *
 *	Licensed under the Apache License, Version 2.0 (the "License");
 *	you may not use this file except in compliance with the License.
 *	You may obtain a copy of the License at
 *
 *		http://www.apache.org/licenses/LICENSE-2.0
 *
 *		Unless required by applicable law or agreed to in writing, software
 *		distributed under the License is distributed on an "AS IS" BASIS,
 *		WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *		See the License for the specific language governing permissions and
 *		limitations under the License.
 */
var riggerIOC;
(function (riggerIOC) {
    var Server = /** @class */ (function () {
        function Server() {
        }
        Server.prototype.dispose = function () { };
        Server = __decorate([
            riggerIOC.autoDispose
        ], Server);
        return Server;
    }());
    riggerIOC.Server = Server;
})(riggerIOC || (riggerIOC = {}));
/*
 * Copyright 2018 Yang Wu.
 *
 *	Licensed under the Apache License, Version 2.0 (the "License");
 *	you may not use this file except in compliance with the License.
 *	You may obtain a copy of the License at
 *
 *		http://www.apache.org/licenses/LICENSE-2.0
 *
 *		Unless required by applicable law or agreed to in writing, software
 *		distributed under the License is distributed on an "AS IS" BASIS,
 *		WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *		See the License for the specific language governing permissions and
 *		limitations under the License.
 */
var riggerIOC;
(function (riggerIOC) {
    var Signal = /** @class */ (function () {
        function Signal() {
        }
        Signal.prototype.dispose = function () {
            this.listenerMgr && this.listenerMgr.dispose();
            this.listenerMgr = null;
        };
        /**
         * 派发信号, 派发信号时附带的参数将被追加到监听函数的参数列表最末尾
         * @param arg
         */
        Signal.prototype.dispatch = function (arg) {
            if (this.listenerMgr)
                this.listenerMgr.execute(arg);
        };
        /**
         * 注册回调
         * @param caller
         * @param method
         * @param args
         */
        Signal.prototype.on = function (caller, method, args, recoverBefore) {
            if (recoverBefore === void 0) { recoverBefore = true; }
            this.makeSureListenerManager();
            this.listenerMgr.on(caller, method, args, false, recoverBefore);
        };
        /**
         * 注册一次性回调
         * @param caller
         * @param method
         * @param args
         */
        Signal.prototype.once = function (caller, method, args, recoverBefore) {
            if (recoverBefore === void 0) { recoverBefore = true; }
            this.makeSureListenerManager();
            this.listenerMgr.on(caller, method, args, true);
        };
        /**
         * 取消回调
         * @param caller
         * @param method
         */
        Signal.prototype.off = function (caller, method) {
            if (this.listenerMgr)
                this.listenerMgr.off(caller, method);
        };
        /**
         * 保证ListenerManager可用
         */
        Signal.prototype.makeSureListenerManager = function () {
            if (!this.listenerMgr)
                this.listenerMgr = new riggerIOC.ListenerManager();
        };
        Signal = __decorate([
            riggerIOC.autoDispose
        ], Signal);
        return Signal;
    }());
    riggerIOC.Signal = Signal;
})(riggerIOC || (riggerIOC = {}));
var riggerIOC;
(function (riggerIOC) {
    var InjectionWrapper = /** @class */ (function () {
        function InjectionWrapper() {
        }
        InjectionWrapper.wrap = function (klass) {
            if (!klass)
                return null;
            // 使用hasOwnProperty进行判断，防止误取到其父类的
            if (klass.hasOwnProperty(InjectionWrapper.ID_KEY))
                return klass[InjectionWrapper.ID_KEY];
            var id = InjectionWrapper.mallocId();
            klass[InjectionWrapper.ID_KEY] = id;
            return id;
        };
        InjectionWrapper.unWrap = function (klass) {
            delete klass[InjectionWrapper.ID_KEY];
        };
        InjectionWrapper.getId = function (klass) {
            if (!klass.hasOwnProperty(InjectionWrapper.ID_KEY))
                return null;
            return klass[InjectionWrapper.ID_KEY];
        };
        InjectionWrapper.mallocId = function () {
            return InjectionWrapper.NOW_ID++;
        };
        InjectionWrapper.NOW_ID = 1;
        InjectionWrapper.ID_KEY = "$iocid";
        return InjectionWrapper;
    }());
    riggerIOC.InjectionWrapper = InjectionWrapper;
})(riggerIOC || (riggerIOC = {}));
var riggerIOC;
(function (riggerIOC) {
    /**
     * 表示结果
     */
    var Result = /** @class */ (function () {
        function Result(result, error) {
            if (result === void 0) { result = null; }
            if (error === void 0) { error = null; }
            this.result = result;
            this.error = error;
        }
        Object.defineProperty(Result.prototype, "reason", {
            /**
             * 失败或打断原因，同 error
             */
            get: function () {
                return this.error;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Result.prototype, "isOk", {
            get: function () {
                return this.error == null || this.error == undefined;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Result.prototype, "isFailed", {
            get: function () {
                return !this.isOk;
            },
            enumerable: true,
            configurable: true
        });
        return Result;
    }());
    riggerIOC.Result = Result;
})(riggerIOC || (riggerIOC = {}));
var riggerIOC;
(function (riggerIOC) {
    var Utils = /** @class */ (function () {
        function Utils() {
        }
        /**
         * 判断给定值是否是字符串
         * @param val
         */
        Utils.isString = function (val) {
            return typeof val === "string";
        };
        /**
         * 是否是数组
         */
        Utils.isArray = function (arr) {
            return arr instanceof Array;
        };
        /**
         * 检查是否为空或未定义
         */
        Utils.isNullOrUndefined = function (obj) {
            return obj === null || obj === undefined;
        };
        /**
         * 字符串是否为空或空串
         */
        Utils.isNullOrEmpty = function (str) {
            return Utils.isNullOrUndefined(str) || str.length <= 0;
        };
        /**
         * 判断值是否是一个数字(而不管是否可以转化成一个数字)
         * @param {any} value
         */
        Utils.isNumber = function (value) {
            if (Utils.isNullOrUndefined(value))
                return false;
            if (Utils.isString(value))
                return false;
            return !isNaN(value);
        };
        return Utils;
    }());
    riggerIOC.Utils = Utils;
})(riggerIOC || (riggerIOC = {}));
/*
 * Copyright 2018 Yang Wu.
 *
 *	Licensed under the Apache License, Version 2.0 (the "License");
 *	you may not use this file except in compliance with the License.
 *	You may obtain a copy of the License at
 *
 *		http://www.apache.org/licenses/LICENSE-2.0
 *
 *		Unless required by applicable law or agreed to in writing, software
 *		distributed under the License is distributed on an "AS IS" BASIS,
 *		WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *		See the License for the specific language governing permissions and
 *		limitations under the License.
 */
var riggerIOC;
(function (riggerIOC) {
    var Pool = /** @class */ (function () {
        function Pool() {
            this.objectPool = {};
            this.objectPool = {};
        }
        /**
         * 根据对象类型标识字符，获取对象池。
         * @param sign 对象类型标识字符。
         * @return 对象池。
         */
        Pool.prototype.getPoolBySign = function (sign) {
            var arr = this.objectPool[sign];
            if (!arr) {
                this.objectPool[sign] = arr = [];
            }
            return arr;
        };
        /**
         * 清除对象池的对象。
         * @param sign 对象类型标识字符。
         */
        Pool.prototype.clearBySign = function (sign) {
            delete this.objectPool[sign];
        };
        /**
         * 将对象放到对应类型标识的对象池中。
         * @param sign 对象类型标识字符。
         * @param item 对象。
         */
        Pool.prototype.recover = function (sign, item) {
            var old = this.getPoolBySign(sign);
            old.push(item);
        };
        /**
         * <p>根据传入的对象类型标识字符，获取对象池中此类型标识的一个对象实例。</p>
         * <p>当对象池中无此类型标识的对象时，则根据传入的类型，创建一个新的对象返回。</p>
         * @param sign 对象类型标识字符。
         * @param cls 用于创建该类型对象的类。
         * @return 此类型标识的一个对象。
         */
        Pool.prototype.getItemByClass = function (sign, cls) {
            var obj = this.getItem(sign);
            if (obj)
                return obj;
            return new cls();
        };
        /**
         * <p>根据传入的对象类型标识字符，获取对象池中此类型标识的一个对象实例。</p>
         * <p>当对象池中无此类型标识的对象时，则使用传入的创建此类型对象的函数，新建一个对象返回。</p>
         * @param sign 对象类型标识字符。
         * @param createFun 用于创建该类型对象的方法。
         * @return 此类型标识的一个对象。
         */
        Pool.prototype.getItemByCreateFun = function (sign, createFun) {
            var obj = this.getItem(sign);
            if (obj)
                return obj;
            return createFun();
        };
        /**
         * 根据传入的对象类型标识字符，获取对象池中已存储的此类型的一个对象，如果对象池中无此类型的对象，则返回 null 。
         * @param sign 对象类型标识字符。
         * @return 对象池中此类型的一个对象，如果对象池中无此类型的对象，则返回 null 。
         */
        Pool.prototype.getItem = function (sign) {
            var pool = this.getPoolBySign(sign);
            if (pool.length <= 0)
                return null;
            return pool.pop();
        };
        /**
         *
         * @param fun
         */
        Pool.prototype.forEach = function (fun) {
            if (!fun)
                return;
            var pool = this.objectPool;
            if (!pool)
                return;
            for (var k in pool) {
                var objs = pool[k];
                for (var i = 0; i < objs.length; ++i) {
                    fun(objs[i]);
                }
            }
        };
        Pool.prototype.dispose = function () {
            this.objectPool = null;
        };
        return Pool;
    }());
    riggerIOC.Pool = Pool;
})(riggerIOC || (riggerIOC = {}));
/*
 * Copyright 2018 Yang Wu.
 *
 *	Licensed under the Apache License, Version 2.0 (the "License");
 *	you may not use this file except in compliance with the License.
 *	You may obtain a copy of the License at
 *
 *		http://www.apache.org/licenses/LICENSE-2.0
 *
 *		Unless required by applicable law or agreed to in writing, software
 *		distributed under the License is distributed on an "AS IS" BASIS,
 *		WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *		See the License for the specific language governing permissions and
 *		limitations under the License.
 */
///<reference path="../pool/Pool.ts" />
var riggerIOC;
(function (riggerIOC) {
    var Handler = /** @class */ (function () {
        function Handler(caller, func, args, once) {
            if (args === void 0) { args = null; }
            if (once === void 0) { once = false; }
            this._ifOnce = false;
            this._caller = caller;
            this._method = func;
            this._args = args;
            this._ifOnce = once;
        }
        Object.defineProperty(Handler, "pool", {
            get: function () {
                if (!Handler.m_pool)
                    Handler.m_pool = new riggerIOC.Pool();
                return Handler.m_pool;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Handler.prototype, "caller", {
            get: function () {
                return this._caller;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Handler.prototype, "method", {
            get: function () {
                return this._method;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Handler.prototype, "ifOnce", {
            get: function () {
                return this._ifOnce;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Handler.prototype, "args", {
            get: function () {
                return this._args;
            },
            enumerable: true,
            configurable: true
        });
        Handler.prototype.dispose = function () {
            this._caller = null;
            this._method = null;
            this._args = null;
            this._ifOnce = false;
        };
        Handler.create = function (caller, fun, args, once) {
            if (args === void 0) { args = null; }
            if (once === void 0) { once = false; }
            var ret = Handler.pool.getItem(Handler.riggerHandlerSign);
            if (ret) {
                ret._caller = caller;
                ret._method = fun;
                ret._args = args;
                ret._ifOnce = once;
                return ret;
            }
            return new Handler(caller, fun, args, once);
        };
        /**
         * 将一个RiggerHandler回收到对象池
         * @param handler
         */
        Handler.recover = function (handler) {
            handler.dispose();
            Handler.pool.recover(Handler.riggerHandlerSign, handler);
        };
        /**
         * 替换
         * @param caller
         * @param method
         * @param args
         * @param once
         */
        Handler.prototype.replace = function (caller, method, args, once) {
            if (once === void 0) { once = false; }
            this._caller = caller;
            this._method = method;
            this._args = args;
            this._ifOnce = once;
        };
        /**
         * 将自身回收至对象池
         */
        Handler.prototype.recover = function () {
            Handler.recover(this);
        };
        Handler.prototype.once = function () {
            this._ifOnce = true;
        };
        /**
         * 是否可以覆盖
         * @param caller
         * @param method
         */
        Handler.prototype.canReplace = function (caller, method) {
            return caller == this.caller && this.method == method;
        };
        /**
         * 无参执行
         */
        Handler.prototype.run = function () {
            if (this._method) {
                var ret = this._method.apply(this._caller, this._args);
                if (this._ifOnce)
                    this.recover();
                return ret;
            }
        };
        /**
         *
         */
        // reverseExtraParams:boolean = false;
        /**
         * 带参执行
         * @param args
         */
        Handler.prototype.runWith = function (args) {
            if (!args)
                return this.run();
            if (this._method) {
                var ret = void 0;
                if (this._args) {
                    ret = this._method.apply(this._caller, this._args.concat(args));
                }
                else {
                    ret = this._method.apply(this._caller, args);
                }
                if (this._ifOnce)
                    this.recover();
                return ret;
            }
            return null;
        };
        Handler.riggerHandlerSign = "_riggerHandlerSign";
        return Handler;
    }());
    riggerIOC.Handler = Handler;
})(riggerIOC || (riggerIOC = {}));
/*
 * Copyright 2018 Yang Wu.
 *
 *	Licensed under the Apache License, Version 2.0 (the "License");
 *	you may not use this file except in compliance with the License.
 *	You may obtain a copy of the License at
 *
 *		http://www.apache.org/licenses/LICENSE-2.0
 *
 *		Unless required by applicable law or agreed to in writing, software
 *		distributed under the License is distributed on an "AS IS" BASIS,
 *		WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *		See the License for the specific language governing permissions and
 *		limitations under the License.
 */
var riggerIOC;
(function (riggerIOC) {
    var ListenerManager = /** @class */ (function () {
        function ListenerManager() {
            this.stopped = false;
        }
        ListenerManager.prototype.dispose = function () {
            this.stopped = false;
            this.clear();
        };
        ListenerManager.prototype.on = function (caller, method, args, once, coverBefore) {
            if (once === void 0) { once = false; }
            if (coverBefore === void 0) { coverBefore = true; }
            if (!this.handlers)
                this.handlers = [];
            if (coverBefore) {
                // 是否有以前的
                var handler = this.handlers.find(function (h) { return h.canReplace(caller, method); });
                if (handler) {
                    handler.replace(caller, method, args, once);
                }
                else {
                    handler = riggerIOC.Handler.create(caller, method, args, once);
                    this.handlers.push(handler);
                }
                return handler;
            }
            else {
                var handler = riggerIOC.Handler.create(caller, method, args, once);
                this.handlers.push(handler);
                return handler;
            }
        };
        /**
         * 解除回调
         * @param caller
         * @param method
         */
        ListenerManager.prototype.off = function (caller, method) {
            if (!this.handlers || this.handlers.length <= 0)
                return;
            var tempHandlers = [];
            for (var i = 0; i < this.handlers.length; i++) {
                var handler = this.handlers[i];
                if (handler.caller === caller && handler.method === method) {
                    handler.recover();
                    break;
                }
                else {
                    tempHandlers.push(handler);
                }
            }
            // 把剩下的放回
            ++i;
            for (; i < this.handlers.length; ++i) {
                tempHandlers.push(this.handlers[i]);
            }
            this.handlers = tempHandlers;
        };
        /**
         * 解除所有回调
         * @param caller
         * @param method
         */
        ListenerManager.prototype.offAll = function (caller, method) {
            if (!this.handlers || this.handlers.length <= 0)
                return;
            var temp = [];
            var handlers = this.handlers;
            var len = handlers.length;
            for (var i = 0; i < len; ++i) {
                if (caller !== handlers[i].caller || method !== handlers[i].method) {
                    temp.push(handlers[i]);
                }
                else {
                    handlers[i].recover();
                }
            }
            this.handlers = temp;
        };
        /**
         * 清除所有回调
         */
        ListenerManager.prototype.clear = function () {
            if (!this.handlers || this.handlers.length <= 0)
                return;
            for (var i = 0; i < this.handlers.length; i++) {
                var handler = this.handlers[i];
                handler.recover();
            }
            this.handlers = null;
        };
        ListenerManager.prototype.stop = function () {
            this.stopped = true;
        };
        ListenerManager.prototype.execute = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (!this.handlers || this.handlers.length <= 0)
                return;
            var handlers = this.handlers;
            var len = handlers.length;
            var handler;
            var temp = [];
            var i = 0;
            for (; i < len; ++i) {
                if (this.stopped)
                    break;
                handler = handlers[i];
                handler.runWith(args);
                if (handler.method) {
                    temp.push(handler);
                }
            }
            for (; i < len; ++i) {
                temp.push(handlers[i]);
            }
            this.stopped = false;
            this.handlers = temp;
            handler = null;
            handlers = null;
            temp = null;
        };
        return ListenerManager;
    }());
    riggerIOC.ListenerManager = ListenerManager;
})(riggerIOC || (riggerIOC = {}));
