import * as React from "react"
import { Edit2, Trash2 } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"

export interface ActionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  isActive?: boolean
  decoratorIcon?: React.ReactNode
}

/**
 * Primitive Card Wrapper with Expert UI-UX styling applied globally.
 * Implements smooth transition rings, high border radiuses (32px), 
 * and deep color scales (zinc-950).
 */
export const ActionCard = React.forwardRef<HTMLDivElement, ActionCardProps>(
  ({ className, children, isActive = false, decoratorIcon, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "group flex flex-col rounded-[32px] border bg-zinc-950 relative overflow-hidden transition-all duration-300",
          isActive 
            ? "border-indigo-500/30" 
            : "border-white/5",
          className
        )}
        {...props}
      >
        {decoratorIcon && (
          <div className="absolute -right-6 -top-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none text-white">
            {decoratorIcon}
          </div>
        )}
        {children}
      </div>
    )
  }
)
ActionCard.displayName = "ActionCard"

/**
 * Standard Header wrapper.
 */
export const ActionCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6 z-10", className)}
      {...props}
    >
      {children}
    </div>
  )
)
ActionCardHeader.displayName = "ActionCardHeader"

/**
 * Content holder ensuring full expansion (flex-1) downwards.
 */
export const ActionCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn("p-6 pt-0 flex-1 flex flex-col z-10", className)} 
      {...props} 
    />
  )
)
ActionCardContent.displayName = "ActionCardContent"

export interface ActionCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  onEdit?: () => void
  onDelete?: () => void
}

/**
 * Pre-coded dynamic structural footer.
 * Renders 'Editar' and 'Eliminar' only if handlers are provided.
 */
export const ActionCardFooter = React.forwardRef<HTMLDivElement, ActionCardFooterProps>(
  ({ className, onEdit, onDelete, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "px-6 py-4 flex flex-col gap-3 shrink-0 z-10",
        className
      )}
      {...props}
    >
      {children}
      {(onEdit || onDelete) && (
        <div className="flex items-center justify-between gap-3 pt-2">
          {onEdit && (
            <Button 
              variant="ghost" 
              onClick={onEdit}
              className="flex-1 h-11 rounded-2xl bg-zinc-900 border border-white/5 text-[11px] font-black uppercase tracking-widest text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all font-sans"
            >
              <Edit2 className="size-3.5 mr-2" />
              Editar
            </Button>
          )}
          {onDelete && (
            <Button 
              variant="ghost" 
              onClick={onDelete}
              className="flex-1 h-11 rounded-2xl bg-red-500/5 border border-red-500/10 text-[11px] font-black uppercase tracking-widest text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-all font-sans"
            >
              <Trash2 className="size-3.5 mr-2" />
              Eliminar
            </Button>
          )}
        </div>
      )}
    </div>
  )
)
ActionCardFooter.displayName = "ActionCardFooter"

/**
 * Avatar block for primary card identification.
 */
export const ActionCardAvatar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center justify-center size-12 rounded-[14px] bg-white/3 border border-white/5 shadow-inner text-white shrink-0", className)}
      {...props}
    >
      {children}
    </div>
  )
)
ActionCardAvatar.displayName = "ActionCardAvatar"

/**
 * Pilled tags container.
 */
export const ActionCardTags = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-wrap items-center gap-2", className)}
      {...props}
    >
      {children}
    </div>
  )
)
ActionCardTags.displayName = "ActionCardTags"

export interface ActionCardProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max: number
  label?: string
}

/**
 * Clean structural progress bar integrating metrics.
 */
export const ActionCardProgress = React.forwardRef<HTMLDivElement, ActionCardProgressProps>(
  ({ className, value, max, label, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
    const isFull = value >= max
    
    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        {label && (
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="text-zinc-500 uppercase tracking-widest">{label}</span>
            <span className={cn(isFull ? "text-red-400" : "text-white")}>{value} <span className="text-zinc-600 font-medium">/ {max}</span></span>
          </div>
        )}
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <div 
            className={cn("h-full rounded-full transition-all duration-500", isFull ? "bg-red-500" : "bg-indigo-500")}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }
)
ActionCardProgress.displayName = "ActionCardProgress"
