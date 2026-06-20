"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link as LinkIcon, MessageSquare, Loader2, CheckCircle2, DollarSign } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { db } from "@/lib/db";

interface ApplyDealModalProps {
  dealId: string;
  dealName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ApplyDealModal({ dealId, dealName, isOpen, onClose, onSuccess }: ApplyDealModalProps) {
  const { user } = useAuth();
  const [videoUrl, setVideoUrl] = useState("");
  const [proposal, setProposal] = useState("");
  const [proposedBid, setProposedBid] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl) {
      setError("Le lien de la vidéo est requis.");
      return;
    }
    if (!user) {
      setError("Vous devez être connecté pour postuler.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await db.applyForDeal(dealId, user.id, videoUrl, proposal, Number(proposedBid) || 0);
      setIsSuccess(true);
      if (onSuccess) {
        setTimeout(() => onSuccess(), 2000);
      }
    } catch (err: any) {
      console.error("Failed to apply:", err);
      setError(err.message || "Une erreur est survenue lors de la soumission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset state on close
    setTimeout(() => {
      setVideoUrl("");
      setProposal("");
      setProposedBid("");
      setIsSuccess(false);
      setError("");
    }, 300);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white/95 backdrop-blur-xl border-border/40 rounded-[2rem] shadow-[0_20px_60px_-15px_oklch(0.72_0.14_300_/_0.3)]">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-vybe/10 to-vybe-glow/10 -z-10" />
        
        {isSuccess ? (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 text-success-foreground" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-foreground">Candidature Envoyée !</h2>
            <p className="text-[14px] text-muted-foreground">
              Votre vidéo a été soumise avec succès pour <strong>{dealName}</strong>. La marque vous répondra bientôt.
            </p>
            <Button onClick={handleClose} className="mt-6 h-11 px-8 rounded-full bg-gradient-to-r from-vybe to-vybe-glow text-white">
              Fermer
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col">
            <DialogHeader className="p-8 pb-4">
              <DialogTitle className="font-heading text-2xl font-bold text-foreground">Postuler à l'offre</DialogTitle>
              <DialogDescription className="text-[14px]">
                Soumettez votre candidature pour <strong>{dealName}</strong> en partageant le lien de votre vidéo.
              </DialogDescription>
            </DialogHeader>

            <div className="p-8 pt-2 space-y-6">
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-[13px] rounded-xl">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <Label htmlFor="videoUrl" className="text-[13px] font-semibold flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-vybe" />
                  Lien de la vidéo (TikTok, Instagram, YouTube) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="videoUrl"
                  type="url"
                  placeholder="https://www.tiktok.com/@..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="h-12 rounded-xl bg-muted/30 border-border/50 focus-visible:ring-vybe"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="proposedBid" className="text-[13px] font-semibold flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-vybe" />
                  Votre tarif proposé (DZD)
                </Label>
                <Input
                  id="proposedBid"
                  type="number"
                  min="0"
                  placeholder="Ex: 5000"
                  value={proposedBid}
                  onChange={(e) => setProposedBid(e.target.value)}
                  className="h-12 rounded-xl bg-muted/30 border-border/50 focus-visible:ring-vybe"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="proposal" className="text-[13px] font-semibold flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-vybe" />
                  Message pour la marque (Optionnel)
                </Label>
                <Textarea
                  id="proposal"
                  placeholder="Expliquez pourquoi votre contenu correspond à leurs attentes..."
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                  className="min-h-[120px] rounded-xl bg-muted/30 border-border/50 focus-visible:ring-vybe resize-none"
                />
              </div>
            </div>

            <DialogFooter className="p-8 pt-4 bg-muted/10 border-t border-border/40">
              <Button type="button" variant="ghost" onClick={handleClose} className="rounded-xl h-11">
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="rounded-xl h-11 px-8 bg-gradient-to-r from-vybe to-vybe-glow text-white shadow-md hover:shadow-lg transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  "Soumettre"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
