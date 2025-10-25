import { Button } from "@/components/ui/button";
import { AppbarIcon1, AppbarIcon2, AppbarIcon3, AppbarIcon4 } from "./icons";

const sidebarItems = [
  { icon: AppbarIcon1 },
  { icon: AppbarIcon2 },
  { icon: AppbarIcon3 },
  { icon: AppbarIcon4 },
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
              <Icon className="size-5" />
            </Button>
          );
        })}
      </div>
    </aside>
  );
}
