import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function Newsletter() {
  return (
    <section className="py-16 bg-neutral-100">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-neutral-800 mb-4">Join Our Newsletter</h2>
          <p className="text-neutral-600 mb-8">
            Subscribe to receive updates on new arrivals, special offers, and styling tips.
          </p>

          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Your email address"
              className="flex-grow bg-white border-neutral-300"
              required
            />
            <Button type="submit" className="bg-neutral-800 hover:bg-neutral-700 text-white">
              Subscribe
            </Button>
          </form>

          <p className="text-neutral-500 text-sm mt-4">
            By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
          </p>
        </div>
      </div>
    </section>
  );
}
