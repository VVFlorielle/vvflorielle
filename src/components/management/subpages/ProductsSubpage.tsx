import React from 'react';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { FlowerProduct } from '../../../types';

interface ProductsSubpageProps {
  products: FlowerProduct[];
  onBackToDashboard: () => void;
  onOpenAddProduct: () => void;
  deleteProduct: (id: string) => void;
  formatPrice: (p: number) => string;
  title?: string;
}

export const ProductsSubpage: React.FC<ProductsSubpageProps> = ({
  products,
  onBackToDashboard,
  onOpenAddProduct,
  deleteProduct,
  formatPrice,
  title = 'Quản Lý Danh Mục & Mẫu Hoa Tươi'
}) => {
  return (
    <div className="glass-panel p-5 sm:p-6 space-y-4 rounded-[28px] animate-in fade-in duration-200">
      {/* Header and Back Button */}
      <div className="flex items-center gap-3 pb-3 border-b border-slate-200/80">
        <button
          type="button"
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại Tổng Quan</span>
        </button>
        <h2 className="font-bold text-base sm:text-lg text-slate-800">{title}</h2>
      </div>

      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h3 className="font-bold text-base text-slate-800">Kho Mẫu Hoa Tươi &amp; Danh Mục ({products.length})</h3>
          <p className="text-xs text-slate-500">Quản lý các thiết kế hoa thực tế, giá bán và hoa thành phần</p>
        </div>

        <button
          type="button"
          onClick={onOpenAddProduct}
          className="btn-primary text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Mẫu Hoa Mới</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 relative">
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                {product.tag && (
                  <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    {product.tag}
                  </span>
                )}
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{product.name}</h4>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-extrabold text-sm text-emerald-700">{formatPrice(product.price)}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xs text-slate-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{product.description}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-400 font-medium">Dịp: {product.categoryId}</span>
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Bạn có chắc muốn xóa mẫu hoa "${product.name}"?`)) {
                    deleteProduct(product.id);
                  }
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                title="Xóa mẫu hoa"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
