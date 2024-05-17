import { cn } from "@/lib/utils";

interface BounceLoaderProps {
    containerClassName?: string;

    dotClassName?: string;
}

export default function BounceLoader({
    containerClassName,
    dotClassName,
}: BounceLoaderProps) {
    return (
        <div
            className={cn(
                "flex items-center justify-center space-x-2",
                containerClassName
            )}
        >
            <div
                className={cn(
                    "h-5 w-5 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s]",
                    dotClassName
                )}
            ></div>
            <div
                className={cn(
                    "h-5 w-5 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.13s]",
                    dotClassName
                )}
            ></div>
            <div
                className={cn(
                    "h-5 w-5 animate-bounce rounded-full bg-blue-500",
                    dotClassName
                )}
            ></div>
        </div>
    );
}
