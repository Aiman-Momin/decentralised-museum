import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ArrowRight, Sparkles, Users, Palette } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import heroImage from '@assets/generated_images/Museum_gallery_hero_background_03dcf113.png';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Hero Background with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Modern art gallery interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-background" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-8 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge
              variant="outline"
              className="mb-6 bg-background/20 backdrop-blur-md border-white/20 text-white"
              data-testid="badge-live-exhibitions"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Live Exhibitions on Blockchain
            </Badge>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif font-semibold tracking-tight mb-6 text-white">
              Decentralized Museum
            </h1>

            <p className="text-2xl md:text-3xl font-serif text-white/90 mb-8">
              Where Culture Meets Blockchain
            </p>

            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-12 leading-relaxed">
              A revolutionary platform bringing art, culture, and blockchain together.
              Artists mint NFTs, visitors explore the virtual museum, and DAO members shape the future of cultural exhibitions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/gallery">
                <Button
                  size="lg"
                  className="text-base px-8 py-6 gap-2"
                  data-testid="button-enter-museum"
                >
                  Enter Museum
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/artist">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base px-8 py-6 bg-background/20 backdrop-blur-md border-white/20 text-white hover:bg-background/30"
                  data-testid="button-artist-portal"
                >
                  Artist Portal
                </Button>
              </Link>
              <Link href="/dao">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base px-8 py-6 bg-background/20 backdrop-blur-md border-white/20 text-white hover:bg-background/30"
                  data-testid="button-join-dao"
                >
                  Join DAO
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-medium mb-6">
              Experience the Future of Art
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore a decentralized ecosystem where artists, collectors, and cultural enthusiasts converge on the blockchain.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                icon: Palette,
                title: 'Mint Your Art',
                description: 'Artists can upload artwork, store it on IPFS, and mint unique NFTs with built-in royalty tracking.',
                testId: 'card-feature-mint'
              },
              {
                icon: Sparkles,
                title: 'Virtual Gallery',
                description: 'Explore a curated collection of blockchain-verified artworks in our immersive digital museum.',
                testId: 'card-feature-gallery'
              },
              {
                icon: Users,
                title: 'DAO Governance',
                description: 'Join the community and vote on which exhibits and events shape the museum\'s future.',
                testId: 'card-feature-dao'
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
                data-testid={feature.testId}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-serif font-medium mb-4">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
