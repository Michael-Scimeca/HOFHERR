import { notFound } from 'next/navigation';
import { getMailtoLink, generateEmailBody, generatePlainText, generateHtml } from '@/app/api/email/template';
import { getClient } from '@/sanity/client';
import { CATERING_QUERY } from '@/sanity/queries';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Debug Email Body',
};

export default async function DebugEmailPage({ searchParams }: { searchParams: { id?: string } }) {
  const { id } = searchParams;
  if (!id) return <p>No package id supplied.</p>;

  const client = getClient(false);
  const packages = await client.fetch(CATERING_QUERY);
  const pkg = packages?.find((p: any) => p._id === id);
  if (!pkg) return notFound();

  const mailto = getMailtoLink(pkg);
  const plain = generatePlainText(pkg);
  const html = generateHtml(pkg);

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>Debug Email for {pkg.name}</h1>
      <p><strong>Mailto link:</strong></p>
      <pre style={{ background: '#f0f0f0', padding: '1rem' }}>{mailto}</pre>
      <p><strong>Plain‑text body (decoded):</strong></p>
      <pre style={{ background: '#f0f0f0', padding: '1rem' }}>{plain}</pre>
      <p><strong>HTML body (rendered):</strong></p>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
