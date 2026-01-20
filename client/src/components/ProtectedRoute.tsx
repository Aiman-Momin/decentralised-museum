import { ReactNode } from 'react';
import { useAuth } from '@/lib/authContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Lock, ArrowLeft } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole: 'artist' | 'visitor' | 'dao-member' | 'artist-or-dao';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const hasAccess =
    requiredRole === 'artist' ? user.role === 'artist' :
    requiredRole === 'visitor' ? user.role === 'visitor' :
    requiredRole === 'dao-member' ? user.role === 'dao-member' :
    requiredRole === 'artist-or-dao' ? (user.role === 'artist' || user.role === 'dao-member') :
    false;

  if (!hasAccess) {
    return <UnauthorizedPage requiredRole={requiredRole} userRole={user.role} />;
  }

  return <>{children}</>;
}

interface UnauthorizedPageProps {
  requiredRole: string;
  userRole: string | null;
}

function UnauthorizedPage({ requiredRole, userRole }: UnauthorizedPageProps) {
  const roleMessages = {
    artist: {
      title: '🎨 Artist Portal',
      message: 'Only artists can access this portal.',
      description: 'This portal is exclusively for artists to upload, manage, and sell their digital artwork as NFTs.',
    },
    visitor: {
      title: '👥 Visitor Portal',
      message: 'Only visitors can access this portal.',
      description: 'This portal is for gallery visitors to explore, browse, and purchase artwork.',
    },
    'dao-member': {
      title: '🗳️ DAO Governance',
      message: 'Only DAO members can access this portal.',
      description: 'This portal is reserved for DAO members to vote on museum governance and exhibitions.',
    },
    'artist-or-dao': {
      title: 'Restricted Access',
      message: 'Only artists and DAO members can access this portal.',
      description: 'This portal requires either artist or DAO member status.',
    },
  };

  const info = roleMessages[requiredRole as keyof typeof roleMessages] || roleMessages['artist'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-destructive/5 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card className="border-2 border-destructive/30 shadow-lg p-8">
          <div className="text-center">
            {/* Lock Icon */}
            <div className="inline-block p-3 bg-destructive/10 rounded-full mb-4">
              <Lock className="w-8 h-8 text-destructive" />
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold mb-2">{info.title}</h1>

            {/* Message */}
            <p className="text-lg font-semibold text-destructive mb-2">{info.message}</p>

            {/* Description */}
            <p className="text-muted-foreground mb-6">{info.description}</p>

            {/* Current Role Info */}
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground mb-1">Your current role:</p>
              <p className="text-lg font-semibold capitalize">{userRole}</p>
            </div>

            {/* Information Box */}
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-amber-900 dark:text-amber-200">
                {requiredRole === 'artist'
                  ? 'Sign up as an artist to access the artist portal and upload your artwork.'
                  : requiredRole === 'visitor'
                  ? 'As a visitor, you can explore the gallery and purchase artwork.'
                  : requiredRole === 'dao-member'
                  ? 'Become a DAO member to participate in museum governance.'
                  : 'You need to be an artist or DAO member to access this area.'}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link href="/">
                <Button className="w-full bg-primary text-primary-foreground py-6">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Link href="/gallery">
                <Button variant="outline" className="w-full py-6">
                  Browse Gallery
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
