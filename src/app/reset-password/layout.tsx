import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Reset Password | Hofherr Meat Co.',
    description: 'Reset your Hofherr Meat Co. account password.',
    robots: { index: false, follow: false },
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
