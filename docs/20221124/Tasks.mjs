/*
(c) 2022 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import * as Types from "https://scotwatson.github.io/Debug/20221107/Types.mjs";
import * as ErrorLog from "https://scotwatson.github.io/Debug/20221107/ErrorLog.mjs";

export function queueTask(taskFunction, args) {
  try {
    let task;
    let taskArgs;
    if (Types.isInvocable(args)) {
      task = args;
    } else if (Types.isSimpleObject(args)) {
      if (!(Object.hasOwn(args, "task"))) {
        throw "Argument \"task\" is required.";
      }
      if (!(Types.isInvocable(args.task))) {
        throw "Argument \"task\" must be invocable.";
      }
      task = args.task;
      if (Object.hasOwn(args, "args")) {
        taskArgs = args.args;
      }
    } else {
      throw "Invalid Argument";
    }
    function taskCallback() {
      try {
        task(taskArgs);
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
    let task;
    let taskArgs;
    if (Types.isInvocable(args)) {
      task = args;
    } else if (Types.isSimpleObject(args)) {
      if (!(Object.hasOwn(args, "task"))) {
        throw "Argument \"task\" is required.";
      }
      if (!(Types.isInvocable(args.task))) {
        throw "Argument \"task\" must be invocable.";
      }
      task = args.task;
      if (Object.hasOwn(args, "args")) {
        taskArgs = args.args;
      }
    } else {
      throw "Invalid Argument";
    }
    function taskCallback() {
      try {
        task(taskArgs);
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
  #listeners;
  constructor(args) {
    this.#listeners = new Set();
    args.dispatch = this.#dispatch.bind(this);
  }
  add(args) {
    this.#listeners.add(args);
  }
  remove(args) {
    this.#listeners.delete(args);
  }
  #dispatch(args) {
    for (const listener of this.#listeners) {
      queueTask({
        task: listener,
        args: args
      });
    }
  }
}

export class Controller {
  #dispatch;
  constructor(args) {
    const signalArgs = {};
    let signal = new Signal(signalArgs);
    this.#dispatch = args.dispatch;
  }
  fire(args) {
    this.#dispatch(args);
  }
}
