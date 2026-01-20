import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ethers } from 'ethers';
import { useWeb3 } from '@/lib/web3Context';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, CheckCircle, DollarSign, Wallet } from 'lucide-react';
import type { Artwork } from '@shared/schema';

interface PurchaseModalProps {
  artwork: Artwork;
  isOpen: boolean;
  onClose: () => void;
}

export function PurchaseModal({ artwork, isOpen, onClose }: PurchaseModalProps) {
  const { account, provider, signer } = useWeb3();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  // Fetch wallet balance on mount
  useEffect(() => {
    if (isOpen && account && provider) {
      fetchBalance();
    }
  }, [isOpen, account, provider]);

  const fetchBalance = async () => {
    try {
      if (!provider || !account) return;
      const balance = await provider.getBalance(account);
      setWalletBalance(ethers.formatEther(balance));
    } catch (err: any) {
      console.error('Failed to fetch balance:', err);
      setError('Failed to fetch wallet balance');
    }
  };

  const handlePurchase = async () => {
    if (!signer || !account || !artwork.price) {
      setError('Wallet not connected or artwork price not set');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Parse the price
      const priceInETH = parseFloat(artwork.price as string);
      const priceInWei = ethers.parseEther(priceInETH.toString());

      // Check balance
      if (walletBalance) {
        const balance = parseFloat(walletBalance);
        if (balance < priceInETH) {
          setError(
            `Insufficient balance. You have ${balance.toFixed(4)} ETH but need ${priceInETH.toFixed(4)} ETH`
          );
          setIsLoading(false);
          return;
        }
      }

      // Create transaction
      const tx = await signer.sendTransaction({
        to: artwork.artistAddress, // Send to artist
        value: priceInWei,
      });

      // Wait for transaction to be mined
      const receipt = await tx.wait();

      if (receipt?.hash) {
        setTxHash(receipt.hash);

        // Record purchase in backend
        try {
          await fetch('/api/artworks/purchase', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              artworkId: artwork.id,
              buyerAddress: account,
              artistAddress: artwork.artistAddress,
              price: priceInETH,
              transactionHash: receipt.hash,
            }),
          });
        } catch (err) {
          console.error('Failed to record purchase:', err);
        }

        toast({
          title: 'Purchase Successful! 🎉',
          description: `You've successfully purchased "${artwork.title}" for ${priceInETH} ETH`,
        });

        setTimeout(() => onClose(), 3000);
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to complete purchase';
      setError(errorMessage);
      console.error('Purchase error:', err);
      toast({
        title: 'Purchase Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const priceInETH = artwork.price ? parseFloat(artwork.price as string) : 0;
  const hasEnoughBalance =
    walletBalance && parseFloat(walletBalance) >= priceInETH;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <Card className="w-full max-w-md overflow-hidden shadow-2xl">
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="text-center">
                  <h2 className="text-2xl font-serif font-semibold mb-2">
                    {txHash ? '✅ Purchase Complete' : 'Purchase Artwork'}
                  </h2>
                  <p className="text-muted-foreground">
                    {txHash
                      ? 'Transaction confirmed on blockchain'
                      : 'Complete your purchase securely'}
                  </p>
                </div>

                {txHash ? (
                  // Success State
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <div className="flex justify-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-950">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-muted-foreground">
                          Artwork
                        </span>
                        <span className="text-sm font-medium text-right line-clamp-1">
                          {artwork.title}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-sm text-muted-foreground">
                          Amount
                        </span>
                        <span className="font-mono font-semibold">
                          {priceInETH} ETH
                        </span>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                      <p className="text-xs text-blue-900 dark:text-blue-200">
                        <strong>Transaction Hash:</strong>
                        <br />
                        <code className="text-xs break-all">
                          {txHash.slice(0, 10)}...{txHash.slice(-8)}
                        </code>
                      </p>
                    </div>

                    <Button
                      onClick={onClose}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      Continue to Gallery
                    </Button>
                  </motion.div>
                ) : (
                  // Purchase Form
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    {/* Artwork Info */}
                    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                      <h3 className="font-medium">{artwork.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {artwork.description}
                      </p>
                    </div>

                    {/* Wallet Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Wallet className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Connected Wallet:</span>
                      </div>
                      <p className="font-mono text-sm truncate bg-muted px-3 py-2 rounded">
                        {account}
                      </p>
                    </div>

                    {/* Balance Info */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Your Balance
                        </span>
                        <span className="font-mono font-semibold">
                          {walletBalance ? `${parseFloat(walletBalance).toFixed(4)} ETH` : 'Loading...'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-sm text-muted-foreground">Price</span>
                        <span className="font-mono font-semibold text-lg">
                          {priceInETH.toFixed(4)} ETH
                        </span>
                      </div>
                    </div>

                    {/* Error Alert */}
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {/* Insufficient Balance Warning */}
                    {walletBalance && !hasEnoughBalance && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Insufficient balance. You need{' '}
                          <strong>
                            {(priceInETH - parseFloat(walletBalance)).toFixed(4)} ETH
                          </strong>{' '}
                          more.
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Purchase Button */}
                    <Button
                      onClick={handlePurchase}
                      disabled={
                        isLoading ||
                        !hasEnoughBalance ||
                        !signer ||
                        !!error
                      }
                      className="w-full bg-primary text-primary-foreground font-semibold py-6"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing Transaction...
                        </>
                      ) : !hasEnoughBalance ? (
                        'Insufficient Balance'
                      ) : (
                        <>
                          <DollarSign className="w-4 h-4 mr-2" />
                          Complete Purchase - {priceInETH} ETH
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={onClose}
                      className="w-full"
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
