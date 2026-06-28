import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { VybeLogo } from '@/components/VybeLogo';
import { getDictionary, Locale } from '../dictionaries';

export const metadata: Metadata = {
  title: 'Terms of Service - Vybe',
  description: 'Terms of Service for Vybe',
};

export default async function TermsPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const sections = lang === 'ar'
    ? [
        { num: '1', title: 'القبول بالشروط', body: 'باستخدام منصة Vybe، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، فلا يحق لك استخدام خدماتنا.' },
        { num: '2', title: 'استخدام الخدمة', body: 'توفر منصة Vybe بيئة للتواصل بين العلامات التجارية وصناع المحتوى في الجزائر. يُحظر استخدام المنصة لأي أغراض غير مشروعة أو مضللة.' },
        { num: '3', title: 'الحسابات والمعلومات', body: 'أنت مسؤول عن الحفاظ على سرية بيانات حسابك. يجب أن تكون جميع المعلومات التي تقدمها دقيقة وصحيحة.' },
        { num: '4', title: 'المدفوعات والاشتراكات', body: 'يتم الفواتير على أساس شهري أو سنوي. يمكنك إلغاء اشتراكك في أي وقت، وسيظل حسابك نشطًا حتى نهاية فترة الفواتير الحالية.' },
        { num: '5', title: 'الملكية الفكرية', body: 'جميع المحتويات والميزات والوظائف الموجودة على المنصة هي ملك حصري لـ Vybe.' },
        { num: '6', title: 'تواصل معنا', body: null, email: true },
      ]
    : lang === 'fr'
    ? [
        { num: '1', title: 'Acceptation des conditions', body: 'En utilisant la plateforme Vybe, vous acceptez d\'être lié par ces termes et conditions. Si vous n\'acceptez pas une partie quelconque de ces conditions, vous n\'êtes pas autorisé à utiliser nos services.' },
        { num: '2', title: 'Utilisation du service', body: 'Vybe est une plateforme qui connecte les marques et les créateurs de contenu en Algérie. Il est interdit d\'utiliser la plateforme à des fins illégales ou trompeuses.' },
        { num: '3', title: 'Comptes et informations', body: 'Vous êtes responsable de la confidentialité des identifiants de votre compte. Toutes les informations que vous fournissez doivent être exactes et véridiques.' },
        { num: '4', title: 'Paiements et abonnements', body: 'La facturation est effectuée sur une base mensuelle ou annuelle. Vous pouvez annuler votre abonnement à tout moment, et votre compte restera actif jusqu\'à la fin de la période de facturation en cours.' },
        { num: '5', title: 'Propriété intellectuelle', body: 'Tout le contenu, les fonctionnalités et les fonctions présents sur la plateforme sont la propriété exclusive de Vybe.' },
        { num: '6', title: 'Nous contacter', body: null, email: true },
      ]
    : [
        { num: '1', title: 'Acceptance of terms', body: 'By using the Vybe platform, you agree to be bound by these terms and conditions. If you do not agree to any part of these terms, you are not authorized to use our services.' },
        { num: '2', title: 'Use of service', body: 'Vybe is a platform that connects brands and content creators in Algeria. Using the platform for any illegal or misleading purposes is strictly prohibited.' },
        { num: '3', title: 'Accounts and information', body: 'You are responsible for maintaining the confidentiality of your account credentials. All information you provide must be accurate and truthful.' },
        { num: '4', title: 'Payments and subscriptions', body: 'Billing is done on a monthly or annual basis. You may cancel your subscription at any time, and your account will remain active until the end of the current billing period.' },
        { num: '5', title: 'Intellectual property', body: 'All content, features, and functionality present on the platform are the exclusive property of Vybe.' },
        { num: '6', title: 'Contact us', body: null, email: true },
      ];

  return (
    <div className="min-h-screen bg-background relative selection:bg-vybe/20 selection:text-vybe" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[oklch(0.82_0.17_55_/_0.12)] blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-[oklch(0.62_0.20_28_/_0.08)] blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-6 inset-x-0 z-50">
        <div className="mx-auto flex items-center justify-between px-8 max-w-[1240px]">
          <Link href={`/${lang}`} className="flex items-center px-2 hover:opacity-90 transition-opacity">
            <VybeLogo />
          </Link>
          <Link href={`/${lang}`} className="flex items-center gap-2 text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform ltr:block rtl:hidden" />
            {dict.legal.back_home}
          </Link>
        </div>
      </nav>

      <main className="relative max-w-4xl mx-auto px-6 pt-32 pb-24 md:pt-40 md:pb-32">
        {/* Header */}
        <div className="space-y-4 mb-16">
          <p className="text-[13px] font-semibold text-vybe uppercase tracking-widest">{dict.legal.terms_updated}</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            {dict.legal.terms_title}
          </h1>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((s) => (
            <div key={s.num} className="glass p-8 md:p-10 rounded-[2rem] border border-border/40 shadow-soft group hover:border-vybe/20 transition-colors">
              <div className="flex items-start gap-5">
                <span className="flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-br from-vybe/10 to-vybe/5 border border-vybe/20 text-vybe font-heading font-bold text-sm">
                  {s.num}
                </span>
                <div className="flex-1">
                  <h2 className="font-heading text-lg font-bold text-foreground mb-3">{s.title}</h2>
                  {s.body ? (
                    <p className="text-[15px] text-foreground/70 leading-relaxed">{s.body}</p>
                  ) : (
                    <p className="text-[15px] text-foreground/70 leading-relaxed">
                      {lang === 'ar' ? 'لأي استفسارات قانونية، يرجى التواصل معنا على' : lang === 'fr' ? 'Pour toute question juridique, contactez-nous à' : 'For any legal inquiries, contact us at'}{' '}
                      <a href="mailto:legal@vybe.app" className="text-vybe hover:underline font-semibold">legal@vybe.app</a>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer link */}
        <div className="mt-16 pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-muted-foreground/70">
            {lang === 'ar' ? 'راجع أيضاً' : lang === 'fr' ? 'Voir aussi' : 'See also'}{' '}
            <Link href={`/${lang}/privacy`} className="text-vybe hover:underline font-semibold">
              {dict.legal.privacy_title}
            </Link>
          </p>
          <Link href={`/${lang}`} className="inline-flex items-center gap-2 text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform ltr:block rtl:hidden" />
            {dict.legal.back_home}
          </Link>
        </div>
      </main>
    </div>
  );
}
