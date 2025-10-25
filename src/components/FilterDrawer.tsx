import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, filterFalsyValues } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { SelectDropdown } from "./SelectDropdown";
import { useNavigate } from "react-router";
import { useSetFilters } from "@/hooks/use-search-param";

interface FilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const quickFilters = ["Today", "Last 7 days", "This month", "Last 3 months"];

export function FilterDrawer({ open, onOpenChange }: FilterDrawerProps) {
  const { getFilters, setFilters } = useSetFilters();

  const { appliedFilters } = getFilters();
  const start_date = appliedFilters.startDate
    ? new Date(appliedFilters.startDate)
    : undefined;
  const end_date = appliedFilters.endDate
    ? new Date(appliedFilters.endDate)
    : undefined;
  const transactionTypes = appliedFilters.type
    ? appliedFilters.type.split(",")
    : [];
  const transactionStatus = appliedFilters.status
    ? appliedFilters.status.split(",")
    : [];

  const [selectedQuickFilter, setSelectedQuickFilter] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>(start_date);
  const [endDate, setEndDate] = useState<Date | undefined>(end_date);
  const [selectedTransactionTypes, setSelectedTransactionTypes] =
    useState<string[]>(transactionTypes);
  const [selectedTransactionStatus, setSelectedTransactionStatus] =
    useState<string[]>(transactionStatus);

  const handleQuickFilterSelect = (filter: string) => {
    setSelectedQuickFilter(filter);
    if (filter === "Today") {
      const today = new Date();
      setStartDate(today);
      setEndDate(today);
    } else if (filter === "Last 7 days") {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 7);
      setStartDate(start);
      setEndDate(end);
    } else if (filter === "This month") {
      const end = new Date();
      const start = new Date(end.getFullYear(), end.getMonth(), 1);
      setStartDate(start);
      setEndDate(end);
    } else if (filter === "Last 3 months") {
      const end = new Date();
      const start = new Date(
        end.getFullYear(),
        end.getMonth() - 3,
        end.getDate()
      );
      setStartDate(start);
      setEndDate(end);
    }
  };

  const handleClear = () => {
    setFilters({ type: null, status: null, startDate: null, endDate: null });
    setSelectedQuickFilter("");
  };

  const handleApply = () => {
    const filters = {
      type: selectedTransactionTypes.join(",") || "",
      status: selectedTransactionStatus.join(",") || "",
      startDate: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
      endDate: endDate ? format(endDate, "yyyy-MM-dd") : undefined,
    };
    setFilters(filters);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-bold">Filter</SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Quick Filters */}
          <div className="flex gap-2">
            {quickFilters.map((filter) => (
              <Button
                key={filter}
                variant={selectedQuickFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => handleQuickFilterSelect(filter)}
                className="flex-1"
              >
                {filter}
              </Button>
            ))}
          </div>

          {/* Date Range */}
          <div className="space-y-3">
            <h3 className="font-semibold">Date Range</h3>
            <div className="grid grid-cols-2 gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left h-12 font-normal bg-muted hover:bg-muted",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate
                      ? format(startDate, "dd MMM yyyy")
                      : "Select Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left h-12 font-normal bg-muted hover:bg-muted",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "dd MMM yyyy") : "Select Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Transaction Type */}
          <SelectDropdown
            name="Transaction Type"
            options={[
              { value: "store", label: "Store Transactions" },
              { value: "tipped", label: "Get Tipped" },
              { value: "withdrawals", label: "Withdrawals" },
              { value: "chargebacks", label: "Chargebacks" },
              { value: "cashback", label: "Cashback" },
              { value: "refer_earn", label: "Refer & Earn" },
            ]}
            selectedValues={selectedTransactionTypes}
            onSelect={(value) => setSelectedTransactionTypes(value)}
          />

          {/* Transaction Status */}
          <SelectDropdown
            name="Transaction Status"
            options={[
              { value: "successful", label: "Successful" },
              { value: "pending", label: "Pending" },
              { value: "failed", label: "Failed" },
            ]}
            selectedValues={selectedTransactionStatus}
            onSelect={(value) => setSelectedTransactionStatus(value)}
          />
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-0 left-0 right-0 flex gap-3 bg-background p-4">
          <Button
            variant="outline"
            onClick={handleClear}
            className="flex-1 rounded-full"
          >
            Clear
          </Button>
          <Button onClick={handleApply} className="flex-1 rounded-full">
            Apply
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
