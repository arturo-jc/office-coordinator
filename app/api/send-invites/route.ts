// app/api/send-invites/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { resend, EMAIL_FROM } from '@/lib/emailClient';

type Contact = {
  email: string;
  name?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      contacts,
      meetingTitle,
      meetingDateTime, // ISO string, e.g. "2025-11-20T17:00:00-06:00"
      location,        // optional
    }: {
      contacts: Contact[];
      meetingTitle: string;
      meetingDateTime: string;
      location?: string;
    } = body;

    if (!contacts?.length) {
      return NextResponse.json({ error: 'No contacts provided' }, { status: 400 });
    }

    if (!meetingTitle || !meetingDateTime) {
      return NextResponse.json({ error: 'Missing meetingTitle or meetingDateTime' }, { status: 400 });
    }

    const date = new Date(meetingDateTime);

    // You can format this nicer with date-fns or dayjs; keeping it simple:
    const formattedDate = date.toLocaleString('en-CA', {
      dateStyle: 'full',
      timeStyle: 'short',
    });

    const subject = `Can you attend: ${meetingTitle} on ${formattedDate}?`;

    // OPTION A: One group thread (all in To)
    // Everyone sees each other; replies stay on one thread.
    const toAddresses = contacts.map((c) =>
      c.name ? `${c.name} <${c.email}>` : c.email,
    );

    const html = `
      <p>Hi everyone,</p>
      <p>I'd like to schedule <strong>${meetingTitle}</strong> on <strong>${formattedDate}</strong>${
        location ? ` at <strong>${location}</strong>` : ''
      }.</p>
      <p>Can you attend this meeting?</p>
      <p>Please reply to this email with <strong>Yes</strong> or <strong>No</strong>. If you can't attend, feel free to suggest another time that works for you.</p>
      <p>Thanks!</p>
    `;

    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: toAddresses,
      subject,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'Failed to send invites' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}

