import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Zap, Shield, Eye, Database, Lock, Globe, Mail } from 'lucide-react';
import { getDictionary, Locale } from '../dictionaries';

export const metadata: Metadata = {
  title: 'Privacy Policy - Vybe',
  description: 'Privacy Policy for Vybe — How we collect and use your data.',
};

export default async function PrivacyPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const sections = lang === 'ar'
    ? [
        { icon: Database, color: 'text-blue-500', bg: 'from-blue-500/10 to-blue-500/5 border-blue-500/20', title: 'البيانات التي نجمعها', body: 'نقوم بجمع المعلومات التي تقدمها مباشرة (الاسم، البريد الإلكتروني، معلومات الشركة)، إلى جانب البيانات التقنية مثل عنوان IP وأنماط الاستخدام لتحسين تجربتك.' },
        { icon: Shield, color: 'text-green-500', bg: 'from-green-500/10 to-green-500/5 border-green-500/20', title: 'كيف نستخدم بياناتك', body: 'نستخدم بياناتك لتشغيل المنصة وتحسينها، وتسهيل التواصل بين العلامات التجارية وصناع المحتوى، وإرسال التحديثات المهمة المتعلقة بخدماتنا.' },
        { icon: Lock, color: 'text-orange-500', bg: 'from-orange-500/10 to-orange-500/5 border-orange-500/20', title: 'حماية بياناتك', body: 'نستخدم تشفير SSL وبروتوكولات أمنية حديثة لحماية بياناتك. لا نبيع معلوماتك الشخصية لأطراف ثالثة بأي حال من الأحوال.' },
        { icon: Eye, color: 'text-purple-500', bg: 'from-purple-500/10 to-purple-500/5 border-purple-500/20', title: 'مشاركة البيانات', body: 'قد نشارك بياناتك مع شركاء موثوقين بالقدر اللازم فقط لتقديم الخدمة.' },
        { icon: Globe, color: 'text-cyan-500', bg: 'from-cyan-500/10 to-cyan-500/5 border-cyan-500/20', title: 'ملفات تعريف الارتباط', body: 'نستخدم ملفات تعريف الارتباط الضرورية لتشغيل المنصة والحفاظ على جلستك النشطة. يمكنك تعطيلها من إعدادات متصفحك.' },
        { icon: Mail, color: 'text-vybe', bg: 'from-vybe/10 to-vybe/5 border-vybe/20', title: 'تواصل معنا', body: null, email: true },
      ]
    : lang === 'fr'
    ? [
        { icon: Database, color: 'text-blue-500', bg: 'from-blue-500/10 to-blue-500/5 border-blue-500/20', title: 'Les données que nous collectons', body: 'Nous collectons les informations que vous fournissez directement (nom, e-mail, informations sur l\'entreprise), ainsi que des données techniques telles que l\'adresse IP et les habitudes d\'utilisation pour améliorer votre expérience.' },
        { icon: Shield, color: 'text-green-500', bg: 'from-green-500/10 to-green-500/5 border-green-500/20', title: 'Comment nous utilisons vos données', body: 'Nous utilisons vos données pour faire fonctionner et améliorer la plateforme, faciliter la mise en relation entre marques et créateurs, et envoyer des mises à jour importantes concernant nos services.' },
        { icon: Lock, color: 'text-orange-500', bg: 'from-orange-500/10 to-orange-500/5 border-orange-500/20', title: 'Protection de vos données', body: 'Nous utilisons le chiffrement SSL et des protocoles de sécurité modernes pour protéger vos données. Nous ne vendons en aucun cas vos informations personnelles à des tiers.' },
        { icon: Eye, color: 'text-purple-500', bg: 'from-purple-500/10 to-purple-500/5 border-purple-500/20', title: 'Partage des données', body: 'Nous pouvons partager vos données avec des partenaires de confiance uniquement dans la mesure nécessaire à la prestation du service.' },
        { icon: Globe, color: 'text-cyan-500', bg: 'from-cyan-500/10 to-cyan-500/5 border-cyan-500/20', title: 'Cookies', body: 'Nous utilisons des cookies nécessaires au fonctionnement de la plateforme et au maintien de votre session active. Vous pouvez les désactiver depuis les paramètres de votre navigateur.' },
        { icon: Mail, color: 'text-vybe', bg: 'from-vybe/10 to-vybe/5 border-vybe/20', title: 'Nous contacter', body: null, email: true },
      ]
    : [
        { icon: Database, color: 'text-blue-500', bg: 'from-blue-500/10 to-blue-500/5 border-blue-500/20', title: 'Data we collect', body: 'We collect information you provide directly (name, email, company info), as well as technical data such as IP address and usage patterns to improve your experience.' },
        { icon: Shield, color: 'text-green-500', bg: 'from-green-500/10 to-green-500/5 border-green-500/20', title: 'How we use your data', body: 'We use your data to operate and improve the platform, facilitate connections between brands and creators, and send important updates about our services.' },
        { icon: Lock, color: 'text-orange-500', bg: 'from-orange-500/10 to-orange-500/5 border-orange-500/20', title: 'Protecting your data', body: 'We use SSL encryption and modern security protocols to protect your data. We never sell your personal information to third parties under any circumstances.' },
        { icon: Eye, color: 'text-purple-500', bg: 'from-purple-500/10 to-purple-500/5 border-purple-500/20', title: 'Data sharing', body: 'We may share your data with trusted partners only to the extent necessary to provide the service.' },
        { icon: Globe, color: 'text-cyan-500', bg: 'from-cyan-500/10 to-cyan-500/5 border-cyan-500/20', title: 'Cookies', body: 'We use cookies necessary for the platform to operate and to keep your session active. You can disable them from your browser settings.' },
        { icon: Mail, color: 'text-vybe', bg: 'from-vybe/10 to-vybe/5 border-vybe/20', title: 'Contact us', body: null, email: true },
      ];

  return (
    <div className="min-h-screen bg-background relative selection:bg-vybe/20 selection:text-vybe" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[oklch(0.62_0.20_28_/_0.15)] blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-[oklch(0.82_0.17_55_/_0.08)] blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-6 inset-x-0 z-50">
        <div className="mx-auto flex items-center justify-between px-8 max-w-[1240px]">
          <Link href={`/${lang}`} className="flex items-center gap-2.5 px-2 hover:opacity-90 transition-opacity">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f7931e] to-[#ea2d3e] shadow-md">
              <Zap className="h-4 w-4 text-white fill-white" />
            </div>
            <span className="font-heading text-xl font-bold tracking-tight text-foreground drop-shadow-sm">Vybe</span>
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
          <p className="text-[13px] font-semibold text-vybe uppercase tracking-widest">{dict.legal.privacy_updated}</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            {dict.legal.privacy_title}
          </h1>
          <p className="text-[16px] text-muted-foreground max-w-2xl leading-relaxed">
            {lang === 'ar'
              ? 'نحن في Vybe نحترم خصوصيتك. تشرح هذه السياسة كيفية جمع معلوماتك واستخدامها وحمايتها.'
              : lang === 'fr'
              ? 'Chez Vybe, nous respectons votre vie privée. Cette politique explique comment vos informations sont collectées, utilisées et protégées.'
              : 'At Vybe, we respect your privacy. This policy explains how your information is collected, used, and protected.'}
          </p>
        </div>

        {/* Sections grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((s, i) => (
            <div
              key={i}
              className={`glass p-7 rounded-[2rem] border border-border/40 shadow-soft hover:border-border/80 transition-all duration-300 group ${i === sections.length - 1 ? 'md:col-span-2' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-2xl bg-gradient-to-br ${s.bg} border`}>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div className="flex-1">
                  <h2 className="font-heading text-base font-bold text-foreground mb-2">{s.title}</h2>
                  {s.body ? (
                    <p className="text-[14px] text-foreground/70 leading-relaxed">{s.body}</p>
                  ) : (
                    <p className="text-[14px] text-foreground/70 leading-relaxed">
                      {lang === 'ar'
                        ? 'لأي استفسارات تتعلق بالخصوصية، تواصل معنا عبر'
                        : lang === 'fr'
                        ? 'Pour toute question relative à la confidentialité, contactez-nous à'
                        : 'For any privacy-related inquiries, contact us at'}{' '}
                      <a href="mailto:privacy@vybe.app" className="text-vybe hover:underline font-semibold">privacy@vybe.app</a>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-muted-foreground/70">
            {lang === 'ar' ? 'راجع أيضاً' : lang === 'fr' ? 'Voir aussi' : 'See also'}{' '}
            <Link href={`/${lang}/terms`} className="text-vybe hover:underline font-semibold">
              {dict.legal.terms_title}
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
