export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';

// Minimal validation and normalisation for certificate generation
function sanitize(input: string) {
  return (input || '').toString().slice(0, 500).trim();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      recipientName = '',
      achievement = '',
      awardedBy = '',
      date = new Date().toISOString().split('T')[0],
      organizationName = '',
      signature = '',
      template = 'classic-gold',
    } = body || {};

    if (!recipientName || !achievement) {
      return NextResponse.json(
        { error: 'Missing required fields: recipientName, achievement' },
        { status: 400 },
      );
    }

    const payload = {
      recipientName: sanitize(recipientName),
      achievement: sanitize(achievement),
      awardedBy: sanitize(awardedBy),
      date: date,
      organizationName: sanitize(organizationName),
      signature: sanitize(signature) || sanitize(awardedBy),
      template: sanitize(template) || 'classic-gold',
      organizationLogo: sanitize(body.organizationLogo || ''),
      signatureImage: sanitize(body.signatureImage || ''),
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error('Error generating certificate:', error);
    return NextResponse.json({ error: 'Failed to generate certificate' }, { status: 500 });
  }
}
