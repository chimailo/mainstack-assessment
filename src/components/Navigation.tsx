import { Button } from "@/components/ui/button";
import { cn, getInitials } from "@/lib/utils";
import { useFetchUser } from "@/hooks/use-fetch-user";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import {
  ChatIcon,
  GroupIcon,
  HomeIcon,
  InsertChartIcon,
  NotificationsIcon,
  PaymentsIcon,
  WidgetsIcon,
} from "@/components/icons";
import mainstackLogo from "../images/mainstack-logo.png?inline";

const navItems = [
  { label: "Home", icon: HomeIcon, path: "/" },
  { label: "Analytics", icon: InsertChartIcon, path: "/analytics" },
  { label: "Revenue", icon: PaymentsIcon, path: "/revenue", active: true },
  { label: "CRM", icon: GroupIcon, path: "/crm" },
  { label: "Apps", icon: WidgetsIcon, path: "/apps" },
];

export function Navigation() {
  const { data: user, isLoading } = useFetchUser();

  return (
    <ErrorBoundary onReset={() => window.location.reload()}>
      <header className="shadow rounded-full bg-background">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">
                <img
                  src={mainstackLogo}
                  alt="Mainstack Logo"
                  width={36}
                  height={36}
                />
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.path}
                    variant={item.active ? "default" : "ghost"}
                    className={cn("gap-2", item.active && "rounded-full")}
                  >
                    <Icon size={20} />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-full">
              <NotificationsIcon size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChatIcon size={20} />
            </Button>
            <div className="h-10 rounded-full bg-secondary flex items-center justify-center gap-2 p-2">
              <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                {!isLoading && user ? getInitials(user) : ""}
              </span>
              <svg
                className="size-6"
                fill="none"
                strokeWidth="2"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
          </div>
        </div>
      </header>
    </ErrorBoundary>
  );
}
