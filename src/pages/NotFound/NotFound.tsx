import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#1C1C27] to-[#333447] px-4 text-center">
      <div className="mx-auto max-w-md space-y-6">
        {/* 404 Illustration */}
        <div className="relative mx-auto h-64 w-64">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-[180px] font-bold text-[#2A2A38]">
            404
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
            <svg
              width="200"
              height="200"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-48 w-48"
            >
              <circle
                cx="100"
                cy="100"
                r="80"
                stroke="#333447"
                strokeWidth="2"
              />
              <path
                d="M65 95C65 90.5817 68.5817 87 73 87H127C131.418 87 135 90.5817 135 95V128C135 132.418 131.418 136 127 136H73C68.5817 136 65 132.418 65 128V95Z"
                fill="#2A2A38"
                stroke="#4D4D68"
                strokeWidth="2"
              />
              <path
                d="M65 95L100 115L135 95"
                stroke="#4D4D68"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle
                cx="100"
                cy="60"
                r="15"
                fill="#2A2A38"
                stroke="#4D4D68"
                strokeWidth="2"
              />
              <path
                d="M125 155L75 155"
                stroke="#4D4D68"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl">
            Page not found
          </h1>
          <p className="text-gray-300">
            Sorry, we couldn't find the page you're looking for. It might have
            been moved, deleted, or never existed.
          </p>
        </div>

        {/* Navigation Options */}
        <div className="space-y-3">
          <Button
            asChild
            variant="outline"
            className="w-full border-[#4D4D68] text-gray-300 hover:bg-[#2A2A38] hover:text-white"
          >
            <Link to="/">Back to Home</Link>
          </Button>
          <div className="flex justify-center space-x-4 text-sm">
            <Link
              to="/contactus"
              className="text-gray-300 hover:text-white hover:underline"
            >
              Contact Support
            </Link>
            <span className="text-[#4D4D68]">|</span>
            <Link
              to="/privacy-policy"
              className="text-gray-300 hover:text-white hover:underline"
            >
              Privacy Policy
            </Link>
            <span className="text-[#4D4D68]">|</span>
            <Link
              to="/terms-of-use"
              className="text-gray-300 hover:text-white hover:underline"
            >
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
