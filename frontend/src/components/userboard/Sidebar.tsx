// components/userboard/Sidebar.tsx
import * as React from "react";
import { Link, useLocation } from "react-router-dom"; // Use react-router-dom Link and useLocation
import { ChevronRightIcon, PlusIcon, GearIcon, ExitIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  pastQueries: { id: string; name: string; href: string }[];
  onNewQuery: () => void;
}

export function Sidebar({ pastQueries, onNewQuery }: SidebarProps) {
  const [isOpen, setIsOpen] = React.useState(true);
  const location = useLocation(); // Hook to get current URL location

  // Determine current query ID from URL (e.g., /userboard?query=some-id)
  const currentQueryId = new URLSearchParams(location.search).get("query");

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="h-screen border-r bg-background flex flex-col transition-all duration-300 ease-in-out"
      style={{ width: isOpen ? "280px" : "60px" }}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {isOpen && <h1 className="text-lg font-semibold">Userboard</h1>}
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronRightIcon className={cn("h-4 w-4 transition-transform", !isOpen && "rotate-180")} />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </CollapsibleTrigger>
      </div>

      <div className="flex-1 overflow-hidden p-4 space-y-4">
        <Button
          className="w-full justify-start gap-2"
          variant="default"
          onClick={onNewQuery}
        >
          <PlusIcon className="h-4 w-4" />
          {isOpen && "New Query"}
        </Button>

        <div className="space-y-2">
          {isOpen && <h2 className="text-sm font-medium text-muted-foreground">Past Queries</h2>}
          <ScrollArea className="h-[calc(100vh-250px)] pr-2"> {/* Adjust height as needed */}
            <nav className="grid gap-1">
              {pastQueries.map((query) => (
                <Link key={query.id} to={query.href}>
                  <Button
                    variant={query.id === currentQueryId ? "secondary" : "ghost"}
                    className="w-full justify-start truncate"
                  >
                    {isOpen && query.name}
                  </Button>
                </Link>
              ))}
            </nav>
          </ScrollArea>
        </div>
      </div>

      <div className="mt-auto p-4 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <GearIcon className="h-4 w-4" />
              {isOpen && "User"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="end" className="w-48">
            <DropdownMenuItem onClick={() => console.log("User Settings Clicked")}>
              <GearIcon className="mr-2 h-4 w-4" />
              <span>User Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Logout Clicked")}>
              <ExitIcon className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Collapsible>
  );
}