// MOCK API - clearly labeled, implementing the documented contract above.

let TASKS = [
  { id: 1, title: 'Design the dashboard layout', completed: false },
  { id: 2, title: 'Write API documentation', completed: true },
  { id: 3, title: 'Set up CI pipeline', completed: false },
  { id: 4, title: 'Review pull requests', completed: false },
  { id: 5, title: 'Update dependencies', completed: true },
];
const INITIAL_TASKS = TASKS.map((t) => ({ ...t })); // deep-enough snapshot for a flat object array

// Test-only reset - necessary because TASKS is module-level mutable state (Snippet 20's
// exact "modules are cached, only initialized once" lesson) that would otherwise leak
// real mutations between tests in the same file, exactly as it did here.
export function resetTasksForTesting() {
  TASKS = INITIAL_TASKS.map((t) => ({ ...t }));
}

const PAGE_SIZE = 3;

// Test hook: lets tests force the next PATCH to fail, to verify rollback behavior.
let forceNextPatchToFail = false;
export function setForceNextPatchToFail(value) {
  forceNextPatchToFail = value;
}

export function getTasks(search = '', page = 1, delayMs = 150) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const matches = TASKS.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));
      const totalPages = Math.max(1, Math.ceil(matches.length / PAGE_SIZE));
      const start = (page - 1) * PAGE_SIZE;
      resolve({ tasks: matches.slice(start, start + PAGE_SIZE), page, totalPages });
    }, delayMs);
  });
}

export function getTaskById(id, delayMs = 150) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const task = TASKS.find((t) => t.id === Number(id));
      if (task) resolve(task);
      else reject(new Error('Task not found'));
    }, delayMs);
  });
}

export function patchTask(id, updates, delayMs = 150) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (forceNextPatchToFail) {
        forceNextPatchToFail = false;
        reject(new Error('Server error - could not save changes'));
        return;
      }
      TASKS = TASKS.map((t) => (t.id === Number(id) ? { ...t, ...updates } : t));
      resolve(TASKS.find((t) => t.id === Number(id)));
    }, delayMs);
  });
}
