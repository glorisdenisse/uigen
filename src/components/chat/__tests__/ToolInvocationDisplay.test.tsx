import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationDisplay } from "../ToolInvocationDisplay";

afterEach(() => {
  cleanup();
});

test("shows 'Created' label for str_replace_editor create command", () => {
  render(
    <ToolInvocationDisplay
      toolInvocation={{
        toolName: "str_replace_editor",
        args: { command: "create", path: "/components/Card.jsx" },
        state: "result",
        result: "Success",
      }}
    />
  );

  expect(screen.getByText("Created Card.jsx")).toBeDefined();
});

test("shows 'Edited' label for str_replace_editor str_replace command", () => {
  render(
    <ToolInvocationDisplay
      toolInvocation={{
        toolName: "str_replace_editor",
        args: { command: "str_replace", path: "/components/Button.tsx" },
        state: "result",
        result: "Success",
      }}
    />
  );

  expect(screen.getByText("Edited Button.tsx")).toBeDefined();
});

test("shows 'Edited' label for str_replace_editor insert command", () => {
  render(
    <ToolInvocationDisplay
      toolInvocation={{
        toolName: "str_replace_editor",
        args: { command: "insert", path: "/App.jsx" },
        state: "result",
        result: "Success",
      }}
    />
  );

  expect(screen.getByText("Edited App.jsx")).toBeDefined();
});

test("shows 'Viewing' label for str_replace_editor view command", () => {
  render(
    <ToolInvocationDisplay
      toolInvocation={{
        toolName: "str_replace_editor",
        args: { command: "view", path: "/utils/helpers.ts" },
        state: "result",
        result: "file contents",
      }}
    />
  );

  expect(screen.getByText("Viewing helpers.ts")).toBeDefined();
});

test("shows 'Deleted' label for file_manager delete command", () => {
  render(
    <ToolInvocationDisplay
      toolInvocation={{
        toolName: "file_manager",
        args: { command: "delete", path: "/old-file.jsx" },
        state: "result",
        result: { success: true },
      }}
    />
  );

  expect(screen.getByText("Deleted old-file.jsx")).toBeDefined();
});

test("shows 'Moved' label for file_manager rename command", () => {
  render(
    <ToolInvocationDisplay
      toolInvocation={{
        toolName: "file_manager",
        args: {
          command: "rename",
          path: "/old-name.tsx",
          new_path: "/components/NewName.tsx",
        },
        state: "result",
        result: { success: true },
      }}
    />
  );

  expect(screen.getByText(/Moved old-name.tsx/)).toBeDefined();
  expect(screen.getByText(/NewName.tsx/)).toBeDefined();
});

test("shows ellipsis when tool is still in progress", () => {
  render(
    <ToolInvocationDisplay
      toolInvocation={{
        toolName: "str_replace_editor",
        args: { command: "create", path: "/App.jsx" },
        state: "call",
      }}
    />
  );

  expect(screen.getByText("Created App.jsx...")).toBeDefined();
});

test("does not show ellipsis when tool is complete", () => {
  render(
    <ToolInvocationDisplay
      toolInvocation={{
        toolName: "str_replace_editor",
        args: { command: "create", path: "/App.jsx" },
        state: "result",
        result: "Success",
      }}
    />
  );

  expect(screen.getByText("Created App.jsx")).toBeDefined();
  expect(screen.queryByText("Created App.jsx...")).toBeNull();
});

test("falls back to tool name for unknown tools", () => {
  render(
    <ToolInvocationDisplay
      toolInvocation={{
        toolName: "unknown_tool",
        args: {},
        state: "result",
        result: "done",
      }}
    />
  );

  expect(screen.getByText("unknown_tool")).toBeDefined();
});

test("handles missing path gracefully", () => {
  render(
    <ToolInvocationDisplay
      toolInvocation={{
        toolName: "str_replace_editor",
        args: { command: "create" },
        state: "result",
        result: "Success",
      }}
    />
  );

  // Should not crash — shows "Created" with empty filename
  expect(screen.getByText(/Created/)).toBeDefined();
});
