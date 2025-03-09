import { AppButton } from '../common/AppButton';

export function Hero() {
  return (
    <div className="relative h-[700px] w-full overflow-hidden bg-neutral-100">
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/90 via-neutral-900/80 to-neutral-900/90 backdrop-blur-sm z-10"></div>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070')" }}
      ></div>
      <div className="relative z-20 flex flex-col items-start justify-center h-full px-8 md:px-16 max-w-5xl mx-auto pt-20">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-xl">The Closet</h1>
        <p className="text-xl md:text-2xl text-white mb-8 drop-shadow-md">Make your closet elegant</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <AppButton
            size="lg"
            variant="outline"
            className="bg-transparent border-2 border-white text-white hover:bg-white/20 shadow-md"
            to="/catalog"
          >
            Our Collection
          </AppButton>
        </div>
      </div>
    </div>
  );
}
