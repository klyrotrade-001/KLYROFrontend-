import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/mongodb';
import Order from '@/src/lib/models/Order';

const WHATSAPP_NUMBER = '919292674447';

function buildWhatsAppMessage(data: {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number;
}) {
  const itemLines = data.items
    .map((i) => `  • ${i.name} × ${i.quantity} = ₹${(i.price * i.quantity).toLocaleString('en-IN')}`)
    .join('\n');

  return `🛒 *New Order from KLYRO*

*Order ID:* ${data.id}
*Customer:* ${data.customerName}
*Phone:* ${data.phone}
*Address:* ${data.address}

*Items:*
${itemLines}

*Total: ₹${data.totalAmount.toLocaleString('en-IN')}*

Please confirm this order. Thank you! 🙏`;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { customer, items } = await req.json();

    if (!customer || !items?.length)
      return NextResponse.json(
        { success: false, error: 'customer and items required' },
        { status: 400 }
      );

    // CartItem structure: { product: Product, quantity: number, selectedVariant?: string }
    const orderItems = (items as any[]).map((i) => {
      const product = i.product ?? i;
      return {
        productId: String(product.id ?? i.productId ?? ''),
        name: String(product.name ?? i.name ?? 'Unknown'),
        price: Number(product.price ?? i.price ?? 0),
        quantity: Number(i.quantity ?? 1),
        image: String(product.images?.[0] ?? i.images?.[0] ?? ''),
      };
    });

    const totalAmount = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const address = [
      customer.houseBuilding,
      customer.streetLocality,
      customer.landmark,
      customer.city,
      customer.state,
      customer.pinCode,
    ]
      .filter(Boolean)
      .join(', ');

    const orderId = `ORD-${Date.now()}`;

    const order = await Order.create({
      id: orderId,
      customerName: customer.fullName || customer.name || 'Customer',
      phone: customer.mobileNumber || customer.phone || '',
      email: customer.email || '',
      address,
      items: orderItems,
      totalAmount,
      status: 'placed',
      statusHistory: [
        { status: 'placed', message: 'Order placed', updatedAt: new Date() },
      ],
    });

    // Build WhatsApp message
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      buildWhatsAppMessage({
        id: order.id,
        customerName: order.customerName,
        phone: order.phone,
        address: order.address,
        items: orderItems,
        totalAmount,
      })
    )}`;

    return NextResponse.json({ success: true, orderId: order.id, whatsappUrl });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
