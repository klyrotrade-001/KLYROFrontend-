'use client';

import { useState, useEffect } from 'react';
import { Star, CheckCircle2, AlertTriangle, MessageSquare } from 'lucide-react';

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Props {
  productSlug: string;
  productId: string;
  productName: string;
}

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          onMouseEnter={() => onChange && setHovered(star)}
          onMouseLeave={() => onChange && setHovered(0)}
          className={onChange ? 'cursor-pointer' : 'cursor-default'}
        >
          <Star
            size={onChange ? 22 : 14}
            className={
              star <= (hovered || value)
                ? 'fill-[#F59E0B] text-[#F59E0B]'
                : 'fill-[#E8ECE6] text-[#E8ECE6]'
            }
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewSection({ productSlug, productId, productName }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`/api/reviews?slug=${productSlug}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setReviews(d.reviews); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [productSlug]);

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) { setStatus('error'); setMessage('Please select a star rating.'); return; }
    if (!name.trim()) { setStatus('error'); setMessage('Please enter your name.'); return; }
    if (!comment.trim()) { setStatus('error'); setMessage('Please write a review.'); return; }

    setSubmitting(true);
    setStatus('idle');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, productSlug, productName, customerName: name, rating, comment }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setMessage(data.message);
        setName(''); setRating(0); setComment('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to submit review.');
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-16 border-t border-[#E8ECE6] pt-14">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* Left: Reviews list */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black text-[#151515]">Customer Reviews</h2>
              {avgRating && (
                <div className="flex items-center gap-2 mt-1">
                  <StarRating value={Math.round(Number(avgRating))} />
                  <span className="text-sm font-bold text-[#151515]">{avgRating}</span>
                  <span className="text-xs text-[#777777]">({reviews.length} reviews)</span>
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-24 rounded-2xl bg-[#F7F8F6] animate-pulse" />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="rounded-2xl border border-[#E8ECE6] bg-[#F7F8F6] p-8 text-center">
              <MessageSquare size={32} className="mx-auto text-[#CCCCCC] mb-3" />
              <p className="text-sm font-semibold text-[#777777]">No reviews yet.</p>
              <p className="text-xs text-[#AAAAAA] mt-1">Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="rounded-2xl border border-[#E8ECE6] bg-white p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#005E23] text-white text-xs font-black shrink-0">
                        {review.customerName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#151515]">{review.customerName}</p>
                        <p className="text-[10px] text-[#AAAAAA]">
                          {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <StarRating value={review.rating} />
                  </div>
                  <p className="text-sm text-[#444444] leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Write review form */}
        <div>
          <h2 className="text-xl font-black text-[#151515] mb-6">Write a Review</h2>

          {status === 'success' ? (
            <div className="rounded-2xl bg-[#ecfdf5] border border-[#a7f3d0] p-6 text-center">
              <CheckCircle2 size={32} className="mx-auto text-[#005E23] mb-3" />
              <p className="text-sm font-bold text-[#005E23]">Thank you for your review!</p>
              <p className="text-xs text-[#005E23]/70 mt-1">{message}</p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="mt-4 text-xs font-bold text-[#005E23] underline"
              >
                Write another review
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Star Rating */}
              <div>
                <label className="block text-xs font-bold text-[#151515] mb-2 uppercase tracking-wider">
                  Your Rating *
                </label>
                <StarRating value={rating} onChange={setRating} />
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-[#151515] mb-1.5 uppercase tracking-wider">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Kumar"
                  required
                  className="w-full rounded-xl border border-[#E8ECE6] bg-[#F7F8F6] px-4 py-2.5 text-sm text-[#151515] placeholder-[#AAAAAA] focus:border-[#005E23] focus:bg-white focus:outline-none"
                />
              </div>

              {/* Review */}
              <div>
                <label className="block text-xs font-bold text-[#151515] mb-1.5 uppercase tracking-wider">
                  Your Review *
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this product..."
                  rows={4}
                  required
                  className="w-full rounded-xl border border-[#E8ECE6] bg-[#F7F8F6] px-4 py-2.5 text-sm text-[#151515] placeholder-[#AAAAAA] focus:border-[#005E23] focus:bg-white focus:outline-none resize-none"
                />
                <p className="mt-1 text-[10px] text-[#AAAAAA]">{comment.length}/500 characters</p>
              </div>

              {/* Error */}
              {status === 'error' && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
                  <AlertTriangle size={14} className="text-red-500 shrink-0" />
                  <p className="text-xs font-semibold text-red-600">{message}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-[#005E23] py-3 text-sm font-bold text-white hover:bg-[#004719] disabled:opacity-60 transition-colors"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>

              <p className="text-[10px] text-[#AAAAAA] text-center">
                Reviews are published after approval by our team.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
