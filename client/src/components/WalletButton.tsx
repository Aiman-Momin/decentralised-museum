import { useWeb3 } from '@/lib/web3Context';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function WalletButton() {
  const { account, connectWallet, disconnectWallet, isConnecting } = useWeb3();

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!account) {
    return (
      <Button
        onClick={connectWallet}
        disabled={isConnecting}
        size="default"
        variant="outline"
        className="font-mono gap-2"
        data-testid="button-connect-wallet"
      >
        <Wallet className="w-4 h-4" />
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="default"
          className="font-mono gap-2"
          data-testid="button-wallet-menu"
        >
          <Wallet className="w-4 h-4" />
          {truncateAddress(account)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          onClick={disconnectWallet}
          className="cursor-pointer gap-2"
          data-testid="button-disconnect-wallet"
        >
          <LogOut className="w-4 h-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
