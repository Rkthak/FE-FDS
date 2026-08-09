import { Link } from "react-router";

const ErrorPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center">
        <h1 className="font-logo text-8xl font-black text-primary-500">404</h1>

        <div className="mt-4 text-6xl">🍽️</div>

        <h2 className="mt-6 font-heading text-3xl font-bold text-text-primary">
          Page Not Found
        </h2>

        <p className="mt-3 font-body text-text-secondary">
          Sorry, the page you're looking for doesn't exist.
        </p>

        <Link
          to="/"
          className="mt-8 inline-block rounded-xl bg-primary-500 px-6 py-3 font-body text-sm font-semibold text-white hover:bg-primary-600"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
