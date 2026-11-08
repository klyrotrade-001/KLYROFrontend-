import { NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/mongodb';
import Category from '@/src/lib/models/Category';

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find().lean();
    return NextResponse.json({ success: true, categories });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
