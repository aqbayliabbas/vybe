"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/components/AuthProvider';
import { brandDetailsService, type BrandDetails } from '@/lib/db';
import { compressImage } from '@/lib/image-compression';
import { storageService } from '@/lib/storage';
import { toast } from 'sonner';
import { Loader2, Save, Upload } from 'lucide-react';

const industries = ['Food & Beverage', 'Beauty & Cosmetics', 'Tech & Telecom', 'Fashion', 'Sports', 'Retail', 'Healthcare', 'Education', 'Real Estate', 'Automotive', 'Travel & Tourism', 'Other'];
const sizes = ['1–10', '11–50', '51–200', '201–500', '500+'];
const countries = ['Algeria', 'Morocco', 'Tunisia', 'UAE', 'Saudi Arabia', 'Egypt', 'Qatar', 'Kuwait', 'Bahrain', 'Libya', 'Jordan', 'Lebanon', 'Other'];

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Brand Info
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [country, setCountry] = useState('');
  const [website, setWebsite] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  // Legal
  const [legalName, setLegalName] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [taxId, setTaxId] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [wilaya, setWilaya] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // Contact
  const [phone, setPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [facebook, setFacebook] = useState('');

  // Load brand details
  useEffect(() => {
    if (user) {
      brandDetailsService.getBrandDetails(user.id).then(details => {
        if (details) {
          setCompanyName(details.company_name || '');
          setIndustry(details.industry || '');
          setCompanySize(details.company_size || '');
          setCountry(details.country || '');
          setWebsite(details.website || '');
          setLogoUrl(details.company_logo_url || null);
          setLegalName(details.legal_name || '');
          setRegNumber(details.registration_number || '');
          setTaxId(details.tax_id || '');
          setAddress(details.legal_address || '');
          setCity(details.city || '');
          setWilaya(details.wilaya_state || '');
          setPostalCode(details.postal_code || '');
          setPhone(details.contact_phone || '');
          setContactEmail(details.contact_email || '');
          setInstagram(details.instagram_url || '');
          setTiktok(details.tiktok_url || '');
          setFacebook(details.facebook_url || '');
        }
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setLoading(false);
      });
    }
  }, [user]);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      // Compress selected image client-side using Canvas API
      const compressedBlob = await compressImage(file, {
        maxDimension: 600,
        quality: 0.82
      });

      // If an existing logo exists in storage, delete it first
      if (logoUrl) {
        try {
          await storageService.deleteBrandLogo(user.id, logoUrl);
        } catch (err) {
          console.warn('Failed to delete old logo from storage:', err);
        }
      }

      // Upload newly compressed image to Supabase storage
      const url = await storageService.uploadBrandLogo(user.id, compressedBlob);

      // Instantly update the database record
      await brandDetailsService.updateBrandDetails(user.id, {
        company_logo_url: url
      });

      setLogoUrl(url);
      toast.success('Brand logo uploaded and compressed successfully!');
    } catch (err: any) {
      console.error('Logo upload failed:', err);
      toast.error(err.message || 'Failed to upload brand logo.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveLogo = async () => {
    if (!logoUrl || !user) return;

    setUploading(true);
    try {
      // Delete the logo file from Supabase storage
      await storageService.deleteBrandLogo(user.id, logoUrl);

      // Instantly clear the database record
      await brandDetailsService.updateBrandDetails(user.id, {
        company_logo_url: null
      });

      setLogoUrl(null);
      toast.success('Brand logo removed.');
    } catch (err: any) {
      console.error('Logo deletion failed:', err);
      toast.error(err.message || 'Failed to remove brand logo.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    try {
      await brandDetailsService.updateBrandDetails(user.id, {
        company_name: companyName.trim() || null,
        industry: industry || null,
        company_size: companySize || null,
        country: country || null,
        website: website.trim() || null,
        company_logo_url: logoUrl,
        legal_name: legalName.trim() || null,
        registration_number: regNumber.trim() || null,
        tax_id: taxId.trim() || null,
        legal_address: address.trim() || null,
        city: city.trim() || null,
        wilaya_state: wilaya.trim() || null,
        postal_code: postalCode.trim() || null,
        contact_phone: phone.trim() || null,
        contact_email: contactEmail.trim() || null,
        instagram_url: instagram.trim() || null,
        tiktok_url: tiktok.trim() || null,
        facebook_url: facebook.trim() || null,
      });
      toast.success('Changes saved successfully!');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-vybe" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Brand Info */}
      <Section title="Brand profile" desc="How your brand appears across Vybe.">
        <div className="flex items-center gap-4">
          <input
            type="file"
            id="settings-logo-upload"
            accept="image/*"
            onChange={handleLogoChange}
            disabled={uploading || saving}
            className="hidden"
          />

          {uploading ? (
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border/40 bg-muted/20">
              <Loader2 className="h-5 w-5 text-vybe animate-spin" />
            </div>
          ) : logoUrl ? (
            <div className="h-16 w-16 rounded-2xl border border-border/40 overflow-hidden shadow-soft shrink-0">
              <img src={logoUrl} alt="Brand Logo" className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-vybe/25 to-vybe-glow/15 text-lg font-bold text-vybe-dark shadow-soft shrink-0">
              {companyName ? companyName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'VB'}
            </div>
          )}

          <div className="flex gap-2 items-center">
            <label
              htmlFor="settings-logo-upload"
              className={`inline-flex items-center justify-center rounded-full border border-border/60 bg-white/70 px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted/50 cursor-pointer shadow-soft transition-all duration-200 ${
                uploading || saving ? 'pointer-events-none opacity-50' : ''
              }`}
            >
              {uploading ? (
                <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin text-vybe" /> Uploading...</>
              ) : (
                <><Upload className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" /> Upload new</>
              )}
            </label>

            {logoUrl && !(uploading || saving) && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleRemoveLogo}
                className="rounded-full text-destructive hover:bg-destructive/10 text-xs px-4"
              >
                Remove
              </Button>
            )}
          </div>
        </div>
        <Field label="Company name" value={companyName} onChange={e => setCompanyName(e.target.value)} disabled={saving || uploading} />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-foreground">Industry</label>
            <Select value={industry} onValueChange={setIndustry} disabled={saving || uploading}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{industries.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-foreground">Company size</label>
            <Select value={companySize} onValueChange={setCompanySize} disabled={saving || uploading}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{sizes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-foreground">Country</label>
          <Select value={country} onValueChange={setCountry} disabled={saving || uploading}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>{countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <Field label="Website" value={website} onChange={e => setWebsite(e.target.value)} disabled={saving || uploading} placeholder="https://brand.com" />
      </Section>

      {/* Legal Info */}
      <Section title="Legal & official" desc="Business registration details used for verification and invoicing.">
        <Field label="Legal entity name" value={legalName} onChange={e => setLegalName(e.target.value)} disabled={saving || uploading} placeholder="e.g. SARL Pepsi Algeria" />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Registration number (RC)" value={regNumber} onChange={e => setRegNumber(e.target.value)} disabled={saving || uploading} placeholder="e.g. 16/00-123456" />
          <Field label="Tax ID (NIF)" value={taxId} onChange={e => setTaxId(e.target.value)} disabled={saving || uploading} placeholder="e.g. 001516012345678" />
        </div>
        <Field label="Street address" value={address} onChange={e => setAddress(e.target.value)} disabled={saving || uploading} placeholder="123 Rue Didouche Mourad" />
        <div className="grid grid-cols-3 gap-3">
          <Field label="City" value={city} onChange={e => setCity(e.target.value)} disabled={saving || uploading} placeholder="Algiers" />
          <Field label="Wilaya / State" value={wilaya} onChange={e => setWilaya(e.target.value)} disabled={saving || uploading} placeholder="Alger" />
          <Field label="Postal code" value={postalCode} onChange={e => setPostalCode(e.target.value)} disabled={saving || uploading} placeholder="16000" />
        </div>
      </Section>

      {/* Contact & Socials */}
      <Section title="Contact & socials" desc="How creators and our team can reach you.">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Business phone" value={phone} onChange={e => setPhone(e.target.value)} disabled={saving || uploading} placeholder="+213 555 12 34 56" />
          <Field label="Contact email" type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} disabled={saving || uploading} placeholder="contact@brand.com" />
        </div>
        <Field label="Instagram" value={instagram} onChange={e => setInstagram(e.target.value)} disabled={saving || uploading} placeholder="https://instagram.com/yourbrand" />
        <Field label="TikTok" value={tiktok} onChange={e => setTiktok(e.target.value)} disabled={saving || uploading} placeholder="https://tiktok.com/@yourbrand" />
        <Field label="Facebook" value={facebook} onChange={e => setFacebook(e.target.value)} disabled={saving || uploading} placeholder="https://facebook.com/yourbrand" />
      </Section>

      {/* Save bar */}
      <div className="flex justify-end gap-2 pb-4">
        <Button variant="ghost" className="rounded-full" disabled={saving || uploading}>Cancel</Button>
        <Button
          onClick={handleSave}
          disabled={saving || uploading}
          className="rounded-full bg-gradient-to-br from-vybe to-vybe-glow px-6 text-white gap-2"
        >
          {saving ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
          ) : (
            <><Save className="h-4 w-4" /> Save changes</>
          )}
        </Button>
      </div>
    </div>
  );
}

function Section({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-border/40 bg-white/90 p-6 shadow-card">
      <div className="mb-5">
        <h3 className="font-heading text-base font-semibold text-foreground">{title}</h3>
        <p className="text-[12px] text-muted-foreground">{desc}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-medium text-foreground">{label}</label>
      <Input {...props} className="rounded-2xl border-border/60 bg-white/70" />
    </div>
  );
}
