import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

const ActionTableRoot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative w-full overflow-hidden rounded-lg border border-white/5 bg-zinc-950 shadow-2xl",
      className
    )}
    {...props}
  />
))
ActionTableRoot.displayName = "ActionTableRoot"

const ActionTable = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="w-full overflow-x-auto">
    <table
      ref={ref}
      className={cn("w-full text-left border-collapse text-sm", className)}
      {...props}
    />
  </div>
))
ActionTable.displayName = "ActionTable"

const ActionTableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("bg-zinc-900/40 border-b border-white/5", className)} {...props} />
))
ActionTableHeader.displayName = "ActionTableHeader"

const ActionTableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("divide-y divide-white/5", className)}
    {...props}
  />
))
ActionTableBody.displayName = "ActionTableBody"

const ActionTableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-white/5 transition-colors hover:bg-white/3 last:border-0 group",
      className
    )}
    {...props}
  />
))
ActionTableRow.displayName = "ActionTableRow"

const ActionTableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "px-6 py-3 align-middle text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500",
      className
    )}
    {...props}
  />
))
ActionTableHead.displayName = "ActionTableHead"

const ActionTableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("px-6 py-4 align-middle", className)}
    {...props}
  />
))
ActionTableCell.displayName = "ActionTableCell"

export {
  ActionTable,
  ActionTableRoot,
  ActionTableHeader,
  ActionTableBody,
  ActionTableRow,
  ActionTableHead,
  ActionTableCell,
}
