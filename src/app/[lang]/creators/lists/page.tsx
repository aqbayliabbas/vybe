"use client";

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Mail, 
  Users, 
  Bookmark, 
  Eye, 
  ChevronRight,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { db, CreatorList } from '@/lib/db';

// Custom formatters
const fmt = (n: number) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toLocaleString('en-US');
};

export default function CreatorListsPage() {
  const [lists, setLists] = useState<CreatorList[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeListId, setActiveListId] = useState<string>('');
  const [newListName, setNewListName] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadLists = async () => {
    try {
      const data = await db.getCreatorLists();
      setLists(data);
      if (data.length > 0 && !activeListId) {
        setActiveListId(data[0].id);
      }
    } catch (e) {
      console.error('Failed to load creator lists', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLists();
  }, []);

  const activeList = lists.find(l => l.id === activeListId) || lists[0] || null;

  // Aggregate stats for active list
  const aggregateStats = useMemo(() => {
    if (!activeList || activeList.creators.length === 0) return { followers: 0, views: 0, engagement: 0 };
    const followers = activeList.creators.reduce((sum, c) => sum + c.followers, 0);
    const views = activeList.creators.reduce((sum, c) => sum + c.avgViews, 0);
    const engagement = activeList.creators.reduce((sum, c) => sum + c.engagement, 0) / activeList.creators.length;
    return { followers, views, engagement };
  }, [activeList]);

  const handleCreateList = async () => {
    if (!newListName.trim()) return;
    setCreating(true);
    try {
      const newList = await db.createCreatorList(newListName.trim());
      setLists(prev => [...prev, newList]);
      setActiveListId(newList.id);
      setNewListName('');
      setShowCreateModal(false);
      toast.success("Liste créée !", {
        description: `La nouvelle liste vide '${newList.name}' a été ajoutée.`,
      });
    } catch (e) {
      console.error(e);
      toast.error("Échec de la création de la liste.");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteList = async (id: string, name: string) => {
    setDeleting(id);
    try {
      await db.deleteCreatorList(id);
      const remaining = lists.filter(l => l.id !== id);
      setLists(remaining);
      toast.error("Liste supprimée", {
        description: `'${name}' a été supprimée.`,
      });
      if (remaining.length > 0) {
        setActiveListId(remaining[0].id);
      } else {
        setActiveListId('');
      }
    } catch (e) {
      console.error(e);
      toast.error("Échec de la suppression de la liste.");
    } finally {
      setDeleting(null);
    }
  };

  const handleRemoveCreatorFromList = async (creatorId: string, creatorName: string) => {
    if (!activeList) return;
    try {
      await db.removeCreatorFromList(activeList.id, creatorId);
      setLists(prev => prev.map(l => {
        if (l.id === activeList.id) {
          return {
            ...l,
            creators: l.creators.filter(c => c.id !== creatorId)
          };
        }
        return l;
      }));
      toast.info("Créateur supprimé", {
        description: `${creatorName} supprimé de la liste.`,
      });
    } catch (e) {
      console.error(e);
      toast.error("Échec de la suppression du créateur.");
    }
  };

  const handleBulkInvite = () => {
    if (!activeList) return;
    toast.success("Invitations en masse envoyées !", {
      description: `Invitations à la campagne envoyées aux ${activeList.creators.length} créateurs de cette liste.`,
    });
  };

  const engagementLabel = (eng: number) => {
    if (eng >= 5) return 'Excellent';
    if (eng >= 3.5) return 'Bon';
    if (eng >= 2) return 'Moyen';
    return 'Faible';
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Link href="/creators" className="inline-flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Retour à la recherche de créateurs
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60">Collections</p>
            <h1 className="font-heading mt-2 text-[28px] font-bold tracking-tight text-foreground md:text-[34px]">Listes de créateurs sauvegardées</h1>
            <p className="mt-1 text-[13px] text-muted-foreground">Organisez les créateurs en segments et invitez-les en masse.</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)} className="h-10 gap-1.5 rounded-full bg-gradient-to-br from-vybe to-vybe-glow px-5 text-[13px] text-white shadow-soft font-semibold">
            <Plus className="h-4 w-4" /> Créer une liste
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-2 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-vybe" />
          <p className="text-xs">Chargement de vos listes...</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Lists Sidebar */}
          <div className="space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2">Vos listes ({lists.length})</p>
            
            <div className="flex flex-col gap-2">
              {lists.map(list => (
                <button
                  key={list.id}
                  onClick={() => setActiveListId(list.id)}
                  className={`w-full text-left rounded-2xl p-4 transition-all border ${
                    activeListId === list.id
                      ? 'border-vybe/30 bg-vybe/[0.04] text-vybe-dark shadow-sm'
                      : 'border-border/40 bg-white/90 hover:bg-muted/50 text-foreground'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <h4 className="font-heading text-sm font-semibold truncate max-w-[160px]">{list.name}</h4>
                    <span className="rounded-full bg-muted/70 px-2 py-0.5 text-[10px] font-medium text-muted-foreground/90 shrink-0">
                      {list.creators.length}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2">Créée le {list.created}</p>
                </button>
              ))}

              {lists.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border/60 p-6 text-center">
                  <Bookmark className="mx-auto mb-2 h-6 w-6 text-muted-foreground/30" />
                  <p className="text-[12px] text-muted-foreground">Aucune liste pour le moment</p>
                </div>
              )}
            </div>
          </div>

          {/* List Details Panel */}
          {activeList ? (
            <div className="space-y-6">
              {/* List Stats & Actions */}
              <div className="rounded-3xl border border-border/40 bg-white/90 p-6 shadow-card">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/30 pb-5">
                  <div>
                    <h2 className="font-heading text-xl font-bold text-foreground">{activeList.name}</h2>
                    <p className="text-[12px] text-muted-foreground mt-1">Contient {activeList.creators.length} créateurs sélectionnés.</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleBulkInvite}
                      disabled={activeList.creators.length === 0}
                      className="rounded-full gap-1.5 bg-gradient-to-br from-vybe to-vybe-glow text-white shadow-soft text-[12px]"
                    >
                      <Mail className="h-3.5 w-3.5" /> Inviter la liste en masse
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleDeleteList(activeList.id, activeList.name)}
                      disabled={deleting === activeList.id}
                      className="rounded-full gap-1.5 border-destructive/20 text-destructive hover:bg-destructive/5 text-[12px]"
                    >
                      {deleting === activeList.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                      Supprimer
                    </Button>
                  </div>
                </div>

                {/* Stats overview */}
                <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="rounded-2xl bg-muted/30 p-3.5 border border-border/20">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1"><Users className="h-3.5 w-3.5" /> Portée globale</p>
                    <p className="font-heading text-lg font-bold text-foreground mt-1">{fmt(aggregateStats.followers)}</p>
                  </div>
                  <div className="rounded-2xl bg-muted/30 p-3.5 border border-border/20">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> Vues moy. collectives</p>
                    <p className="font-heading text-lg font-bold text-foreground mt-1">{fmt(aggregateStats.views)}</p>
                  </div>
                  <div className="rounded-2xl bg-muted/30 p-3.5 border border-border/20 col-span-2 sm:col-span-1">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1"><TrendingUp className="h-3.5 w-3.5" /> Force d'engagement</p>
                    <p className={`font-heading text-lg font-bold mt-1 ${aggregateStats.engagement >= 4 ? 'text-success' : aggregateStats.engagement >= 2 ? 'text-warning-foreground' : 'text-muted-foreground'}`}>
                      {activeList.creators.length === 0 ? '—' : `${engagementLabel(aggregateStats.engagement)} (${aggregateStats.engagement.toFixed(1)}%)`}
                    </p>
                  </div>
                </div>
              </div>

              {/* List Members Table */}
              <div className="rounded-3xl border border-border/40 bg-white/90 shadow-card overflow-hidden">
                <div className="px-6 py-5 border-b border-border/30">
                  <h3 className="font-heading text-sm font-semibold text-foreground">Membres de la liste</h3>
                </div>

                <div className="divide-y divide-border/30">
                  {activeList.creators.map(c => (
                    <div key={c.id} className="flex flex-wrap items-center gap-4 px-6 py-4 hover:bg-vybe/[0.01] transition-colors">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-vybe/15 to-vybe-glow/10 text-sm font-bold text-vybe-dark shrink-0">
                          {c.avatar}
                        </div>
                        <div className="min-w-0">
                          <Link href={`/creators/${c.id}`} className="font-heading text-[13px] font-bold text-foreground hover:text-vybe-dark truncate block">
                            {c.name}
                          </Link>
                          <p className="text-[11px] text-muted-foreground truncate">{c.handle}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-[11px] sm:text-xs">
                        <div className="text-center"><p className="font-semibold text-foreground">{fmt(c.followers)}</p><p className="text-muted-foreground text-[10px]">abonnés</p></div>
                        <div className="text-center"><p className="font-semibold text-foreground">{fmt(c.avgViews)}</p><p className="text-muted-foreground text-[10px]">vues moy.</p></div>
                        <div className="text-center"><p className="font-semibold text-foreground">{c.location}</p><p className="text-muted-foreground text-[10px]">ville</p></div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link href={`/creators/${c.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 rounded-full px-2 text-vybe-dark hover:bg-vybe/10 gap-1 text-[11px]">
                            Profil <ChevronRight className="h-3 w-3" />
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleRemoveCreatorFromList(c.id, c.name)}
                          className="h-8 w-8 rounded-full border-border/60 text-muted-foreground hover:text-destructive hover:bg-destructive/5 p-0"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {activeList.creators.length === 0 && (
                    <div className="px-6 py-16 text-center">
                      <Users className="mx-auto mb-3 h-8 w-8 text-muted-foreground/30" />
                      <p className="text-[13px] font-medium text-foreground">La liste est vide</p>
                      <p className="text-[12px] text-muted-foreground mt-1">Ajoutez des créateurs depuis l'annuaire de recherche.</p>
                      <Link href="/creators" className="mt-4 inline-block">
                        <Button size="sm" className="rounded-full text-[12px]">Rechercher des créateurs</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-border/40 bg-white/90 p-12 text-center shadow-card">
              <Bookmark className="mx-auto mb-3 h-8 w-8 text-muted-foreground/30" />
              <p className="text-[13px] font-medium text-foreground">Aucune liste créée pour le moment</p>
              <p className="text-[12px] text-muted-foreground mt-1">Commencez par créer un nouveau segment.</p>
              <Button onClick={() => setShowCreateModal(true)} className="mt-4 rounded-full gap-1.5 bg-gradient-to-br from-vybe to-vybe-glow text-white text-[12px]">
                <Plus className="h-3.5 w-3.5" /> Créez votre première liste
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Create List Modal Dialog */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-[400px] rounded-3xl border border-border/45 bg-white p-6 shadow-elevated">
            <h3 className="font-heading text-[16px] font-bold text-foreground">Créer une collection de créateurs</h3>
            <p className="text-[12px] text-muted-foreground mt-1">Regroupez vos influenceurs cibles pour un suivi et des campagnes rapides.</p>
            
            <input 
              value={newListName}
              onChange={e => setNewListName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreateList()}
              placeholder="ex. Vloggers Culinaire Alger"
              className="w-full h-11 border border-border/60 rounded-2xl bg-white px-3 mt-4 text-[13px] outline-none focus:border-vybe/40"
              autoFocus
            />

            <div className="flex gap-2 justify-end mt-6">
              <Button variant="ghost" className="rounded-full text-[12px]" onClick={() => { setShowCreateModal(false); setNewListName(''); }}>
                Annuler
              </Button>
              <Button 
                onClick={handleCreateList} 
                disabled={!newListName.trim() || creating} 
                className="rounded-full bg-gradient-to-br from-vybe to-vybe-glow text-white shadow-soft text-[12px] px-5 font-semibold gap-1.5"
              >
                {creating && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Créer la collection
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
