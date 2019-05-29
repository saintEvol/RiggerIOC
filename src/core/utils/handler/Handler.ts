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
module riggerIOC {
	export class Handler {
		public static get pool(): Pool {
			if (!Handler.m_pool) Handler.m_pool = new Pool();
			return Handler.m_pool;
		}
		private static m_pool: Pool;

		protected _id: number;

		public get caller() {
			return this._caller;
		}
		private _caller: any;

		public get method() {
			return this._method;
		}
		private _method: Function;

		public get ifOnce(): boolean {
			return this._ifOnce;
		}
		private _ifOnce: boolean = false;

		public get args() {
			return this._args;
		}
		private _args: any[];
		constructor(caller: any, func: Function, args: any[] = null, once: boolean = false) {
			this._caller = caller;
			this._method = func;
			this._args = args;
			this._ifOnce = once;
		}

		dispose() {
			this._caller = null;
			this._method = null;
			this._args = null;
			this._ifOnce = false;
		}

		private static riggerHandlerSign: string = "_riggerHandlerSign";
		public static create(caller: any, fun: Function, args: any[] = null, once: boolean = false): Handler {
			let ret: Handler = Handler.pool.getItem<Handler>(Handler.riggerHandlerSign);
			if (ret) {
				ret._caller = caller;
				ret._method = fun;
				ret._args = args;
				ret._ifOnce = once;

				return ret;
			}

			return new Handler(caller, fun, args, once);
		}

		/**
		 * 将一个RiggerHandler回收到对象池
		 * @param handler 
		 */
		public static recover(handler: Handler) {
			handler.dispose();
			Handler.pool.recover(Handler.riggerHandlerSign, handler);
		}

		/**
		 * 替换
		 * @param caller 
		 * @param method 
		 * @param args 
		 * @param once 
		 */
		public replace(caller: any, method: Function, args?: any[], once: boolean = false): void {
			this._caller = caller;
			this._method = method;
			this._args = args;
			this._ifOnce = once;
		}

		/**
		 * 将自身回收至对象池
		 */
		public recover() {
			Handler.recover(this);
		}

		public once() {
			this._ifOnce = true;
		}

		/**
		 * 是否可以覆盖
		 * @param caller 
		 * @param method 
		 */
		public canReplace(caller: any, method: any): boolean {
			return caller == this.caller && this.method == method;
		}

		/**
		 * 无参执行
		 */
		public run(): any {
			if (this._method) {
				let ret: any = this._method.apply(this._caller, this._args);
				if (this._ifOnce) this.recover();
				return ret;
			}
		}

		/**
		 * 带参执行
		 * @param args 
		 */
		public runWith(args: any[]): any {
			if (!args) return this.run();

			if (this._method) {
				let ret: any;
				if (this._args) {
					ret = this._method.apply(this._caller, this._args.concat(args));
				}
				else {
					ret = this._method.apply(this._caller, args);
				}
				if (this._ifOnce) this.recover();
				return ret;
			}

			return null;
		}
	}
}