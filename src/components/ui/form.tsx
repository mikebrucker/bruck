"use client";

import { Form as FormPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

const Form = FormPrimitive.Root;

function FormField({ className, ...props }: React.ComponentProps<typeof FormPrimitive.Field>) {
  return (
    <FormPrimitive.Field
      data-slot="form-field"
      className={cn("flex flex-col gap-1", className)}
      {...props}
    />
  );
}

function FormLabel({ className, ...props }: React.ComponentProps<typeof FormPrimitive.Label>) {
  return (
    <FormPrimitive.Label
      data-slot="form-label"
      className={cn("text-sm font-medium text-muted-foreground", className)}
      {...props}
    />
  );
}

const FormControl = FormPrimitive.Control;

function FormMessage({ className, ...props }: React.ComponentProps<typeof FormPrimitive.Message>) {
  return (
    <FormPrimitive.Message
      data-slot="form-message"
      className={cn("text-xs text-destructive", className)}
      {...props}
    />
  );
}

export { Form, FormControl, FormField, FormLabel, FormMessage };
