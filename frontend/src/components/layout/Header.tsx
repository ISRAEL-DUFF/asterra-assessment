import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Users, ListPlus } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: Users },
  { path: '/forms', label: 'Add Data', icon: ListPlus },
];

export function Header() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
          <div className="rounded-lg gradient-primary p-1.5">
            <Users className="h-5 w-5 text-primary-foreground" />
          </div>
          <span>User Hobbies</span>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
