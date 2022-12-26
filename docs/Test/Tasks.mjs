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

const symReplace = Symbol("replace");

export class Callback {
  #invoke;
  constructor(args) {
    try {
      this.#invoke = null;
      this[symReplace](args);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Callback constructor",
        error: e,
      });
    }
  }
  invoke(...args) {
    try {
      if (Types.isNull(this.#invoke)) {
        throw "This callback has been revoked.";
      }
      return this.#invoke(...args);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Callback.invoke",
        error: e,
      });
    }
  }
  isRevoked() {
    return (this.#invoke === null);
  }
  // This is provided to allow the callback controller to replace the invoke function
  // No exception handling is provided on this function so all errors appear to originate in the calling function.
  [symReplace](args) {
    if (Types.isInvocable(args)) {
      this.#invoke = args;
    } else if (Types.isSimpleObject(args)) {
      if (!(Object.hasOwn(args, "invoke"))) {
        return;
      }
      if (Types.isInvocable(args.invoke)) {
        this.#invoke = args.invoke;
      }
    } else if (Types.isNull(args)) {
      this.#invoke = null;
    } else {
      throw "Invalid Arguments";
    }
  }
}

export class CallbackController {
  #callback;
  constructor(args) {
    try {
      this.#callback = new Callback({
        invoke: args.invoke,
      });
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
      this.#callback[symReplace](args);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "CallbackController.replace",
        error: e,
      });
    }
  }
}

export class UniqueCallbackController {
  #invoke;
  #callback;
  constructor(args) {
    try {
      this.#invoke = args.invoke;
      this.#callback = new Callback(null);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "UniqueCallbackController constructor",
        error: e,
      });
    }
  }
  get callback() {
    try {
      const newCallback = new Callback({
        invoke: this.#invoke,
      });
      this.#callback[symReplace](null);
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
      if (Types.isInvocable(args)) {
        this.#invoke = args;
      } else if (Types.isSimpleObject(args)) {
        if (!(Object.hasOwn(args, "invoke"))) {
          return;
        }
        if (Types.isInvocable(args.invoke)) {
          this.#invoke = args.invoke;
        }
      } else if (Types.isNull(args)) {
        this.#invoke = null;
      } else {
        throw "Invalid Arguments";
      }
      this.#callback[symReplace](this.#invoke);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "UniqueCallbackController.replace",
        error: e,
      });
    }
  }
};

export class ByteCallback {
  #allocate;
  #invoke;
  constructor(args) {
    try {
      this.#allocate = null;
      this.#invoke = null;
      this[symReplace](args);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "ByteCallback constructor",
        error: e,
      });
    }
  }
  allocate(args) {
    try {
      if (Types.isNull(this.#allocate)) {
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
      return this.#allocate(byteLength);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "ByteCallback.allocate",
        error: e,
      });
    }
  }
  invoke(args) {
    try {
      if (Types.isNull(this.#invoke)) {
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
      return this.#invoke(byteLength);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "ByteCallback.invoke",
        error: e,
      });
    }
  }
  isRevoked() {
    return ((this.#allocate === null) || (this.#invoke === null));
  }
  // This is provided to allow the byte callback controller to replace the allocate and invoke functions
  // No exception handling is provided on this function so all errors appear to originate in the calling function.
  [symReplace](args) {
    if (Types.isNull(args)) {
      this.#allocate = null;
      this.#invoke = null;
    } else if (!(Types.isSimpleObject(args))) {
      if (!(Object.hasOwn(args, "allocate"))) {
        throw "Argument \"allocate\" must be provided.";
      }
      if (Types.isInvocable(args.allocate)) {
        this.#allocate = args.allocate;
      } else {
        this.#allocate = null;
      }
      if (!(Object.hasOwn(args, "invoke"))) {
        throw "Argument \"invoke\" must be provided.";
      }
      if (Types.isInvocable(args.invoke)) {
        this.#invoke = args.invoke;
      } else {
        this.#invoke = null;
      }
    } else {
      throw "Invalid Arguments";
    }
  }
}

export class ByteCallbackController {
  #callback;
  constructor(args) {
    try {
      this.#callback = new ByteCallback({
        allocate: args.allocate,
        invoke: args.invoke,
      });
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
      this.#callback[symReplace](args);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "ByteCallbackController.replace",
        error: e,
      });
    }
  }
}

export class UniqueByteCallbackController {
  #allocate;
  #invoke;
  #callback;
  constructor(args) {
    try {
      this.#allocate = args.allocate;
      this.#invoke = args.invoke;
      this.#callback = new ByteCallback(null);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "UniqueByteCallbackController constructor",
        error: e,
      });
    }
  }
  get callback() {
    try {
      const newCallback = new ByteCallback({
        allocate: this.#allocate,
        invoke: this.#invoke,
      });
      this.#callback[symReplace](null);
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
      if (Types.isNull(args)) {
        this.#allocate = null;
        this.#invoke = null;
      } else if (!(Types.isSimpleObject(args))) {
        if (!(Object.hasOwn(args, "allocate"))) {
          throw "Argument \"allocate\" must be provided.";
        }
        if (Types.isInvocable(args.allocate)) {
          this.#allocate = args.allocate;
        } else {
          this.#allocate = null;
        }
        if (!(Object.hasOwn(args, "invoke"))) {
          throw "Argument \"invoke\" must be provided.";
        }
        if (Types.isInvocable(args.invoke)) {
          this.#invoke = args.invoke;
        } else {
          this.#invoke = null;
        }
      } else {
        throw "Invalid Arguments";
      }
      this.#callback[symReplace]({
        allocate: this.#allocate,
        invoke: this.#invoke,
      });
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
      if (!(Types.isObject(callback))) {
        throw "Argument \"callback\" must be an object.";
      }
      if (!("invoke" in callback)) {
        throw "Argument \"callback\" must have an \"invoke\" function.";
      }
      if (!(Types.isInvocable(callback.invoke))) {
        throw "\"callback.invoke\" must be invocable."
      }
    }
    const { task, taskArgs } = (function () {
      let ret = {};
      if (Types.isSimpleObject(args)) {
        if (!(Object.hasOwn(args, "callback"))) {
          throw "Argument \"callback\" is required.";
        }
        isCallback(args.callback);
        ret.task = args.callback;
        if (Object.hasOwn(args, "args")) {
          ret.taskArgs = args.args;
        }
      } else {
        isCallback(args);
        ret.task = args;
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

const symDispatch = Symbol("dispatch");

export class Signal {
  #callbackSet;
  constructor(args) {
    try {
      this.#callbackSet = new Set();
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
        return true;
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
  [symDispatch]() {
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
  #signal;
  constructor(args) {
    this.#signal = new Signal({});
  }
  get signal() {
    return this.#signal;
  }
  dispatch() {
    this.#signal[symDispatch]();
  }
}
