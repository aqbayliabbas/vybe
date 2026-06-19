import { Metadata } from 'next';
import { getDictionary, Locale } from '../dictionaries';
import AuthLayout from '@/components/auth/AuthLayout';
import SignupForm from './SignupForm';

export const metadata: Metadata = {
  title: 'Sign Up - Vybe',
  description: 'Create your Vybe account',
};

export default async function SignupPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <AuthLayout dict={dict.auth} lang={lang}>
      <SignupForm dict={dict.auth} lang={lang} />
    </AuthLayout>
  );
}
