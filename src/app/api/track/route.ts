import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/mongodb';
import Order from '@/src/lib/models/Order';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const query = new URL(req.url).searchParams.get('query');
    if (!query) return NextResponse.json({ success: false, error: 'query param required' }, { status: 400 });

    const order = await Order.findOne({
      $or: [{ id: query }, { phone: query }],
    }).lean();

    if (!order) return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    return NextResponse.json({ success: true, order });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
