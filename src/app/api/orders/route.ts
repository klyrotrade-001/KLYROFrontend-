import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/mongodb';
import Order from '@/src/lib/models/Order';

const WHATSAPP_NUMBER = '919292674447';

function buildWhatsAppMessage(order: {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number;
}) {
  const itemLines = order.items
    .map((i) => `  • ${i.name} × ${i.quantity} = ₹${(i.price * i.quantity).toLocaleString('en-IN')}`)
    .join('\n');

  return `🛒 *New Order from KLYRO*

*Order ID:* ${order.id}
*Customer:* ${order.customerName}
*Phone:* ${order.phone}
*Address:* ${order.address}

*Items:*
${itemLines}

*Total: ₹${order.totalAmount.toLocaleString('en-IN')}*

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

    const orderId = `ORD-${Date.now()}`;
    const totalAmount = items.reduce(
      (sum: number, i: any) => sum + i.price * i.quantity,
      0
    );

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

    const orderData = {
      id: orderId,
      customerName: customer.fullName || customer.name || 'Customer',
      phone: customer.mobileNumber || customer.phone || '',
      email: customer.email || '',
      address,
      items: items.map((i: any) => ({
        productId: i.id,
        name: i.name || i.product?.name,
        price: i.price || i.product?.price,
        quantity: i.quantity,
        image: i.images?.[0] || i.product?.images?.[0] || '',
      })),
      totalAmount,
      status: 'placed',
      statusHistory: [
        { status: 'placed', message: 'Order placed', updatedAt: new Date() },
      ],
    };

    const order = await Order.create(orderData);

    // Build WhatsApp URL
    const message = buildWhatsAppMessage({
      id: order.id,
      customerName: orderData.customerName,
      phone: orderData.phone,
      address: orderData.address,
      items: orderData.items,
      totalAmount: orderData.totalAmount,
    });

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    return NextResponse.json({
      success: true,
      orderId: order.id,
      whatsappUrl,
    });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 }
    );
  }
}
