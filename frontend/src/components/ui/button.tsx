import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "dark:bg-gray-800 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
// <<<<<<< HEAD
        login:
          "w-25 h-12 p-4 bg-[#FBF9F5] border border-[#0222D7] text-black rounded-md transition-colors duration-200 cursor-pointer font-semibold text-[18px] tracking-[0%] flex items-center justify-center",
        signup:
          "w-25 h-12 p-4 bg-[#0222D7] text-white rounded-md transition-colors duration-200 cursor-pointer font-semibold text-[18px] leading-[100%] tracking-[0%] flex items-center justify-center",
        course:
// =======
// login: "w-25 h-12 p-4 bg-[#FBF9F5] border border-[#0222D7] text-black rounded-md transition-colors duration-200 cursor-pointer font-semibold text-[18px] tracking-[0%] flex items-center justify-center",
// signup: "w-25 h-12 p-4 bg-[#0222D7] text-white rounded-md transition-colors duration-200 cursor-pointer font-semibold text-[18px] leading-[100%] tracking-[0%] flex items-center justify-center",
// course:
// >>>>>>> dev_pavan
          "w-[250px] h-[44px] rounded-[8px] font-semibold text-base bg-[#0222D7] hover:bg-[#1D4ED8] text-white flex items-center justify-center gap-2",
        branch:
          "w-[250px] h-[44px] rounded-[8px] font-semibold text-base bg-[#0222D7] hover:bg-[#1D4ED8] text-white flex items-center justify-center gap-2",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
