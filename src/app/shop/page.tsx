'use client';

import { Suspense, useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Filter, SlidersHorizontal, Search, RefreshCw } from 'lucide-react';
import ProductCard from '@/src/components/product/ProductCard';
import { useStoreCategories } from '@/src/hooks/useStoreCategories';
import { getProducts } from '@/src/lib/api';
import { Product } from '@/src/types';

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryParam = searchParams.get('category') || 'all';
  const sortParam = searchParams.get('sort') || 'default';
  const searchParam = searchParams.get('search') || '';

  const categories = useStoreCategories();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [sortBy, setSortBy] = useState(sortParam);

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    setSortBy(sortParam);
  }, [sortParam]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getProducts({
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
    })
      .then((data) => {
        if (isMounted) {
          setProducts(Array.isArray(data) ? data : []);
        }
      })
      .catch(() => {
        if (isMounted) {
          setProducts([]);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCategory]);

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    const params = new URLSearchParams(searchParams.toString());
    if (slug === 'all') {
      params.delete('category');
    } else {
      params.set('category', slug);
    }
    router.push(`/shop?${params.toString()}`);
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    const params = new URLSearchParams(searchParams.toString());
    if (newSort === 'default') {
      params.delete('sort');
    } else {
      params.set('sort', newSort);
    }
    router.push(`/shop?${params.toString()}`);
  };

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Filter by category if not 'all'
    if (selectedCategory && selectedCategory !== 'all') {
      list = list.filter((p) => p.categorySlug === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        list.sort((a, b) => b.discount - a.discount);
        break;
      case 'bestseller':
        list.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
        break;
      default:
        break;
    }

    return list;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const currentCategoryName =
    selectedCategory === 'all'
      ? 'All Products'
      : categories.find((c) => c.slug === selectedCategory)?.name || 'Collection';

  return (
    <div className="min-h-screen bg-[#FBFBFA] pt-8 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between border-b border-[#E8ECE6] pb-5">
          <div className="flex items-center gap-2 text-xs text-[#777777]">
            <Link href="/" className="hover:text-[#005E23] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#151515]">Shop</span>
            {selectedCategory !== 'all' && (
              <>
                <span>/</span>
                <span className="font-bold text-[#005E23]">{currentCategoryName}</span>
              </>
            )}
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#555] hover:text-[#005E23] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Page Title & Controls */}
        <div className="mt-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-[2px] w-5 bg-[#005E23]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#005E23]">
                KLYRO Store
              </span>
            </div>
            <h1 className="mt-2 text-3xl sm:text-4xl font-black tracking-[-0.03em] text-[#151515]">
              {currentCategoryName}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[#777777]">
              Showing {filteredProducts.length} thoughtfully designed products
            </p>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-60 rounded-full border border-[#E8ECE6] bg-white py-2.5 pl-9 pr-4 text-xs font-medium text-[#151515] placeholder:text-[#999] focus:border-[#005E23] focus:outline-none shadow-sm"
              />
              <Search size={14} className="absolute left-3.5 top-3 text-[#888]" />
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2 rounded-full border border-[#E8ECE6] bg-white px-3.5 py-2 text-xs shadow-sm">
              <SlidersHorizontal size={13} className="text-[#005E23]" />
              <span className="text-[11px] font-semibold text-[#888]">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-transparent font-semibold text-[#151515] focus:outline-none cursor-pointer text-xs"
              >
                <option value="default">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="discount">Biggest Discount</option>
                <option value="rating">Top Rated</option>
                <option value="bestseller">Bestsellers</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => handleCategoryChange('all')}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#005E23] text-white shadow-sm'
                : 'bg-white border border-[#E8ECE6] text-[#555] hover:border-[#005E23]/40 hover:text-[#005E23]'
            }`}
          >
            All Products
          </button>
          {categories.map((c) => {
            const isActive = selectedCategory === c.slug;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => handleCategoryChange(c.slug)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#005E23] text-white shadow-sm'
                    : 'bg-white border border-[#E8ECE6] text-[#555] hover:border-[#005E23]/40 hover:text-[#005E23]'
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        <div className="mt-8">
          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#777]">
                <RefreshCw size={18} className="animate-spin text-[#005E23]" />
                <span>Loading products...</span>
              </div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-dashed border-[#D1D5DB] bg-white p-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F7F8F6] text-[#888]">
                <Filter size={24} />
              </div>
              <h3 className="mt-4 text-base font-bold text-[#151515]">No products found</h3>
              <p className="mt-1 text-xs text-[#777] max-w-sm">
                We couldn&apos;t find any products matching your current category or search filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setSortBy('default');
                  router.push('/shop');
                }}
                className="mt-5 rounded-full bg-[#005E23] px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#004a1b] transition-all"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <RefreshCw size={24} className="animate-spin text-[#005E23]" />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}

