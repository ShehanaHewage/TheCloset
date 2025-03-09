type Category = {
  id: string;
  name: string;
  image: string;
};

const categories: Category[] = [
  {
    id: '1',
    name: "Women's Fashion",
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=2070',
  },
  {
    id: '2',
    name: "Men's Collection",
    image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=2071',
  },
  {
    id: '3',
    name: 'Accessories',
    image: 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?q=80&w=2070',
  },
  {
    id: '4',
    name: 'Footwear',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=2080',
  },
];

export function FeaturedCategories() {
  return (
    <section className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-neutral-800 mb-2 text-center">Shop by Category</h2>
        <p className="text-neutral-600 mb-10 text-center max-w-2xl mx-auto">
          Explore our curated collections designed to elevate your style
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="overflow-hidden group cursor-pointer hover:shadow-md transition-shadow">
              <div className="p-0 relative">
                <div className="h-64 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/70 to-transparent flex items-end">
                  <h3 className="text-xl font-medium text-white p-4 w-full">{category.name}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
