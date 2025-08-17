import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="text-center py-20 px-5">
      <h1 className="text-7xl mb-5 ">404</h1>
      <p className="text-lg mb-8">
        Oops! The page you&apos;re looking for does not exist
      </p>
      <Link
        href="/"
        className="font-bold text-primary decoration-0 flex items-center justify-center gap-3"
      >
        <FaArrowLeft /> Go Back Home
      </Link>
    </div>
  );
}
