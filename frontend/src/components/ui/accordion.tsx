"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        // base layout + FAQ card look
        "w-[630px] overflow-hidden cursor-pointer outline-none focus:outline-none",
        "rounded-[30px] bg-[#F5F4F4]",
        // gradient border
        "border border-transparent [border-image:linear-gradient(360deg,rgba(245,244,244,0.05)_0%,rgba(231,230,230,0.055)_10.1%,rgba(213,212,212,0.061)_22.6%,rgba(198,197,197,0.067)_33.65%,rgba(185,185,185,0.071)_42.31%,rgba(169,169,169,0.077)_53.85%,rgba(148,148,148,0.084)_68.75%,rgba(124,124,124,0.093)_86.38%,rgba(104,104,104,0.1)_100%)] [border-image-slice:1]",
        // subtle inset shadow
        "shadow-[inset_0_6px_6px_0_#68686808,inset_0_3px_3px_0_#68686803,inset_0_9px_9px_0_#00000008]",
        "transition-all duration-300",
        className
      )}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex w-full">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "px-3 py-4 flex flex-1 items-center justify-between text-left font-medium text-base",
          "rounded-[30px] outline-none transition-colors duration-300",
          // remove underline
          "no-underline hover:no-underline",
          // hover only when closed
          "data-[state=closed]:hover:bg-blue-700 data-[state=closed]:hover:text-white",
          // chevron rotation
          "[&[data-state=open]>svg]:rotate-180",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className={cn(
        "overflow-hidden text-gray-600 text-sm",
        "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        className
      )}
      {...props}
    >
      <div className="px-3 pb-4 pt-2">{children}</div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
