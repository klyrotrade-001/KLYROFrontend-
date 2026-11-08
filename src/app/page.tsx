import BestSellersSection from '@/src/components/home/BestSellersSection';
import CategorySection from '@/src/components/home/CategorySection';
import FeaturedCollectionSection from '@/src/components/home/FeaturedCollectionSection';
import HeroSection from '@/src/components/home/HeroSection';
import NewArrivalsSection from '@/src/components/home/NewArrivalsSection';
import PromoBannerSection from '@/src/components/home/PromoBannerSection';
import TrustAndReviewsSection from '@/src/components/home/TrustAndReviewsSection';
import WhyChooseSection from '@/src/components/home/WhyChooseSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <FeaturedCollectionSection />
      <NewArrivalsSection />
      <PromoBannerSection />
      <BestSellersSection />
      <WhyChooseSection />
      <TrustAndReviewsSection />
    </>
  );
}
