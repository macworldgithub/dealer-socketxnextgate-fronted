import { Metadata } from 'next';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In | Dealer Socket Automation',
  description: 'Enterprise Dealership Lead Automation & Ingestion Platform',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-100/80 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-slate-900 selection:text-white">
      {/* Ambient Slate Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000006_1px,transparent_1px),linear-gradient(to_bottom,#00000006_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 w-full">
        <LoginForm />
      </div>
    </div>
  );
}
