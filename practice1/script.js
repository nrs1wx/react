function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createTask(name) {
  let count = 0;
  let status = "idle";
  let lastTime = null;

  function run() {
    count++;
    status = "running";
    const delay = randomBetween(500, 2000);
    const start = performance.now();

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        lastTime = Math.round(performance.now() - start);
        if (Math.random() < 0.3) {
          status = "failed";
          reject(new Error(name + " failed"));
        } else {
          status = "completed";
          resolve(name + " completed");
        }
      }, delay);
    });
  }

  function getCount() { return count; }
  function getStatus() { return status; }
  function getTime() { return lastTime; }

  function reset() {
    count = 0;
    status = "idle";
    lastTime = null;
  }

  return { name, run, getCount, getStatus, getTime, reset };
}

const tasks = [
  createTask("Load Users"),
  createTask("Load Posts"),
  createTask("Load Comments"),
];

const tasksDiv = document.getElementById("tasks");
const runAllBtn = document.getElementById("runAllBtn");
const allStatus = document.getElementById("allStatus");
const compareBtn = document.getElementById("compareBtn");
const compareResult = document.getElementById("compareResult");
const eventLoopBtn = document.getElementById("eventLoopBtn");

function statusText(status) {
  if (status === "completed") return "Completed";
  if (status === "failed") return "Failed";
  if (status === "running") return "Running...";
  return "Idle";
}

function render() {
  tasksDiv.innerHTML = "";
  tasks.forEach((task, index) => {
    const time = task.getTime() === null ? "-" : task.getTime() + " ms";
    const div = document.createElement("div");
    div.className = "task " + task.getStatus();
    div.innerHTML = `
      <div>
        <strong>${task.name}</strong>
        <span class="status">${statusText(task.getStatus())}</span>
        <div class="info">Runs: ${task.getCount()} | Time: ${time}</div>
      </div>
      <div>
        <button data-run="${index}">Run</button>
        <button data-reset="${index}" class="secondary">Reset</button>
      </div>`;
    tasksDiv.appendChild(div);
  });
}

async function safeRun(task) {
  const promise = task.run();
  render();
  try {
    await promise;
  } catch (error) {
  }
  render();
}

tasksDiv.addEventListener("click", (event) => {
  const runIndex = event.target.dataset.run;
  const resetIndex = event.target.dataset.reset;
  if (runIndex !== undefined) safeRun(tasks[runIndex]);
  if (resetIndex !== undefined) { tasks[resetIndex].reset(); render(); }
});

runAllBtn.addEventListener("click", async () => {
  runAllBtn.disabled = true;
  allStatus.textContent = "Running all tasks...";
  await Promise.allSettled(tasks.map((task) => safeRun(task)));
  allStatus.textContent = "All tasks finished";
  runAllBtn.disabled = false;
});

compareBtn.addEventListener("click", async () => {
  compareBtn.disabled = true;
  compareResult.textContent = "Running sequentially...";

  let start = performance.now();
  for (const task of tasks) {
    await safeRun(task);
  }
  const sequentialTime = Math.round(performance.now() - start);

  compareResult.textContent = "Running concurrently...";

  start = performance.now();
  await Promise.allSettled(tasks.map((task) => safeRun(task)));
  const concurrentTime = Math.round(performance.now() - start);

  compareResult.innerHTML = `
    Sequential: <strong>${sequentialTime} ms</strong><br>
    Concurrent: <strong>${concurrentTime} ms</strong><br>
    Sequential time is about the SUM of all task times (each task waits for the previous one).
    Concurrent time is about the LONGEST task (all timers run at the same time).
    Random delays are different in each run, so numbers are not exactly equal.`;
  compareBtn.disabled = false;
});

const expectedOrder = [
  "Script start",
  "Async function start",
  "Script end",
  "Promise 1",
  "Async function after await",
  "Promise 2",
  "Timer 1",
  "Promise inside Timer 1",
  "Timer 2",
];

function runEventLoopDemo() {
  const actual = [];
  function log(text) {
    console.log(text);
    actual.push(text);
  }

  async function myAsync() {
    log("Async function start");
    await Promise.resolve();
    log("Async function after await");
  }

  log("Script start");

  setTimeout(() => {
    log("Timer 1");
    Promise.resolve().then(() => log("Promise inside Timer 1"));
  }, 0);

  setTimeout(() => log("Timer 2"), 10);

  Promise.resolve()
    .then(() => log("Promise 1"))
    .then(() => log("Promise 2"));

  myAsync();

  log("Script end");

  setTimeout(() => showEventLoopResult(actual), 100);
}

function fillList(id, items) {
  const ol = document.getElementById(id);
  ol.innerHTML = "";
  items.forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    ol.appendChild(li);
  });
}

function showEventLoopResult(actual) {
  fillList("expected", expectedOrder);
  fillList("actual", actual);
  const same = JSON.stringify(expectedOrder) === JSON.stringify(actual);
  document.getElementById("eventLoopResult").textContent = same
    ? "My prediction is correct."
    : "My prediction is different from the actual output.";
}

eventLoopBtn.addEventListener("click", runEventLoopDemo);

render();
fillList("expected", expectedOrder);