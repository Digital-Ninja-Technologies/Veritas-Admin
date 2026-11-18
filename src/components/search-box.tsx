"use client";

import { useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchBox({ placeholder, paramName = "q" }: { placeholder: string; paramName?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  function onChange(value: string) {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value.trim() === "") params.delete(paramName);
      else params.set(paramName, value);
      router.push(`?${params.toString()}`);
    }, 250);
  }

  return (
    <div className="relative w-64">
      <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
      <Input
        className="pl-8"
        placeholder={placeholder}
        defaultValue={searchParams.get(paramName) ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
