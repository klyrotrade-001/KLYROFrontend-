import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/mongodb';
import Product from '@/src/lib/models/Product';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get('limit');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort');

    const filter: Record<string, unknown> = {};
    if (category && category !== 'all') filter.categorySlug = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const sortMap: Record<string, Record<string, number>> = {
      'price-asc': { price: 1 }, 'price-desc': { price: -1 },
      'discount': { discount: -1 }, 'bestseller': { isBestSeller: -1 },
      'rating': { rating: -1 },
    };

    let query = Product.find(filter).sort(sortMap[sort ?? ''] as any ?? {}).lean();
    if (limit) query = query.limit(parseInt(limit));
    const products = await query;
    return NextResponse.json({ success: true, total: products.length, products });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
