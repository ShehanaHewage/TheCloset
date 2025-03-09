import { Card, CardContent, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  isNew?: boolean;
  isSale?: boolean;
};

const products: Product[] = [
  {
    id: '1',
    name: 'Minimalist Cotton Shirt',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1925',
    isNew: true,
  },
  {
    id: '2',
    name: 'Classic Denim Jacket',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1974',
    isSale: true,
  },
  {
    id: '3',
    name: 'Casual Linen Pants',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1974',
  },
  {
    id: '4',
    name: 'Elegant Evening Dress',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1983',
    isNew: true,
  },
];

export function FeaturedProducts() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-neutral-800 mb-2 text-center">Featured Products</h2>
        <p className="text-neutral-600 mb-10 text-center max-w-2xl mx-auto">
          Discover our latest arrivals and bestsellers
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden group cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-0 relative">
                <div className="h-72 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                {product.isNew && (
                  <Badge className="absolute top-2 right-2 bg-neutral-800 hover:bg-neutral-700">New</Badge>
                )}
                {product.isSale && (
                  <Badge className="absolute top-2 right-2 bg-neutral-700 hover:bg-neutral-600">Sale</Badge>
                )}
              </CardContent>
              <CardFooter className="flex flex-col items-start p-4">
                <h3 className="font-medium text-neutral-800">{product.name}</h3>
                <p className="text-neutral-600">${product.price.toFixed(2)}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
