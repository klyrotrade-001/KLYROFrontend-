import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/mongodb';
import Subscriber from '@/src/lib/models/Subscriber';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email } = await req.json();
    if (!email) return NextResponse.json({ success: false, error: 'Email required' }, { status: 400 });

    const existing = await Subscriber.findOne({ email });
    if (existing) return NextResponse.json({ success: true, message: 'Already subscribed' });

    await Subscriber.create({ email });
    return NextResponse.json({ success: true, message: 'Subscribed successfully' });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
