import React from 'react';
import { ArrowRight } from 'lucide-react';
import { FlowerProduct } from '../../types';
import { ProductCard } from '../ProductCard';

interface ProductsDisplayGridProps {
  products: FlowerProduct[];
  totalSortedCount: number;
  onViewAllCatalog: () => void;
  onResetFilters: () => void;
}

export const ProductsDisplayGrid: React.FC<ProductsDisplayGridProps> = ({
  products,
  totalSortedCount,
  onViewAllCatalog,
  onResetFilters
}) => {
  return (
    <section className="container px-2.5 sm:px-4 md:px-6">
      {totalSortedCount === 0 ? (
        <div className="glass-panel p-8 sm:p-12 text-center text-slate-500 space-y-3 rounded-3xl">
          <p className="text-xs sm:text-sm">Không tìm thấy mẫu hoa phù hợp với tiêu chí lọc của bạn.</p>
          <button
            onClick={onResetFilters}
            className="btn-secondary text-xs py-2 px-4 rounded-xl cursor-pointer"
          >
            Đặt lại tất cả bộ lọc
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Button to view all catalog when more than 8 products (Đồng bộ theo màu Branding) */}
          {totalSortedCount > 8 && (
            <div className="text-center pt-8 pb-2">
              <button
                type="button"
                onClick={onViewAllCatalog}
                className="btn-view-all-flowers inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, var(--primary-color, #059669) 0%, var(--primary-hover, #047857) 100%)',
                  boxShadow: '0 6px 20px var(--primary-glow, rgba(16, 185, 129, 0.25))'
                }}
              >
                <span>Xem thêm tất cả {totalSortedCount} mẫu hoa trên trang Bộ Sưu Tập</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};
