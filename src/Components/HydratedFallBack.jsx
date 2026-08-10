const HydrateFallback = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary-500" />

        <p className="mt-4 font-body text-sm text-text-secondary">Loading...</p>
      </div>
    </div>
  );
};

export default HydrateFallback;
