import { cn } from "@/lib/utils";
import type { UIMessage } from "ai";
import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

export type MessageProps = HTMLAttributes<HTMLDivElement> & {
  from: UIMessage["role"];
};

export const Message = ({ className, from, ...props }: MessageProps) => (
  <div
    className={cn(
      "group flex w-full py-6",
      from === "user" ? "is-user justify-end" : "is-assistant justify-start",
      className
    )}
    {...props}
  />
);

const messageContentVariants = cva(
  "flex flex-col gap-2 overflow-hidden text-base relative",
  {
    variants: {
      variant: {
        contained: [
          // User messages: right-aligned subtle capsule with flat edge on top right
          "group-[.is-user]:max-w-[75%] group-[.is-user]:px-5 group-[.is-user]:py-4 group-[.is-user]:bg-neutral-800 group-[.is-user]:text-white group-[.is-user]:rounded-2xl group-[.is-user]:rounded-tr-sm",
          // Assistant messages: left-aligned plain text
          "group-[.is-assistant]:max-w-[85%] group-[.is-assistant]:text-white",
        ],
        flat: [
          "group-[.is-user]:max-w-[75%] group-[.is-user]:px-5 group-[.is-user]:py-4 group-[.is-user]:bg-neutral-800 group-[.is-user]:text-white group-[.is-user]:rounded-2xl group-[.is-user]:rounded-tr-sm",
          "group-[.is-assistant]:text-white",
        ],
      },
    },
    defaultVariants: {
      variant: "contained",
    },
  }
);

export type MessageContentProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof messageContentVariants>;

export const MessageContent = ({
  children,
  className,
  variant,
  ...props
}: MessageContentProps) => (
  <div
    className={cn(messageContentVariants({ variant, className }))}
    {...props}
  >
    {children}
  </div>
);
