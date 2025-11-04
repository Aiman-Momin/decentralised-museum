import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Home, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md px-6"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 text-destructive mb-6">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h1 className="text-6xl font-serif font-bold mb-4">404</h1>
        <h2 className="text-2xl font-serif font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <Button size="lg" className="gap-2" data-testid="button-return-home">
            <Home className="w-4 h-4" />
            Return Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
