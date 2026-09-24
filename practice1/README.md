# JavaScript Runtime and Async

Small project with HTML, CSS and vanilla JavaScript. It has three tasks
(Load Users, Load Posts, Load Comments), a sequential vs concurrent
comparison, and an Event Loop demo. Open `index.html` in a browser to run it.

## 1. How the closure keeps the counter private

`createTask(name)` is a function. Inside it I create `let count = 0`.
The returned object has methods (`run`, `getCount`, `reset`) that use `count`.
When `createTask` finishes, `count` stays alive because these methods remember it (closure).
Code outside cannot write `task.count`, it can only use `getCount()`.
Every call of `createTask` makes a new `count`, so each task has its own counter.

## 2. Call stack example

When I click "Run All Tasks":

1. `runAllBtn` click handler is pushed to the stack.
2. It calls `tasks.map(...)`, then `safeRun(task)`, then `task.run()`.
3. `task.run()` creates a Promise and calls `setTimeout(...)`. `setTimeout` gives the timer to the browser and returns at once.
4. Functions finish one by one and are popped from the stack. The stack is empty.

The stack works as LIFO (last in, first out): the last called function must finish first.

## 3. How JavaScript continues while setTimeout is waiting

JavaScript has one call stack, but timers are handled by the browser (Web APIs), not by the stack.
`setTimeout` only registers the timer. The stack becomes free and JavaScript can run other code.
When the time is over, the callback goes to the Task Queue, and the Event Loop moves it to the
stack when the stack is empty. That is why three tasks can "wait" at the same time.

## 4. Predicted and actual Event Loop output

Prediction (written before running) and actual output are the same:

```
Script start
Async function start
Script end
Promise 1
Async function after await
Promise 2
Timer 1
Promise inside Timer 1
Timer 2
```

Explanation:

- **Call Stack:** synchronous code runs first: `Script start`, `Async function start`
  (an async function runs synchronously until the first `await`), `Script end`.
  Timers are registered, promise callbacks are put into the queue.
- **Microtask Queue:** when the stack is empty, all microtasks run: `Promise 1`, then the
  code after `await`, then `Promise 2` (it was added after `Promise 1` finished).
- **Task Queue + Event Loop:** then the Event Loop takes one task: `Timer 1`. After this task, microtasks run
  again, so `Promise inside Timer 1` runs before `Timer 2`.

## 5. Tasks and microtasks

- **Task (macrotask):** `setTimeout`, click events. They wait in the Task Queue. The Event Loop takes one task at a time.
- **Microtask:** `.then()`, `await`. They wait in the Microtask Queue.
- After each task and when the stack is empty, JavaScript runs ALL microtasks before the next task.
  So microtasks have higher priority than tasks, even `setTimeout(..., 0)`.

## 6. Multiple Promises and errors

- Each task returns a Promise. It resolves when completed and rejects when failed.
- `Promise.allSettled(...)` is used for "Run All": it waits for all tasks, both completed and failed, so
  "All tasks finished" is shown only at the end. (`Promise.all` would stop at the first error.)
- Errors are handled with `try/catch` inside `safeRun`, so one failed task does not stop the others.

## 7. Sequential vs concurrent

- **Sequential:** `await task1.run(); await task2.run(); await task3.run();` Each task waits for the previous one.
  Total time is about the sum of all times (for example 1000 + 1500 + 800 = 3300 ms).
- **Concurrent:** `Promise.allSettled([task1.run(), task2.run(), task3.run()])`. All timers start together.
  Total time is about the longest task (1500 ms).
- The results are different because in sequential mode the waiting times are added, and in concurrent mode they overlap.
