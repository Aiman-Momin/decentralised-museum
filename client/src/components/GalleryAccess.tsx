import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/authContext';
import { useWeb3 } from '@/lib/web3Context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Ticket, Lock, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface GalleryAccessProps {
  children: React.ReactNode;
}

export function GalleryAccess({ children }: GalleryAccessProps) {
  const { user } = useAuth();
  const { account } = useWeb3();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTicket, setSelectedTicket] = useState<string>('general');

  // Check if visitor has a valid ticket
  const { data: ticketData, isLoading: isCheckingTicket, refetch } = useQuery({
    queryKey: ['/api/tickets/check', account],
    enabled: !!account && user?.role === 'visitor',
    queryFn: async () => {
      const response = await fetch(`/api/tickets/check/${account}`);
      if (!response.ok) throw new Error('Failed to check ticket');
      return response.json();
    },
    staleTime: 0, // Always consider data stale to force refetch
  });

  // Purchase ticket mutation
  const purchaseTicketMutation = useMutation({
    mutationFn: async (ticketType: string) => {
      const prices: Record<string, string> = {
        general: '0.01',
        premium: '0.02',
        vip: '0.05',
      };

      const response = await fetch('/api/tickets/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketType,
          visitorAddress: account,
          amount: 1,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to purchase ticket');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'Your gallery ticket has been purchased. Welcome to the museum!',
      });
      // Refetch ticket status immediately and ensure gallery loads
      refetch();
      // Also prefetch artworks to ensure they load quickly
      queryClient.prefetchQuery({
        queryKey: ['/api/artworks'],
        queryFn: async () => {
          const response = await fetch('/api/artworks');
          if (!response.ok) throw new Error('Failed to fetch artworks');
          return response.json();
        },
      });
      setSelectedTicket('general');
    },
    onError: (error: any) => {
      toast({
        title: 'Purchase Failed',
        description: error.message || 'Failed to purchase ticket',
        variant: 'destructive',
      });
    },
  });

  // If user is not a visitor, show the gallery directly
  if (user?.role !== 'visitor') {
    return <>{children}</>;
  }

  // If checking ticket status
  if (isCheckingTicket) {
    return (
      <div className="min-h-screen flex items-center justify-center py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Checking your gallery access...</p>
        </motion.div>
      </div>
    );
  }

  // If visitor has a valid ticket, show the gallery
  if (ticketData?.hasValidTicket) {
    return <>{children}</>;
  }

  // If no ticket, show purchase prompt
  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="max-w-2xl mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Locked Gallery Message */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 text-primary mb-6">
              <Lock className="w-12 h-12" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight mb-4">
              Gallery Access Required
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-2">
              Purchase a museum ticket to unlock access to our exclusive gallery and view all artworks.
            </p>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Tickets are affordable and support the museum's mission to showcase digital art.
            </p>
          </div>

          {/* Ticket Purchase Options */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[
                { type: 'general', name: 'General', price: 0.01, description: 'Full access to all exhibitions' },
                { type: 'premium', name: 'Premium', price: 0.02, description: 'Includes special exhibitions' },
                { type: 'vip', name: 'VIP', price: 0.05, description: 'Exclusive curator tours' },
              ].map((ticket) => (
                <motion.div
                  key={ticket.type}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedTicket(ticket.type)}
                >
                  <Card
                    className={`cursor-pointer transition-all h-full ${
                      selectedTicket === ticket.type
                        ? 'ring-2 ring-primary border-primary'
                        : 'hover:border-primary/50'
                    }`}
                  >
                    <CardHeader className="text-center pb-3">
                      <CardTitle className="text-lg">{ticket.name}</CardTitle>
                      <div className="text-2xl font-bold text-primary mt-2">
                        {ticket.price} ETH
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground text-center">
                        {ticket.description}
                      </p>
                      {selectedTicket === ticket.type && (
                        <div className="flex justify-center mt-4">
                          <CheckCircle className="w-5 h-5 text-primary" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Purchase Button */}
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="w-5 h-5" />
                  Purchase Your Ticket
                </CardTitle>
                <CardDescription>
                  No credit card required. Pay with ETH directly from your wallet.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Selected Ticket:</span>
                    <Badge variant="secondary" className="text-base px-3">
                      {[
                        { type: 'general', name: 'General' },
                        { type: 'premium', name: 'Premium' },
                        { type: 'vip', name: 'VIP' },
                      ].find((t) => t.type === selectedTicket)?.name}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <span>Total Cost:</span>
                    <span className="font-mono">
                      {selectedTicket === 'general'
                        ? '0.01'
                        : selectedTicket === 'premium'
                          ? '0.02'
                          : '0.05'}{' '}
                      ETH
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => purchaseTicketMutation.mutate(selectedTicket)}
                  disabled={purchaseTicketMutation.isPending}
                  size="lg"
                  className="w-full gap-2 text-base py-6"
                >
                  {purchaseTicketMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Ticket className="w-5 h-5" />
                      Purchase Ticket & Enter Gallery
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  ✓ Instant access after purchase • No refunds • Lifetime access to galleries
                </p>
              </CardContent>
            </Card>

            {/* Info Box */}
            <Card className="border-dashed">
              <CardContent className="pt-6">
                <div className="space-y-3 text-sm">
                  <h3 className="font-semibold text-base">Why Purchase a Ticket?</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>Access to our entire collection of NFT artworks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>Direct purchase support for artists</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>Lifetime access - purchase once, view forever</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>Help support the decentralized art community</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
