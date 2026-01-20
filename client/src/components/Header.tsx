import { Link, useLocation } from 'wouter';
import { WalletButton } from './WalletButton';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/authContext';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  // Get nav items based on user role
  const getNavItems = () => {
    const baseItems = [{ path: '/', label: 'Home' }];

    if (!user) return baseItems;

    if (user.role === 'artist') {
      return [
        ...baseItems,
        { path: '/gallery', label: 'Gallery' },
        { path: '/artist', label: 'Artist Portal' },
      ];
    }

    if (user.role === 'visitor') {
      return [
        ...baseItems,
        { path: '/gallery', label: 'Gallery' },
        { path: '/visitor', label: 'Visitor Portal' },
      ];
    }

    if (user.role === 'dao-member') {
      return [
        ...baseItems,
        { path: '/gallery', label: 'Gallery' },
        { path: '/dao', label: 'DAO Governance' },
      ];
    }

    return baseItems;
  };

  const navItems = getNavItems();
  const isActive = (path: string) => location === path;

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/">
            <div className="flex items-center gap-3 group cursor-pointer" data-testid="link-home">
              <div className="text-2xl font-serif font-semibold tracking-tight">
                <span className="text-foreground">Decentralized</span>
                <span className="text-primary ml-1">Museum</span>
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`${isActive(item.path) ? 'bg-accent' : ''}`}
                  data-testid={`link-nav-${item.label.toLowerCase().replace(' ', '-')}`}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {user && (
              <div className="hidden md:flex items-center gap-2">
                <div className="text-sm text-muted-foreground px-3 py-1 rounded-md bg-accent/50 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="capitalize">{user.role}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="text-destructive hover:text-destructive"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
            <WalletButton />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t overflow-hidden"
          >
            <nav className="flex flex-col p-4 gap-2">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <Button
                    onClick={() => setMobileMenuOpen(false)}
                    variant={isActive(item.path) ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                    data-testid={`link-mobile-${item.label.toLowerCase().replace(' ', '-')}`}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
              {user && (
                <>
                  <div className="text-sm text-muted-foreground px-3 py-2 rounded-md bg-accent/50 flex items-center gap-2 mt-2">
                    <User className="w-4 h-4" />
                    <span className="capitalize">{user.role}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    className="w-full text-destructive hover:text-destructive mt-2"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
