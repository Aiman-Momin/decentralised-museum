import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWeb3 } from '@/lib/web3Context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Vote, ThumbsUp, ThumbsDown, Minus, Loader2, Users } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { Proposal, User } from '@shared/schema';
import { formatDistanceToNow } from 'date-fns';

export default function DaoGovernance() {
  const { account, connectWallet } = useWeb3();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user } = useQuery<User>({
    queryKey: ['/api/users/me', account],
    enabled: !!account,
    queryFn: async () => {
      const response = await fetch(`/api/users/me/${account}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json();
    },
  });

  const { data: proposals, isLoading } = useQuery<Proposal[]>({
    queryKey: ['/api/proposals'],
  });

  const voteMutation = useMutation({
    mutationFn: async (data: { proposalId: string; voteType: string }) => {
      return await apiRequest('POST', '/api/proposals/vote', { ...data, voterAddress: account });
    },
    onSuccess: () => {
      toast({
        title: 'Vote Submitted!',
        description: 'Your vote has been recorded on the blockchain.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/proposals'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Vote Failed',
        description: error.message || 'Failed to submit vote',
        variant: 'destructive',
      });
    },
  });

  const handleVote = (proposalId: string, voteType: 'for' | 'against' | 'abstain') => {
    if (!account) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet first.',
        variant: 'destructive',
      });
      return;
    }
    if (!user?.isDaoMember) {
      toast({
        title: 'Not a DAO Member',
        description: 'Join the DAO to participate in governance.',
        variant: 'destructive',
      });
      return;
    }
    voteMutation.mutate({ proposalId, voteType });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'passed':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const calculateQuorum = (proposal: Proposal) => {
    const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain;
    return totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
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
            <Vote className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-serif font-semibold mb-4">DAO Governance</h2>
          <p className="text-muted-foreground mb-8">
            Connect your wallet to view and vote on proposals.
          </p>
          <Button onClick={connectWallet} size="lg" data-testid="button-connect-wallet-dao">
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
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight mb-4">
                DAO Governance
              </h1>
              <p className="text-lg text-muted-foreground">
                Vote on proposals to shape the future of the Decentralized Museum.
              </p>
            </div>
            {user?.isDaoMember && (
              <Badge variant="default" className="shrink-0">
                <Users className="w-3 h-3 mr-1" />
                DAO Member
              </Badge>
            )}
          </div>
        </motion.div>

        {!user?.isDaoMember && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary shrink-0">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">Join the DAO to Vote</h3>
                    <p className="text-muted-foreground mb-4">
                      Become a DAO member to participate in governance and vote on proposals.
                    </p>
                    <Button size="sm" asChild data-testid="button-join-dao-banner">
                      <a href="/visitor">Join DAO</a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : !proposals || proposals.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Vote className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-serif font-medium mb-2">No Active Proposals</h3>
            <p className="text-muted-foreground">
              Check back later for new proposals to vote on.
            </p>
          </Card>
        ) : (
          <div className="space-y-6">
            {proposals.map((proposal, index) => {
              const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain;
              const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
              const againstPercentage = totalVotes > 0 ? (proposal.votesAgainst / totalVotes) * 100 : 0;
              const quorum = calculateQuorum(proposal);

              return (
                <motion.div
                  key={proposal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  data-testid={`card-proposal-${index}`}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <CardTitle className="text-2xl font-serif">
                          {proposal.title}
                        </CardTitle>
                        <Badge variant={getStatusColor(proposal.status) as any}>
                          {proposal.status}
                        </Badge>
                      </div>
                      <CardDescription className="text-base">
                        {proposal.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Voting Stats */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Voting Progress</span>
                          <span className="font-mono">{totalVotes} votes cast</span>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-green-600 dark:text-green-400">For</span>
                              <span className="font-mono">{proposal.votesFor} ({forPercentage.toFixed(1)}%)</span>
                            </div>
                            <Progress value={forPercentage} className="h-2" />
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-red-600 dark:text-red-400">Against</span>
                              <span className="font-mono">{proposal.votesAgainst} ({againstPercentage.toFixed(1)}%)</span>
                            </div>
                            <Progress value={againstPercentage} className="h-2" />
                          </div>
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t text-sm">
                        <div>
                          <p className="text-muted-foreground mb-1">Proposal Type</p>
                          <Badge variant="outline">{proposal.proposalType}</Badge>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Ends</p>
                          <p className="font-medium">
                            {formatDistanceToNow(new Date(proposal.endTime), { addSuffix: true })}
                          </p>
                        </div>
                      </div>

                      {/* Vote Buttons */}
                      {proposal.status === 'active' && user?.isDaoMember && (
                        <div className="flex gap-3 pt-4 border-t">
                          <Button
                            onClick={() => handleVote(proposal.proposalId, 'for')}
                            disabled={voteMutation.isPending}
                            variant="default"
                            className="flex-1 gap-2"
                            data-testid={`button-vote-for-${index}`}
                          >
                            <ThumbsUp className="w-4 h-4" />
                            Vote For
                          </Button>
                          <Button
                            onClick={() => handleVote(proposal.proposalId, 'against')}
                            disabled={voteMutation.isPending}
                            variant="destructive"
                            className="flex-1 gap-2"
                            data-testid={`button-vote-against-${index}`}
                          >
                            <ThumbsDown className="w-4 h-4" />
                            Vote Against
                          </Button>
                          <Button
                            onClick={() => handleVote(proposal.proposalId, 'abstain')}
                            disabled={voteMutation.isPending}
                            variant="outline"
                            className="gap-2"
                            data-testid={`button-vote-abstain-${index}`}
                          >
                            <Minus className="w-4 h-4" />
                            Abstain
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
