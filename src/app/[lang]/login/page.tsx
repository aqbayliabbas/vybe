import { Metadata } from 'next';
import { getDictionary, Locale } from '../dictionaries';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'Login - Vybe',
  description: 'Login to your Vybe account',
};

export default async function LoginPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <AuthLayout dict={dict.auth} lang={lang}>
      <LoginForm dict={dict.auth} lang={lang} />
    </AuthLayout>
  );
}
