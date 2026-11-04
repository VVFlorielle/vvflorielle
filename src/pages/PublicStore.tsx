import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { HeroBannerSection } from '../components/storefront/HeroBannerSection';
import { CategoryVisualGrid } from '../components/storefront/CategoryVisualGrid';
import { CategoryPillFilters } from '../components/storefront/CategoryPillFilters';
import { ProductsDisplayGrid } from '../components/storefront/ProductsDisplayGrid';
import { PromotionsTickerSection } from '../components/storefront/PromotionsTickerSection';
import { FloralBlogSection } from '../components/storefront/FloralBlogSection';
import { StoreCommitmentSection } from '../components/storefront/StoreCommitmentSection';

export const PublicStore: React.FC = () => {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    settings,
    heroConfig,
    promotions,
    articles,
    selectedArticle,
    setSelectedArticle,
    showToast,
    setCurrentView
  } = useStore();

  const [sortOption, setSortOption] = useState<'popular' | 'price-asc' | 'price-desc' | 'newest'>('popular');
  const [priceFilter, setPriceFilter] = useState<'all' | 'under-500' | '500-1000' | 'over-1000'>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const currentCategoryData = categories.find((c) => c.id === selectedCategory) || categories[0];

  // Filter products by category, search query, and price range
  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchFlower = p.flowerTypes?.some((f) => f.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchFlower) return false;
    }
    if (priceFilter === 'under-500' && p.price >= 500000) return false;
    if (priceFilter === '500-1000' && (p.price < 500000 || p.price > 1000000)) return false;
    if (priceFilter === 'over-1000' && p.price <= 1000000) return false;
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'price-asc') return a.price - b.price;
    if (sortOption === 'price-desc') return b.price - a.price;
    if (sortOption === 'newest') return (b.tag?.includes('Mới') ? 1 : 0) - (a.tag?.includes('Mới') ? 1 : 0);
    return (b.rating || 0) - (a.rating || 0);
  });

  const homepageProducts = sortedProducts.slice(0, 8);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Đã sao chép mã ${code}!`, 'success');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleScrollToCategories = () => {
    const el = document.getElementById('categories-section');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      {/* 1. Hero Banner */}
      <HeroBannerSection
        heroConfig={heroConfig}
        settings={settings}
        onExploreClick={handleScrollToCategories}
      />

      {/* 2. Visual Category Grid */}
      <CategoryVisualGrid
        categories={categories}
        products={products}
        onSelectCategory={(catId) => {
          setSelectedCategory(catId);
          handleScrollToCategories();
        }}
      />

      {/* 3. Category Filter & Search Bar */}
      <CategoryPillFilters
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        priceFilter={priceFilter}
        setPriceFilter={setPriceFilter}
        sortOption={sortOption}
        setSortOption={setSortOption}
        currentCategoryName={currentCategoryData?.name || 'Mẫu Hoa'}
        displayedCount={homepageProducts.length}
        totalFilteredCount={sortedProducts.length}
      />

      {/* 4. Products Grid */}
      <ProductsDisplayGrid
        products={homepageProducts}
        totalSortedCount={sortedProducts.length}
        onViewAllCatalog={() => {
          setCurrentView('catalog');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onResetFilters={() => {
          setSelectedCategory('all');
          setSearchQuery('');
          setPriceFilter('all');
        }}
      />

      {/* 5. Promotions Section */}
      <PromotionsTickerSection
        promotions={promotions}
        onCopyCode={handleCopyCode}
        copiedCode={copiedCode}
      />

      {/* 6. Blog & Care Articles */}
      <FloralBlogSection
        articles={articles}
        selectedArticle={selectedArticle}
        setSelectedArticle={setSelectedArticle}
      />

      {/* 7. Store Commitment & Service Promise */}
      <StoreCommitmentSection />
    </div>
  );
};
