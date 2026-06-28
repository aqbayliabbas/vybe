import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, whatsapp, platform, pseudo } = body as {
      fullName?: string;
      whatsapp?: string;
      platform?: string;
      pseudo?: string;
    };

    if (!fullName || fullName.trim().length < 2) {
      return NextResponse.json({ error: 'Veuillez entrer votre nom complet.' }, { status: 400 });
    }
    if (!whatsapp || whatsapp.trim().length < 6) {
      return NextResponse.json({ error: 'Veuillez entrer un numéro WhatsApp valide.' }, { status: 400 });
    }
    if (!pseudo || pseudo.trim().length < 2) {
      return NextResponse.json({ error: 'Veuillez entrer votre pseudo.' }, { status: 400 });
    }
    if (platform !== 'instagram' && platform !== 'tiktok') {
      return NextResponse.json({ error: 'Veuillez sélectionner une plateforme valide.' }, { status: 400 });
    }

    const cleanFullName = fullName.trim();
    const cleanWhatsapp = whatsapp.trim();
    const cleanPseudo = pseudo.trim().replace(/^@/, '');

    // ── Insert into Supabase ───────────────────────────────────────────────
    const { error: insertError } = await supabase
      .from('waitlist')
      .insert([
        {
          full_name: cleanFullName,
          whatsapp: cleanWhatsapp,
          platform: platform,
          pseudo: cleanPseudo
        }
      ]);

    if (insertError) {
      console.error('[waitlist] Supabase insert error:', insertError);
      return NextResponse.json({ error: 'Erreur lors de l\'inscription. Veuillez réessayer.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[waitlist] Unexpected error:', err);
    return NextResponse.json({ error: 'Erreur serveur interne.' }, { status: 500 });
  }
}
