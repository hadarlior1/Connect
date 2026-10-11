import "@testing-library/jest-dom/vitest";

// The app keeps the current step in the address (#/5.3): start every test from a clean URL.
beforeEach(() => {
  window.history.replaceState(null, "", "/");
});
