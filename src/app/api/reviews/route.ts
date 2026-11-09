import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/mongodb';
import Review from '@/src/lib/models/Review';

// GET: fetch approved reviews for a product
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const slug = new URL(req.url).searchParams.get('slug');
    if (!slug) return NextResponse.json({ success: false, error: 'slug required' }, { status: 400 });

    // Match approved:true OR status:'approved' — handles legacy records before migration
    const reviews = await Review.find({
      productSlug: slug,
      $or: [{ approved: true }, { status: 'approved' }],
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, reviews });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

// POST: submit a new review (pending approval)
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { productId, productSlug, productName, customerName, rating, comment } = await req.json();

    if (!productSlug || !customerName?.trim() || !rating || !comment?.trim())
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });

    if (rating < 1 || rating > 5)
      return NextResponse.json({ success: false, error: 'Rating must be 1–5' }, { status: 400 });

    const review = await Review.create({
      id: `rev-${Date.now()}`,
      productId: productId || productSlug,
      productSlug,
      productName: productName || '',
      customerName: customerName.trim(),
      rating: Number(rating),
      comment: comment.trim(),
      approved: false,
    });

    return NextResponse.json({
      success: true,
      message: 'Review submitted! It will appear after approval.',
      review,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
