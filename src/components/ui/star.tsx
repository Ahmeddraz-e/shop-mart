import { Star as LucideStar, LucideProps } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarProps extends LucideProps {
    percentage?: number;
}

export default function Star({ className, percentage, ...props }: StarProps) {
    if (percentage === undefined) {
        return <LucideStar className={cn("w-4 h-4", className)} {...props} />;
    }

    return (
        <div className="relative inline-block w-4 h-4">
            <LucideStar className="w-4 h-4 text-gray-300 absolute top-0 left-0" {...props} />
            <div className="absolute top-0 left-0 h-full overflow-hidden" style={{ width: `${percentage}%` }}>
                <LucideStar className={cn("w-4 h-4", className)} {...props} />
            </div>
        </div>
    );
}
