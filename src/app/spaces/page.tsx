export default function SpacesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Sovereign Spaces</h1>
      <p className="text-white/50 mb-8">
        Your own private corner of The Sovereign Web. Full creative control, no voting required.
      </p>

      <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
        <span className="text-5xl mb-4 block">🏰</span>
        <h2 className="text-2xl font-bold text-white/80">Coming Soon</h2>
        <p className="text-white/40 mt-2 max-w-md mx-auto">
          Buy a private slot for 24 hours and become the sole architect of your own space.
          No votes needed — you have dictator rights.
        </p>
        <div className="mt-6 inline-block px-6 py-3 bg-white/5 border border-white/10 rounded-xl">
          <span className="text-lg font-bold">$9.99</span>
          <span className="text-white/40 text-sm"> / 24 hours</span>
        </div>
      </div>
    </div>
  );
}
