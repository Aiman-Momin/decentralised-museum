import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWeb3 } from '@/lib/web3Context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Ticket, Users, Loader2, CheckCircle } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Badge } from '@/components/ui/badge';
import type { User } from '@shared/schema';

export default function VisitorDashboard() {
  const { account, connectWallet } = useWeb3();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [ticketAmount, setTicketAmount] = useState('1');

  const { data: user } = useQuery<User>({
    queryKey: ['/api/users/me', account],
    enabled: !!account,
    queryFn: async () => {
      const response = await fetch(`/api/users/me/${account}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json();
    },
  });

  const purchaseTicketMutation = useMutation({
    mutationFn: async (data: { ticketType: string; amount: number }) => {
      return await apiRequest('POST', '/api/tickets/purchase', { ...data, visitorAddress: account });
    },
    onSuccess: () => {
      toast({
        title: 'Ticket Purchased!',
        description: 'Your museum ticket has been purchased successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/tickets'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Purchase Failed',
        description: error.message || 'Failed to purchase ticket',
        variant: 'destructive',
      });
    },
  });

  const joinDaoMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/dao/join', { walletAddress: account });
    },
    onSuccess: () => {
      toast({
        title: 'Welcome to the DAO!',
        description: 'You are now a member of the Decentralized Museum DAO.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/users/me'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to Join',
        description: error.message || 'Failed to join DAO',
        variant: 'destructive',
      });
    },
  });

  const handlePurchaseTicket = (ticketType: string, price: number) => {
    if (!account) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet first.',
        variant: 'destructive',
      });
      return;
    }
    purchaseTicketMutation.mutate({ ticketType, amount: parseInt(ticketAmount) });
  };

  if (!account) {
    return (
      <div className="min-h-screen flex items-center justify-center py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-6">
            <Ticket className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-serif font-semibold mb-4">Visitor Portal</h2>
          <p className="text-muted-foreground mb-8">
            Connect your wallet to purchase tickets and join the DAO community.
          </p>
          <Button onClick={connectWallet} size="lg" data-testid="button-connect-wallet-visitor">
            Connect Wallet
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight mb-4">
            Visitor Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Purchase museum tickets with crypto tokens and join the DAO to shape the future.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Purchase Tickets */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-serif flex items-center gap-2">
                <Ticket className="w-6 h-6" />
                Purchase Tickets
              </CardTitle>
              <CardDescription>
                Buy museum access tickets using ERC-20 tokens.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {[
                  { type: 'general', name: 'General Admission', price: 0.01, description: 'Full access to all permanent exhibitions' },
                  { type: 'premium', name: 'Premium Access', price: 0.02, description: 'Includes special exhibitions and events' },
                  { type: 'vip', name: 'VIP Experience', price: 0.05, description: 'Exclusive curator tours and private viewings' },
                ].map((ticket) => (
                  <div
                    key={ticket.type}
                    className="border rounded-lg p-6 space-y-3 hover-elevate transition-all"
                    data-testid={`card-ticket-${ticket.type}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <h3 className="font-semibold text-lg">{ticket.name}</h3>
                        <p className="text-sm text-muted-foreground">{ticket.description}</p>
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        <span className="font-mono">{ticket.price} ETH</span>
                      </Badge>
                    </div>
                    <Button
                      onClick={() => handlePurchaseTicket(ticket.type, ticket.price)}
                      disabled={purchaseTicketMutation.isPending}
                      className="w-full gap-2"
                      data-testid={`button-purchase-${ticket.type}`}
                    >
                      {purchaseTicketMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Ticket className="w-4 h-4" />
                          Purchase Ticket
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* DAO Membership */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-serif flex items-center gap-2">
                <Users className="w-6 h-6" />
                DAO Membership
              </CardTitle>
              <CardDescription>
                Join the community and help shape the museum's future.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {user?.isDaoMember ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">DAO Member</h3>
                  <p className="text-muted-foreground mb-6">
                    You're already a member of the Decentralized Museum DAO!
                  </p>
                  <Badge variant="default" className="text-base px-4 py-2">
                    Active Member
                  </Badge>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                    <h3 className="font-semibold text-lg">Membership Benefits</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                        <span>Vote on new exhibitions and events</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                        <span>Propose new ideas for the museum</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                        <span>Receive governance tokens for voting power</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                        <span>Exclusive access to member-only events</span>
                      </li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-6 bg-card">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-semibold">Membership Fee</span>
                      <Badge variant="secondary">
                        <span className="font-mono">0.05 ETH</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">
                      One-time membership fee to receive governance tokens and voting rights.
                    </p>
                    <Button
                      onClick={() => joinDaoMutation.mutate()}
                      disabled={joinDaoMutation.isPending}
                      className="w-full gap-2"
                      size="lg"
                      data-testid="button-join-dao"
                    >
                      {joinDaoMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Users className="w-4 h-4" />
                          Join DAO
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
