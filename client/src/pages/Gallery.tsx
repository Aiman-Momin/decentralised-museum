import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import type { Artwork } from '@shared/schema';
import placeholderNFT from '@assets/generated_images/Digital_art_placeholder_NFT_9c6cb210.png';

export default function Gallery() {
  const { data: artworks, isLoading } = useQuery<Artwork[]>({
    queryKey: ['/api/artworks'],
  });

  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-serif font-semibold tracking-tight mb-6">
            Museum Gallery
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our curated collection of blockchain-verified artworks from talented artists around the world.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : !artworks || artworks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
              <ImageIcon className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-serif font-medium mb-4">No Artworks Yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              The gallery is waiting for its first masterpiece. Artists can mint NFTs to populate this collection.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {artworks.map((artwork, index) => (
              <motion.div
                key={artwork.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                data-testid={`card-artwork-${index}`}
              >
                <Card className="group overflow-hidden hover-elevate active-elevate-2 transition-all duration-300">
                  <div className="aspect-[3/4] overflow-hidden rounded-t-lg">
                    <img
                      src={artwork.ipfsHash ? `https://gateway.pinata.cloud/ipfs/${artwork.ipfsHash}` : placeholderNFT}
                      alt={artwork.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      data-testid={`img-artwork-${index}`}
                    />
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xl font-serif font-medium line-clamp-1" data-testid={`text-artwork-title-${index}`}>
                        {artwork.title}
                      </h3>
                      <Badge variant="secondary" className="shrink-0" data-testid={`badge-minted-${index}`}>
                        Minted
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-artwork-description-${index}`}>
                      {artwork.description}
                    </p>
                    <div className="pt-3 border-t space-y-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Artist</p>
                      <p className="font-mono text-sm truncate" data-testid={`text-artist-address-${index}`}>
                        {artwork.artistName || artwork.artistAddress}
                      </p>
                    </div>
                    {artwork.price && (
                      <div className="pt-2">
                        <p className="text-sm font-medium">
                          <span className="text-muted-foreground">Price: </span>
                          <span className="font-mono" data-testid={`text-artwork-price-${index}`}>{artwork.price} ETH</span>
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
