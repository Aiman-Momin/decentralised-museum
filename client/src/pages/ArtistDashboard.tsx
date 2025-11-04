import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWeb3 } from '@/lib/web3Context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, Loader2, CheckCircle, Image as ImageIcon, Palette } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { Artwork } from '@shared/schema';

export default function ArtistDashboard() {
  const { account, connectWallet } = useWeb3();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    royaltyPercentage: '5',
  });

  const { data: myArtworks } = useQuery<Artwork[]>({
    queryKey: ['/api/artworks/my', account],
    enabled: !!account,
    queryFn: async () => {
      const response = await fetch(`/api/artworks/my/${account}`);
      if (!response.ok) throw new Error('Failed to fetch artworks');
      return response.json();
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch('/api/artworks/upload', {
        method: 'POST',
        body: data,
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'Your artwork has been uploaded and is ready to mint.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/artworks/my'] });
      setSelectedFile(null);
      setPreview(null);
      setFormData({ title: '', description: '', price: '', royaltyPercentage: '5' });
    },
    onError: (error: any) => {
      toast({
        title: 'Upload Failed',
        description: error.message || 'Failed to upload artwork',
        variant: 'destructive',
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet first.',
        variant: 'destructive',
      });
      return;
    }
    if (!selectedFile) {
      toast({
        title: 'No File Selected',
        description: 'Please select an artwork file to upload.',
        variant: 'destructive',
      });
      return;
    }

    const data = new FormData();
    data.append('file', selectedFile);
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('royaltyPercentage', formData.royaltyPercentage);
    data.append('artistAddress', account);

    uploadMutation.mutate(data);
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
            <Palette className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-serif font-semibold mb-4">Artist Portal</h2>
          <p className="text-muted-foreground mb-8">
            Connect your wallet to access the artist dashboard and mint your artwork as NFTs.
          </p>
          <Button onClick={connectWallet} size="lg" data-testid="button-connect-wallet-artist">
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
            Artist Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Upload your artwork, store it on IPFS, and mint unique NFTs with royalty tracking.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Upload Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-serif">Upload Artwork</CardTitle>
              <CardDescription>
                Upload your digital artwork and mint it as an NFT on the blockchain.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* File Upload */}
                <div className="space-y-2">
                  <Label htmlFor="file-upload">Artwork File</Label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      preview ? 'border-primary' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      data-testid="input-file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      {preview ? (
                        <div className="space-y-4">
                          <img
                            src={preview}
                            alt="Preview"
                            className="max-h-48 mx-auto rounded-lg"
                            data-testid="img-artwork-preview"
                          />
                          <p className="text-sm text-muted-foreground">Click to change</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                          <div>
                            <p className="font-medium">Click to upload artwork</p>
                            <p className="text-sm text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                          </div>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter artwork title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    data-testid="input-artwork-title"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your artwork..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    required
                    data-testid="input-artwork-description"
                  />
                </div>

                {/* Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (ETH)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      data-testid="input-artwork-price"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="royalty">Royalty %</Label>
                    <Input
                      id="royalty"
                      type="number"
                      min="0"
                      max="10"
                      value={formData.royaltyPercentage}
                      onChange={(e) => setFormData({ ...formData, royaltyPercentage: e.target.value })}
                      data-testid="input-royalty-percentage"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={uploadMutation.isPending}
                  data-testid="button-upload-mint"
                >
                  {uploadMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading to IPFS...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload & Mint NFT
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Preview Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-serif">Preview</CardTitle>
              <CardDescription>
                See how your artwork will appear in the gallery.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-[3/4] rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                {preview ? (
                  <img
                    src={preview}
                    alt="Artwork preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <ImageIcon className="w-16 h-16 mx-auto mb-4" />
                    <p>Upload an image to preview</p>
                  </div>
                )}
              </div>
              {formData.title && (
                <div className="mt-6 space-y-3">
                  <h3 className="text-xl font-serif font-medium">{formData.title}</h3>
                  {formData.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {formData.description}
                    </p>
                  )}
                  <div className="pt-3 border-t space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Artist</p>
                    <p className="font-mono text-sm truncate">{account}</p>
                  </div>
                  {formData.price && (
                    <p className="text-sm font-medium">
                      <span className="text-muted-foreground">Price: </span>
                      <span className="font-mono">{formData.price} ETH</span>
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* My Artworks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl font-serif font-semibold mb-8">My Artworks</h2>
          {!myArtworks || myArtworks.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <CheckCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">
                You haven't minted any artworks yet. Upload your first piece above!
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myArtworks.map((artwork, index) => (
                <Card key={artwork.id} className="overflow-hidden" data-testid={`card-my-artwork-${index}`}>
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={`https://gateway.pinata.cloud/ipfs/${artwork.ipfsHash}`}
                      alt={artwork.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-serif font-medium text-lg">{artwork.title}</h3>
                    <p className="text-sm text-muted-foreground">Token ID: {artwork.tokenId}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
