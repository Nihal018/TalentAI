import { Brain } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">TalentAI</span>
            </div>
            <p className="text-gray-400 text-lg mb-6 max-w-md">
              Revolutionizing job search with AI-powered matching and
              skill-based assessments.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-400 hover:text-white bg-transparent"
              >
                Privacy Policy
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-400 hover:text-white bg-transparent"
              >
                Terms of Service
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">For Job Seekers</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="/browse-jobs"
                  className="hover:text-white transition-colors"
                >
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/auth"
                  className="hover:text-white transition-colors"
                >
                  Create Profile
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Career Resources
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">For Employers</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="/auth"
                  className="hover:text-white transition-colors"
                >
                  Post Jobs
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Find Talent
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>
            &copy; 2025 TalentAI. All rights reserved. Built with ❤️ for the
            future of work.
          </p>
        </div>
      </div>
    </footer>
  );
}
