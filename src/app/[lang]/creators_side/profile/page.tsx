"use client";

import { useState } from "react";
import { 
  User, 
  MapPin, 
  Link as LinkIcon, 
  Camera,
  Video,
  Trophy,
  Star,
  CheckCircle2,
  Edit,
  Eye,
  Heart
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'about'>('portfolio');

  const portfolio = [
    {
      id: 1,
      brand: "Nike",
      image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&auto=format&fit=crop&q=60",
      views: "1.2M",
      likes: "145K",
      platform: "TikTok"
    },
    {
      id: 2,
      brand: "Gymshark",
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&auto=format&fit=crop&q=60",
      views: "850K",
      likes: "92K",
      platform: "Instagram"
    },
    {
      id: 3,
      brand: "Sephora",
      image: "https://images.unsplash.com/photo-1512496115841-345028371387?w=500&auto=format&fit=crop&q=60",
      views: "420K",
      likes: "55K",
      platform: "Instagram"
    },
    {
      id: 4,
      brand: "Spotify",
      image: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=500&auto=format&fit=crop&q=60",
      views: "2.1M",
      likes: "320K",
      platform: "YouTube"
    }
  ];

  return (
    <div className="pb-12 max-w-[1200px] mx-auto">
      {/* Cover Image */}
      <div className="h-[280px] w-full bg-muted relative group rounded-b-3xl overflow-hidden shadow-sm">
        <Image 
          src="https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1200&auto=format&fit=crop&q=80"
          alt="Cover"
          fill
          className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <Button variant="outline" size="icon" className="absolute top-6 right-6 bg-white/50 hover:bg-white/90 backdrop-blur-md rounded-full shadow-sm text-foreground transition-all border border-white/40 opacity-0 group-hover:opacity-100">
          <Edit className="w-4 h-4" />
        </Button>
      </div>

      <div className="px-8 -mt-20 relative z-10 flex flex-col md:flex-row gap-10 items-start">
        {/* Left Column: Avatar & Info */}
        <div className="w-full md:w-[320px] shrink-0 space-y-6">
          
          <div className="relative w-36 h-36 rounded-[2rem] border-4 border-background overflow-hidden bg-white shadow-card group">
            <Image 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
              alt="Profile"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-sm">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="bg-white/90 shadow-card border border-border/40 rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-heading text-2xl font-bold text-foreground tracking-tight">Louenes B.</h1>
              <CheckCircle2 className="w-5 h-5 text-vybe" />
            </div>
            <p className="text-muted-foreground text-[13px] font-medium mb-5">Créateur Tech & Style de vie</p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[13px] text-foreground font-medium">
                <div className="w-8 h-8 rounded-xl bg-muted/50 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                </div>
                Algiers, Algeria
              </div>
              <div className="flex items-center gap-3 text-[13px] text-foreground font-medium">
                <div className="w-8 h-8 rounded-xl bg-muted/50 flex items-center justify-center">
                  <LinkIcon className="w-4 h-4 text-muted-foreground" />
                </div>
                <a href="#" className="hover:text-vybe transition-colors">linktr.ee/louenes</a>
              </div>
            </div>


          </div>
        </div>

        {/* Right Column: Stats & Content */}
        <div className="flex-1 space-y-8 pt-4 md:pt-20">
          
          {/* Highlight Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/90 shadow-card border border-border/40 rounded-3xl p-5 text-center">
              <p className="font-heading text-2xl font-bold text-foreground mb-1">845K</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-bold">Audience totale</p>
            </div>
            <div className="bg-white/90 shadow-card border border-border/40 rounded-3xl p-5 text-center">
              <p className="font-heading text-2xl font-bold text-foreground mb-1">11.2%</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-bold">Engagement moyen</p>
            </div>
            <div className="bg-white/90 shadow-card border border-border/40 rounded-3xl p-5 text-center">
              <p className="font-heading text-2xl font-bold text-foreground mb-1">42</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-bold">Campagnes</p>
            </div>
            <div className="bg-white/90 shadow-card border border-border/40 rounded-3xl p-5 text-center bg-gradient-to-br from-vybe/5 to-vybe-glow/5">
              <p className="font-heading text-2xl font-bold text-vybe-dark mb-1">4.9</p>
              <div className="flex items-center justify-center gap-1.5 mt-1">
                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                <p className="text-[10px] uppercase tracking-wider text-vybe-dark/70 font-bold">Évaluation</p>
              </div>
            </div>
          </div>

          {/* Main Content Tabs */}
          <div className="space-y-6">
            <div className="flex gap-2 border-b border-border/40">
              <button 
                onClick={() => setActiveTab('portfolio')}
                className={cn(
                  "px-6 pb-4 text-[13px] font-bold border-b-2 transition-colors",
                  activeTab === 'portfolio'
                    ? "border-vybe text-vybe-dark"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                Portfolio
              </button>
              <button 
                onClick={() => setActiveTab('about')}
                className={cn(
                  "px-6 pb-4 text-[13px] font-bold border-b-2 transition-colors",
                  activeTab === 'about'
                    ? "border-vybe text-vybe-dark"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                À propos de moi
              </button>
            </div>

            {activeTab === 'portfolio' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {portfolio.map((item) => (
                  <div key={item.id} className="group relative rounded-3xl overflow-hidden aspect-[4/5] bg-muted shadow-card hover:shadow-soft transition-all">
                    <Image 
                      src={item.image}
                      alt={item.brand}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <div className="absolute top-5 left-5">
                      <span className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-white/90 text-foreground backdrop-blur-md shadow-sm">
                        {item.brand}
                      </span>
                    </div>

                    <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end">
                      <div>
                        <p className="text-white font-bold text-[13px] mb-2 drop-shadow-md">{item.platform}</p>
                        <div className="flex items-center gap-4 text-[12px] font-semibold text-white/90">
                          <span className="flex items-center gap-1.5 drop-shadow-md"><Eye className="w-4 h-4" /> {item.views}</span>
                          <span className="flex items-center gap-1.5 drop-shadow-md"><Heart className="w-4 h-4 text-white" fill="white" /> {item.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/90 shadow-card border border-border/40 rounded-3xl p-6 md:p-8">
                <div className="max-w-none">
                  <h3 className="font-heading text-lg font-bold text-foreground mb-4">Biographie</h3>
                  <p className="text-muted-foreground leading-relaxed text-[14px] font-medium mb-8">
                    Salut ! Je suis Louenes, un créateur de contenu basé à Alger spécialisé dans la technologie, les gadgets et le style de vie. 
                    Je crée du contenu depuis plus de 3 ans, en me concentrant sur des critiques authentiques de haute qualité et des présentations 
                    esthétiques qui résonnent avec les publics de la génération Z et du millénaire.
                  </p>
                  
                  <h3 className="font-heading text-lg font-bold text-foreground mb-4">Niches</h3>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {['Technologie', 'Jeux vidéo', 'Style de vie', 'Mode', 'Photographie'].map((n) => (
                      <span key={n} className="px-3.5 py-1.5 rounded-xl bg-muted/40 border border-border/40 text-[12px] font-bold text-foreground">
                        {n}
                      </span>
                    ))}
                  </div>

                  <h3 className="font-heading text-lg font-bold text-foreground mb-4">Langues</h3>
                  <div className="flex flex-wrap gap-6">
                    <div className="text-[13px]">
                      <span className="text-foreground font-bold">Arabe</span>
                      <span className="text-muted-foreground font-medium ml-2">Maternelle</span>
                    </div>
                    <div className="text-[13px]">
                      <span className="text-foreground font-bold">Français</span>
                      <span className="text-muted-foreground font-medium ml-2">Courant</span>
                    </div>
                    <div className="text-[13px]">
                      <span className="text-foreground font-bold">Anglais</span>
                      <span className="text-muted-foreground font-medium ml-2">Courant</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
