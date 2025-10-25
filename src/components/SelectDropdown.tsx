import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface Props {
  options: { label: string; value: string }[];
  name: string;
  selectedValues: string[];
  onSelect: (value: string[]) => void;
}

export function SelectDropdown({
  options,
  name,
  selectedValues,
  onSelect,
}: Props) {
  const initialSelected = options.filter((option) =>
    selectedValues.includes(option.value)
  );

  const [open, setOpen] = useState(false);
  const [selected, setSelected] =
    useState<{ [key: string]: string }[]>(initialSelected);

  const handleOnCheckedChange = (
    checked: boolean,
    option: { label: string; value: string }
  ) => {
    if (checked) {
      setSelected([...selected, option]);
      onSelect([...selected.map((item) => item.value), option.value]);
    } else {
      setSelected(selected.filter((item) => item.value !== option.value));
      onSelect(selected.map((item) => item.value));
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="max-w-4xl space-y-3">
        <div>
          <Label
            htmlFor="filter"
            className="capitalize font-semibold text-base"
          >
            {name}
          </Label>
        </div>
        <PopoverTrigger asChild>
          <Button
            id="filter"
            variant="outline"
            className={cn(
              "px-4 py-3 min-h-12 w-full justify-start rounded-[0.75rem] h-auto",
              { "ring-ring ring-2 border-ring": open }
            )}
          >
            {selected.length > 0 ? (
              <div className="overflow-x-auto truncate">
                {selected.map((cat) => cat.label).join(", ")}
              </div>
            ) : (
              `Select ${name}`
            )}
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent
        className="max-h-96 overflow-y-auto"
        style={{ width: "var(--radix-popper-anchor-width)" }}
      >
        {options?.map((option) => (
          <div key={option.value} className="flex items-center py-4 space-x-3">
            <Checkbox
              id={option.value}
              checked={selected.some((item) => item.value === option.value)}
              onCheckedChange={(checked) =>
                handleOnCheckedChange(checked as boolean, option)
              }
            />
            <Label htmlFor={option.value}>{option.label}</Label>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}
