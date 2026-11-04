import React from 'react';
import { Layers } from 'lucide-react';
import { FlowerCategory, FlowerProduct, CategoryId } from '../../types';

interface CategoryVisualGridProps {
  categories: FlowerCategory[];
  products: FlowerProduct[];
  onSelectCategory: (catId: CategoryId) => void;
}

export const CategoryVisualGrid: React.FC<CategoryVisualGridProps> = ({
  categories,
  products,
  onSelectCategory
}) => {
  return (
    <section className="container">
      <div className="flex items-center justify-between pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            <span>Danh Mục Hoa Tươi Nghệ Thuật</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tuyển chọn theo từng sự kiện ý nghĩa, thiết kế sang trọng &amp; hoa tươi mới mỗi ngày
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {categories.filter((c) => c.id !== 'all').map((cat) => {
          const count = products.filter((p) => p.categoryId === cat.id).length;
          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="glass-card rounded-[24px] overflow-hidden border border-white/80 p-2 cursor-pointer group hover:scale-[1.03] hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-100 shadow-inner">
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-2 right-2 bg-slate-900/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {count} mẫu
                </div>
              </div>

              <div className="p-2 pt-2.5 text-center">
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                  {cat.tagline || cat.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
