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
		public static pool: Pool;

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
			if(!Handler.pool) Handler.pool = new Pool();
		}

		dispose() {
			this._caller = null;
			this._method = null;
			this._args = null;
		}

		private static riggerHandlerSign: string = "_riggerHandlerSign";
		public static create(caller: any, fun: Function, args: any[] = null, once: boolean = true): Handler {
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
		 * 将自身回收至对象池
		 */
		public recover() {
			Handler.recover(this);
		}

		public once(){
			this._ifOnce = true;
		}

		/**
		 * 无参执行
		 */
		public run(): any {
			if (this._method) {
				let ret: any = this._method.apply(this._caller, this._args);
				if (this._ifOnce) this.dispose();
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
				if (args) {
					ret = this._method.apply(this._caller, args.concat(this._args));
				}
				else {
					ret = this._method.apply(this._caller, this._args);
				}
				if (this._ifOnce) this.dispose();
				return ret;
			}

			return null;
		}
	}
}