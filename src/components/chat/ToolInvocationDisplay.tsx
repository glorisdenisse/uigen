import { Loader2, FilePlus, FileEdit, Eye, FileX, FolderInput } from "lucide-react";

interface ToolInvocation {
  toolName: string;
  args: Record<string, unknown>;
  state: string;
  result?: unknown;
}

interface ToolInvocationDisplayProps {
  toolInvocation: ToolInvocation;
}

function getFileName(path: string): string {
  return path.split("/").pop() || path;
}

function getToolDescription(toolInvocation: ToolInvocation): {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
} {
  const { toolName, args } = toolInvocation;
  const path = (args.path as string) || "";
  const fileName = getFileName(path);

  if (toolName === "str_replace_editor") {
    const command = args.command as string;
    switch (command) {
      case "create":
        return { label: `Created ${fileName}`, icon: FilePlus };
      case "str_replace":
        return { label: `Edited ${fileName}`, icon: FileEdit };
      case "insert":
        return { label: `Edited ${fileName}`, icon: FileEdit };
      case "view":
        return { label: `Viewing ${fileName}`, icon: Eye };
      default:
        return { label: `Modified ${fileName}`, icon: FileEdit };
    }
  }

  if (toolName === "file_manager") {
    const command = args.command as string;
    const newPath = args.new_path as string | undefined;
    switch (command) {
      case "rename":
        return {
          label: `Moved ${fileName} → ${newPath ? getFileName(newPath) : ""}`,
          icon: FolderInput,
        };
      case "delete":
        return { label: `Deleted ${fileName}`, icon: FileX };
      default:
        return { label: `Modified ${fileName}`, icon: FileEdit };
    }
  }

  return { label: toolName, icon: FileEdit };
}

export function ToolInvocationDisplay({ toolInvocation }: ToolInvocationDisplayProps) {
  const isComplete = toolInvocation.state === "result" && toolInvocation.result;
  const { label, icon: Icon } = getToolDescription(toolInvocation);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200">
      {isComplete ? (
        <>
          <Icon className="w-3 h-3 text-emerald-600" />
          <span className="text-neutral-700">{label}</span>
        </>
      ) : (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
          <span className="text-neutral-700">{label}...</span>
        </>
      )}
    </div>
  );
}
