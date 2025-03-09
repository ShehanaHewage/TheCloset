import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

type Testimonial = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  content: string;
};

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Emma Thompson',
    role: 'Fashion Enthusiast',
    avatar: 'https://i.pravatar.cc/150?img=1',
    content:
      "The quality of clothes from The Closet is exceptional. I've been a loyal customer for years and have never been disappointed.",
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Business Professional',
    avatar: 'https://i.pravatar.cc/150?img=8',
    content:
      'Their collection of business attire is perfect for my needs. The fabrics are comfortable and the styles are timeless.',
  },
  {
    id: '3',
    name: 'Sophia Rodriguez',
    role: 'Style Blogger',
    avatar: 'https://i.pravatar.cc/150?img=5',
    content:
      'I always recommend The Closet to my followers. Their pieces are versatile, on-trend, and surprisingly affordable.',
  },
];

export function Testimonials() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-neutral-800 mb-2 text-center">What Our Customers Say</h2>
        <p className="text-neutral-600 mb-10 text-center max-w-2xl mx-auto">
          Hear from our satisfied customers about their experience with The Closet
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-neutral-800">{testimonial.name}</h3>
                    <p className="text-sm text-neutral-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-neutral-600 italic">"{testimonial.content}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
