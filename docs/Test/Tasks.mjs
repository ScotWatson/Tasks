/*
(c) 2022 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import * as Types from "https://scotwatson.github.io/Debug/Test/Types.mjs";
import * as ErrorLog from "https://scotwatson.github.io/Debug/Test/ErrorLog.mjs";

export function createStatic(args) {
  try {
    const { thisFunction, thisThis } = (function () {
      let ret = {};
      if (Types.isInvocable(args)) {
        ret.thisFunction = args;
        ret.thisThis = null;
      } else if (Types.isSimpleObject(args)) {
        ret.thisFunction = args.function;
        ret.thisThis = args.this;
      } else {
        throw "Invalid Arguments";
      }
      return ret;
    })();
    return (function (...args) {
      return thisFunction.call(thisThis, ...args);
    });
  } catch (e) {
    ErrorLog.rethrow({
      functionName: "createStatic",
      error: e,
    });
  }
}

export class Callback {
  #function;
  constructor(args) {
    try {
      this.#function = null;
      this.#replace(args);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Callback constructor",
        error: e,
      });
    }
  }
  invoke(...args) {
    try {
      if (Types.isNull(this.#function)) {
        throw "This callback has been revoked.";
      }
      return this.#function(...args);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Callback.invoke",
        error: e,
      });
    }
  }
  isRevoked() {
    return (this.#function === null);
  }
  createClone() {
    try {
      return new Callback(this.#function);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Callback.createClone",
        error: e,
      });
    }
  }
  #replace(args) {
    try {
      if (Types.isInvocable(args)) {
        this.#function = args;
      } else if (Types.isSimpleObject(args)) {
        if (!(Object.hasOwn(args, "function"))) {
          return;
        }
        if (Types.isInvocable(args.function)) {
          this.#function = args.function;
        }
      } else if (Types.isNull(args)) {
        this.#function = null;
      } else {
        throw "Invalid Arguments";
      }
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Callback.replace",
        error: e,
      });
    }
  }
}

export class CallbackController {
  #callback;
  #replace;
  constructor(args) {
    try {
      const callbackArgs = {};
      callbackArgs.function = args.function;
      this.#callback = new Callback(callbackArgs);
      this.#replace = callbackArgs.replace;
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "CallbackController constructor",
        error: e,
      });
    }
  }
  get callback() {
    try {
      return this.#callback;
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get CallbackController.callback",
        error: e,
      });
    }
  }
  replace(args) {
    try {
      this.#replace(args);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "CallbackController.replace",
        error: e,
      });
    }
  }
}

export class UniqueCallbackController {
  #callback;
  #replace;
  constructor(args) {
    try {
      const callbackArgs = {};
      callbackArgs.function = args.function;
      this.#callback = new Callback(callbackArgs);
      this.#replace = callbackArgs.replace;
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "UniqueCallbackController constructor",
        error: e,
      });
    }
  }
  get callback() {
    try {
      const newCallback = this.#callback.createClone();
      this.#callback.replace(null);
      this.#callback = newCallback;
      return this.#callback;
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get UniqueCallbackController.callback",
        error: e,
      });
    }
  }
  replace(args) {
    try {
      this.#replace(args);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "UniqueCallbackController.replace",
        error: e,
      });
    }
  }
};

export class ByteCallback {
  #functionAllocate; // accepts byteLength (integer), return Memory.View
  // Allocate a buffer of length byteLength.
  // Only the last returned buffer is valid; all othee buffers are invalidated.
  #functionInvoke; // accepts byteLength (integer), return value ignored
  // Use byteLength bytes of the last allocated buffer as input.
  // The last allocation is no longer valid after return.
  constructor(args) {
    try {
      this.#functionAllocate = null;
      this.#functionInvoke = null;
      this.#replace(args);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "ByteCallback constructor",
        error: e,
      });
    }
  }
  allocate(byteLength) {
    try {
      if (Types.isNull(this.#functionAllocate)) {
        throw "This callback has been revoked.";
      }
      const byteLength = (function () {
        if (Types.isInteger(args)) {
          return args;
        } else if (Types.isSimpleObject(args)) {
          if (!(Types.isInteger(args.byteLength))) {
            throw "Argument \"byteLength\" must be an integer.";
          }
        } else {
          throw "Invalid Arguments";
        }
      })();
      return this.#functionAllocate(byteLength);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "ByteCallback.allocate",
        error: e,
      });
    }
  }
  invoke(args) {
    try {
      if (Types.isNull(this.#functionInvoke)) {
        throw "This callback has been revoked.";
      }
      const byteLength = (function () {
        if (Types.isInteger(args)) {
          return args;
        } else if (Types.isSimpleObject(args)) {
          if (!(Types.isInteger(args.byteLength))) {
            throw "Argument \"byteLength\" must be an integer.";
          }
        } else {
          throw "Invalid Arguments";
        }
      })();
      return this.#functionInvoke(byteLength);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "ByteCallback.invoke",
        error: e,
      });
    }
  }
  isRevoked() {
    return ((this.#functionAllocate === null) || (this.#functionInvoke === null));
  }
  isRevoked() {
    return ((this.#functionAllocate === null) || (this.#functionInvoke === null));
  }
  #replace(args) {
    try {
      if (Types.isNull(args)) {
        this.#functionAllocate = null;
        this.#functionInvoke = null;
      } else if (!(Types.isSimpleObject(args))) {
        if (!(Object.hasOwn(args, "functionAllocate"))) {
          return;
        }
        if (Types.isInvocable(args.functionAllocate)) {
          this.#functionAllocate = args.functionAllocate;
        }
        if (!(Object.hasOwn(args, "functionInvoke"))) {
          return;
        }
        if (Types.isInvocable(args.functionInvoke)) {
          this.#functionInvoke = args.functionInvoke;
        }
      } else {
        throw "Invalid Arguments";
      }
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "ByteCallback.replace",
        error: e,
      });
    }
  }
}

export class ByteCallbackController {
  #callback;
  #replace;
  constructor(args) {
    try {
      const callbackArgs = {};
      callbackArgs.function = args.function;
      this.#callback = new ByteCallback(callbackArgs);
      this.#replace = callbackArgs.replace;
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "ByteCallbackController constructor",
        error: e,
      });
    }
  }
  get callback() {
    try {
      return this.#callback;
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get ByteCallbackController.callback",
        error: e,
      });
    }
  }
  replace(args) {
    try {
      this.#replace(args);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "ByteCallbackController.replace",
        error: e,
      });
    }
  }
}

export class UniqueByteCallbackController {
  #callback;
  #replace;
  constructor(args) {
    try {
      const callbackArgs = {};
      callbackArgs.function = args.function;
      this.#callback = new ByteCallback(callbackArgs);
      this.#replace = callbackArgs.replace;
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "UniqueByteCallbackController constructor",
        error: e,
      });
    }
  }
  get callback() {
    try {
      const newCallback = this.#callback.createClone();
      this.#callback.replace(null);
      this.#callback = newCallback;
      return this.#callback;
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get UniqueByteCallbackController.callback",
        error: e,
      });
    }
  }
  replace(args) {
    try {
      this.#replace(args);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "UniqueByteCallbackController.replace",
        error: e,
      });
    }
  }
};

export function queueTask(args) {
  try {
    function isCallback(callback) {
      if ("invoke" in args.callback) {
        throw "Argument \"callback\" must have an \"invoke\" function.";
      }
      if (!(Types.isInvocable(args.callback.invoke))) {
        throw "\"callback.invoke\" must be invocable."
      }
    }
    const { task, taskArgs } = (function () {
      let ret = {};
      if (args) {
        isCallback(args);
        task = args;
      } else if (Types.isSimpleObject(args)) {
        if (!(Object.hasOwn(args, "callback"))) {
          throw "Argument \"callback\" is required.";
        }
        isCallback(args.callback);
        task = args.callback;
        if (Object.hasOwn(args, "args")) {
          taskArgs = args.args;
        }
      } else {
        throw "Invalid Argument";
      }
      return ret;
    })();
    function taskCallback() {
      try {
        task.invoke(taskArgs);
      } catch (e) {
        ErrorLog.topLevel({
          functionName: "queueTask callback",
          error: e,
        });
      }
    }
    // Note: some browsers sometimes treat this as a 4ms delay.
    self.setTimeout(taskCallback, 0);
  } catch (e) {
    ErrorLog.rethrow({
      functionName: "queueTask",
      error: e,
    });
  }
}

export function queueMicrotask(args) {
  try {
    function isCallback(callback) {
      if ("invoke" in args.callback) {
        throw "Argument \"callback\" must have an \"invoke\" function.";
      }
      if (!(Types.isInvocable(args.callback.invoke))) {
        throw "\"callback.invoke\" must be invocable."
      }
    }
    const { task, taskArgs } = (function () {
      let ret = {};
      if (args) {
        isCallback(args);
        task = args;
      } else if (Types.isSimpleObject(args)) {
        if (!(Object.hasOwn(args, "callback"))) {
          throw "Argument \"callback\" is required.";
        }
        isCallback(args.callback);
        task = args.callback;
        if (Object.hasOwn(args, "args")) {
          taskArgs = args.args;
        }
      } else {
        throw "Invalid Argument";
      }
      return ret;
    })();
    function taskCallback() {
      try {
        task.invoke(taskArgs);
      } catch (e) {
        ErrorLog.topLevel({
          functionName: "queueMicrotask callback",
          error: e,
        });
      }
    }
    self.queueMicrotask(taskCallback);
  } catch (e) {
    ErrorLog.rethrow({
      functionName: "queueMicrotask",
      error: e,
    });
  }
}

export class Signal {
  #callbackSet;
  constructor(args) {
    try {
      this.#callbackSet = new Set();
      args.dispatch = createStatic({
        function: this.#dispatch,
        this: this,
      });
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Signal constructor",
        error: e,
      });
    }
  }
  add(args) {
    try {
      function isCallback(callback) {
        if (!("invoke" in callback)) {
          return false;
        }
        if (!(Types.isInvocable(callback.invoke))) {
          return false;
        }
        if (!("isRevoked" in callback)) {
          return false;
        }
        if (!(Types.isInvocable(callback.isRevoked))) {
          return false;
        }
      }
      const callback = (function () {
        if (isCallback(args)) {
          return args;
        } else if (Types.isSimpleObject(args)) {
          if (!(isCallback(args.callback))) {
            throw "Argument \"callback\" must be a Callback.";
          }
          return args.callback;
        } else {
          throw "Invalid Argument";
        }
      })();
      this.#callbackSet.add(callback);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Signal.add",
        error: e,
      });
    }
  }
  removeAllRevoked() {
    try {
      const newCallbackSet = new Set();
      for (const callback of this.#callbackSet) {
        if (!(callback.isRevoked())) {
          newCallbackSet.add(callback);
        }
      }
      this.#callbackSet = newCallbackSet;
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Signal.removeAllRevoked",
        error: e,
      });
    }
  }
  #dispatch() {
    try {
      for (const callback of this.#callbackSet) {
        queueTask({
          callback: callback,
        });
      }
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Signal.dispatch",
        error: e,
      });
    }
  }
}

export class SignalController {
  #dispatch;
  constructor(args) {
    const signalArgs = {};
    let signal = new Signal(signalArgs);
    this.#dispatch = signalArgs.dispatch;
  }
  dispatch() {
    this.#dispatch();
  }
}
