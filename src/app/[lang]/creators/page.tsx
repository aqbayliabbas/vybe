"use client";

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Plus, 
  ChevronRight, 
  Bookmark, 
  Send,
  SlidersHorizontal,
  BadgeCheck,
  Users,
  Loader2,
  Check,
  X
} from 'lucide-react';
import { MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { db, CreatorList, Creator } from '@/lib/db';

// Custom formatters
const fmt = (n: number) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toLocaleString('en-US');
};

export default function CreatorDatabasePage() {
  // Search & Filter state
  const [query, setQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'dz' | 'gulf' | 'other'>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'TikTok' | 'Instagram' | 'YouTube'>('all');
  const [selectedNiche, setSelectedNiche] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Save to list modal state
  const [saveModalCreatorId, setSaveModalCreatorId] = useState<string | null>(null);
  const [saveModalCreatorName, setSaveModalCreatorName] = useState<string>('');
  const [lists, setLists] = useState<CreatorList[]>([]);
  const [listsLoading, setListsLoading] = useState(false);
  const [savingToListId, setSavingToListId] = useState<string | null>(null);
  const [savedToListIds, setSavedToListIds] = useState<string[]>([]);
  const [newListName, setNewListName] = useState('');
  const [creatingList, setCreatingList] = useState(false);
  const [showNewListInput, setShowNewListInput] = useState(false);

  // Creators data state
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loadingCreators, setLoadingCreators] = useState(true);

  useEffect(() => {
    db.getCreators().then(data => {
      setCreators(data);
      setLoadingCreators(false);
    }).catch(err => {
      console.error(err);
      setLoadingCreators(false);
    });
  }, []);

  const filteredCreators = useMemo(() => {
    return creators.filter(c => {
      // Search text
      if (query && !`${c.name} ${c.handle} ${c.location}`.toLowerCase().includes(query.toLowerCase())) return false;
      
      // Region
      if (selectedRegion === 'dz' && c.flag !== '🇩🇿') return false;
      if (selectedRegion === 'gulf' && c.flag === '🇩🇿') return false;
      
      // Platform
      if (selectedPlatform !== 'all' && c.platform !== selectedPlatform) return false;
      
      // Niche
      if (selectedNiche !== 'all' && c.niche !== selectedNiche) return false;
      
      // Verified only
      if (verifiedOnly && !c.verified) return false;

      // Size
      if (selectedSize !== 'all') {
        if (selectedSize === 'nano' && c.followers > 50000) return false;
        if (selectedSize === 'micro' && (c.followers <= 50000 || c.followers > 150000)) return false;
        if (selectedSize === 'macro' && c.followers <= 150000) return false;
      }
      
      return true;
    });
  }, [creators, query, selectedRegion, selectedPlatform, selectedNiche, selectedSize, verifiedOnly]);

  const openSaveModal = async (creatorId: string, creatorName: string) => {
    setSaveModalCreatorId(creatorId);
    setSaveModalCreatorName(creatorName);
    setSavedToListIds([]);
    setShowNewListInput(false);
    setNewListName('');
    setListsLoading(true);
    try {
      const data = await db.getCreatorLists();
      setLists(data);
      // Mark which lists already contain this creator
      const alreadyIn = data
        .filter(l => l.creators.some(c => c.id === creatorId))
        .map(l => l.id);
      setSavedToListIds(alreadyIn);
    } catch (e) {
      console.error(e);
      toast.error("Échec du chargement des listes.");
    } finally {
      setListsLoading(false);
    }
  };

  const closeSaveModal = () => {
    setSaveModalCreatorId(null);
    setSaveModalCreatorName('');
    setLists([]);
    setShowNewListInput(false);
    setNewListName('');
  };

  const handleSaveToList = async (listId: string, listName: string) => {
    if (savedToListIds.includes(listId)) return; // already saved
    setSavingToListId(listId);
    try {
      await db.addCreatorToList(listId, saveModalCreatorId!);
      setSavedToListIds(prev => [...prev, listId]);
      toast.success(`Enregistré dans "${listName}"`, {
        description: `${saveModalCreatorName} a été ajouté à votre liste.`,
      });
    } catch (e) {
      console.error(e);
      toast.error("Échec de l'enregistrement du créateur dans la liste.");
    } finally {
      setSavingToListId(null);
    }
  };

  const handleCreateAndSave = async () => {
    if (!newListName.trim()) return;
    setCreatingList(true);
    try {
      const newList = await db.createCreatorList(newListName.trim());
      await db.addCreatorToList(newList.id, saveModalCreatorId!);
      setLists(prev => [...prev, { ...newList, creators: [] }]);
      setSavedToListIds(prev => [...prev, newList.id]);
      setNewListName('');
      setShowNewListInput(false);
      toast.success(`Créé et enregistré dans "${newList.name}"`, {
        description: `${saveModalCreatorName} a été ajouté à votre nouvelle liste.`,
      });
    } catch (e) {
      console.error(e);
      toast.error("Échec de la création de la liste.");
    } finally {
      setCreatingList(false);
    }
  };

  const handleInviteToDeal = (creatorName: string) => {
    toast.success("Invitation envoyée", {
      description: `Invitation à la campagne envoyée à ${creatorName}.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60">Annuaire</p>
          <h1 className="font-heading mt-2 text-[28px] font-bold tracking-tight text-foreground md:text-[34px]">Base de données des créateurs</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">Trouvez des créateurs de contenu vérifiés à travers l'Algérie et la région MENA.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/creators/lists">
            <Button variant="outline" className="h-10 gap-1.5 rounded-full border-border/60 bg-white/70 px-4 text-[13px]">
              <Bookmark className="h-4 w-4" /> Listes sauvegardées
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Left Column: Filters */}
        <div className="space-y-5 rounded-3xl border border-border/40 bg-white/90 p-5 shadow-card h-fit">
          <div className="flex items-center gap-2 font-heading text-sm font-semibold text-foreground border-b border-border/30 pb-3">
            <SlidersHorizontal className="h-4 w-4 text-vybe" /> Filtres
          </div>

          {/* Region */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Région</label>
            <div className="flex flex-col gap-1.5">
              {[
                { key: 'all', label: 'Toutes les régions' },
                { key: 'dz', label: 'Algérie 🇩🇿' },
                { key: 'gulf', label: 'Golfe (CCG) 🇦🇪' },
              ].map(r => (
                <button
                  key={r.key}
                  onClick={() => setSelectedRegion(r.key as any)}
                  className={`text-left text-[12px] font-medium rounded-xl px-2.5 py-1.5 transition-colors ${
                    selectedRegion === r.key 
                      ? 'bg-vybe/15 text-vybe-dark' 
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Platforms */}
          <div className="space-y-2 border-t border-border/30 pt-4">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Plateforme</label>
            <div className="flex flex-col gap-1.5">
              {['all', 'TikTok', 'Instagram', 'YouTube'].map(p => (
                <button
                  key={p}
                  onClick={() => setSelectedPlatform(p as any)}
                  className={`text-left text-[12px] font-medium rounded-xl px-2.5 py-1.5 transition-colors capitalize ${
                    selectedPlatform === p 
                      ? 'bg-vybe/15 text-vybe-dark' 
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  }`}
                >
                  {p === 'all' ? 'Toutes les plateformes' : p}
                </button>
              ))}
            </div>
          </div>

          {/* Niches */}
          <div className="space-y-2 border-t border-border/30 pt-4">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Niche</label>
            <select
              value={selectedNiche}
              onChange={e => setSelectedNiche(e.target.value)}
              className="w-full text-[12px] font-medium border border-border/60 bg-white rounded-xl p-2.5 focus:border-vybe/40 focus:bg-white outline-none"
            >
              <option value="all">Toutes les niches</option>
              <option value="Beauty">Beauté</option>
              <option value="Fashion">Mode</option>
              <option value="Tech">Tech</option>
              <option value="Food">Cuisine</option>
              <option value="Travel">Voyage</option>
              <option value="Comedy">Comédie</option>
              <option value="Sports">Sport</option>
            </select>
          </div>

          {/* Creator Size */}
          <div className="space-y-2 border-t border-border/30 pt-4">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Taille de l'audience</label>
            <select
              value={selectedSize}
              onChange={e => setSelectedSize(e.target.value)}
              className="w-full text-[12px] font-medium border border-border/60 bg-white rounded-xl p-2.5 focus:border-vybe/40 focus:bg-white outline-none"
            >
              <option value="all">Toutes tailles</option>
              <option value="nano">Nano (10K - 50K)</option>
              <option value="micro">Micro (50K - 150K)</option>
              <option value="macro">Macro (150K+)</option>
            </select>
          </div>

          {/* Verified Checkbox */}
          <div className="flex items-center gap-2 border-t border-border/30 pt-4">
            <input 
              type="checkbox"
              id="verifiedOnly"
              checked={verifiedOnly}
              onChange={e => setVerifiedOnly(e.target.checked)}
              className="rounded border-border/60 text-vybe focus:ring-vybe h-3.5 w-3.5 cursor-pointer"
            />
            <label htmlFor="verifiedOnly" className="text-[12px] font-medium text-foreground cursor-pointer select-none">
              Vérifié par Phyllo uniquement
            </label>
          </div>
        </div>

        {/* Right Column: Search + Grid */}
        <div className="space-y-6">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
            <input 
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Rechercher un nom de créateur, pseudonyme ou emplacement..."
              className="w-full h-12 rounded-full border border-border/40 bg-white/90 pl-11 pr-4 text-[13px] outline-none shadow-card focus:border-vybe/40 focus:bg-white"
            />
          </div>

          {loadingCreators ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin text-vybe mb-2" />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredCreators.map(c => (
              <div 
                key={c.id}
                className="group relative overflow-hidden rounded-3xl border border-border/40 bg-white/90 p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-muted/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {c.niche}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-semibold">
                    <span>{c.flag}</span>
                    <span>{c.platform}</span>
                  </div>
                </div>

                {/* Avatar and Name */}
                <div className="mt-4 flex items-center gap-3">
                  <Link href={`/creators/${c.id}`} className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-border/50 shadow-sm transition-transform group-hover:scale-105">
                    {c.avatar.startsWith('http') ? (
                      <img src={c.avatar} alt={c.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-vybe/15 to-vybe-glow/10 text-lg font-bold text-vybe-dark">
                        {c.avatar || c.name.charAt(0)}
                      </div>
                    )}
                  </Link>
                  <div className="min-w-0">
                    <Link href={`/creators/${c.id}`} className="flex items-center gap-1 group-hover:text-vybe-dark transition-colors">
                      <h4 className="font-heading text-[13px] font-bold text-foreground truncate">{c.name}</h4>
                      {c.verified && <BadgeCheck className="h-3.5 w-3.5 text-success fill-success/15 shrink-0" />}
                    </Link>
                    <p className="text-[11px] text-muted-foreground truncate">{c.handle}</p>
                  </div>
                </div>

                {/* Info strip */}
                <div className="mt-4 text-[11px] text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground/60" /> {c.location}
                </div>

                {/* Stats */}
                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border/30 pt-3 text-center">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Abonnés</p>
                    <p className="font-heading text-xs font-bold text-foreground mt-0.5">{fmt(c.followers)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Vues moy.</p>
                    <p className="font-heading text-xs font-bold text-foreground mt-0.5">{fmt(c.avgViews)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Taux d'eng.</p>
                    <p className="font-heading text-xs font-bold text-foreground mt-0.5">{c.engagement}%</p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => openSaveModal(c.id, c.name)}
                    className="h-8 rounded-full border-border/60 text-[11px] font-medium text-muted-foreground hover:text-foreground gap-1"
                  >
                    <Bookmark className="h-3 w-3" /> Enregistrer
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => handleInviteToDeal(c.name)}
                    className="h-8 rounded-full bg-gradient-to-br from-vybe to-vybe-glow text-white text-[11px] font-medium shadow-card gap-1"
                  >
                    <Send className="h-3 w-3" /> Inviter
                  </Button>
                </div>
              </div>
            ))}
          {filteredCreators.length === 0 && (
            <div className="col-span-full py-16 text-center">
              <Users className="mx-auto mb-3 h-8 w-8 text-muted-foreground/40" />
              <p className="text-[13px] font-medium text-foreground">Aucun créateur correspondant trouvé</p>
              <p className="text-[12px] text-muted-foreground">Essayez d'élargir vos termes de recherche ou la sélection des filtres.</p>
            </div>
          )}
        </div>
      )}
        </div>
      </div>

      {/* Save to List Modal */}
      {saveModalCreatorId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-[420px] rounded-3xl border border-border/45 bg-white p-6 shadow-elevated">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-heading text-[16px] font-bold text-foreground">Enregistrer dans la liste</h3>
                <p className="text-[12px] text-muted-foreground mt-0.5">Ajouter <span className="font-medium text-foreground">{saveModalCreatorName}</span> à une collection.</p>
              </div>
              <button onClick={closeSaveModal} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted/60 transition-colors border-0 bg-transparent cursor-pointer">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* Lists */}
            {listsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-vybe" />
              </div>
            ) : (
              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {lists.map(list => {
                  const isSaved = savedToListIds.includes(list.id);
                  const isSaving = savingToListId === list.id;
                  return (
                    <button
                      key={list.id}
                      onClick={() => !isSaved && handleSaveToList(list.id, list.name)}
                      disabled={isSaved || isSaving}
                      className={`w-full flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all cursor-pointer ${
                        isSaved 
                          ? 'border-success/30 bg-success/5 cursor-default' 
                          : 'border-border/50 bg-white hover:border-vybe/30 hover:bg-vybe/[0.02]'
                      }`}
                    >
                      <div>
                        <p className={`text-[13px] font-semibold ${isSaved ? 'text-success' : 'text-foreground'}`}>{list.name}</p>
                        <p className="text-[11px] text-muted-foreground">{list.creators.length} créateur{list.creators.length !== 1 ? 's' : ''}</p>
                      </div>
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 animate-spin text-vybe" />
                      ) : isSaved ? (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success/15">
                          <Check className="h-3 w-3 text-success" />
                        </span>
                      ) : (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border/60">
                          <Plus className="h-3 w-3 text-muted-foreground" />
                        </span>
                      )}
                    </button>
                  );
                })}

                {lists.length === 0 && !showNewListInput && (
                  <div className="py-6 text-center">
                    <Bookmark className="mx-auto mb-2 h-6 w-6 text-muted-foreground/30" />
                    <p className="text-[12px] text-muted-foreground">Aucune liste pour le moment. Créez-en une ci-dessous.</p>
                  </div>
                )}
              </div>
            )}

            {/* New list input */}
            {showNewListInput ? (
              <div className="mt-3 flex gap-2">
                <input
                  autoFocus
                  value={newListName}
                  onChange={e => setNewListName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreateAndSave()}
                  placeholder="Nom de la nouvelle liste…"
                  className="flex-1 h-9 border border-border/60 rounded-xl bg-white px-3 text-[12px] outline-none focus:border-vybe/40"
                />
                <Button
                  size="sm"
                  onClick={handleCreateAndSave}
                  disabled={!newListName.trim() || creatingList}
                  className="h-9 rounded-xl bg-gradient-to-br from-vybe to-vybe-glow text-white text-[12px] px-4 gap-1 font-semibold"
                >
                  {creatingList ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                  Enregistrer
                </Button>
                <button onClick={() => { setShowNewListInput(false); setNewListName(''); }} className="h-9 w-9 flex items-center justify-center rounded-xl border border-border/60 hover:bg-muted/50 transition-colors cursor-pointer bg-transparent border-0">
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowNewListInput(true)}
                className="mt-3 w-full flex items-center gap-2 rounded-2xl border border-dashed border-border/60 px-4 py-2.5 text-[12px] font-medium text-muted-foreground hover:border-vybe/40 hover:text-vybe-dark hover:bg-vybe/[0.02] transition-all cursor-pointer bg-transparent"
              >
                <Plus className="h-4 w-4" /> Créer une nouvelle liste
              </button>
            )}

            <div className="mt-5 flex justify-between items-center border-t border-border/30 pt-4">
              <Link href="/creators/lists" onClick={closeSaveModal} className="text-[12px] text-vybe-dark font-medium hover:underline flex items-center gap-1">
                Gérer les listes <ChevronRight className="h-3.5 w-3.5" />
              </Link>
              <Button variant="ghost" onClick={closeSaveModal} className="rounded-full text-[12px] text-muted-foreground h-8 px-4">
                Terminé
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
