import { cn } from '@/lib/utils';
import { LucideIcon, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon = Users,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4', className)}>
      <div className="rounded-full bg-accent p-4 mb-4">
        <Icon className="h-8 w-8 text-accent-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-center max-w-sm mb-6">{description}</p>
      {actionLabel && (actionHref || onAction) && (
        actionHref ? (
          <Button asChild>
            <Link to={actionHref}>{actionLabel}</Link>
          </Button>
        ) : (
          <Button onClick={onAction}>{actionLabel}</Button>
        )
      )}
    </div>
  );
}
