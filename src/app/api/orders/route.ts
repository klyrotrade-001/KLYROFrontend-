import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/mongodb';
import Order from '@/src/lib/models/Order';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { customer, items } = await req.json();
    if (!customer || !items?.length)
      return NextResponse.json({ success: false, error: 'customer and items required' }, { status: 400 });

    const orderId = `ORD-${Date.now()}`;
    const totalAmount = items.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0);

    const order = await Order.create({
      id: orderId,
      customerName: customer.name,
      phone: customer.phone,
      email: customer.email || '',
      address: `${customer.address}, ${customer.city}, ${customer.state} - ${customer.pincode}`,
      items: items.map((i: any) => ({
        productId: i.id, name: i.name,
        price: i.price, quantity: i.quantity,
        image: i.images?.[0] || '',
      })),
      totalAmount,
      status: 'placed',
      statusHistory: [{ status: 'placed', message: 'Order placed', updatedAt: new Date() }],
    });

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
