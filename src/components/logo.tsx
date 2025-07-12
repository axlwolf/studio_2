import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-8 w-8 text-primary"
      >
        <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        <path d="M4 12v-1a2 2 0 0 1 2-2h1" />
        <path d="M4 18v-1a2 2 0 0 1 2-2h1" />
        <path d="M4 15h2" />
        <path d="M9 12h1" />
        <path d="M9 18h1" />
      </svg>
      <span className="text-xl font-bold font-headline">NEM Planner Pro</span>
    </div>
  );
}
