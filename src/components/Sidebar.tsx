import { Link2, FileText, Briefcase, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { icon: Link2 },
  { icon: FileText },
  { icon: Briefcase },
  { icon: Lock },
];

export function Sidebar() {
  return (
    <aside className="fixed left-4 top-1/2 -translate-y-1/2 z-50">
      <div className="flex flex-col items-center gap-2 rounded-full bg-card shadow border">
        {sidebarItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <Icon className="size-6" />
            </Button>
          );
        })}
      </div>
    </aside>
  );
}
