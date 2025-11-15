// app/auth/components/auth-layout.tsx
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-[100dvh] lg:min-h-screen">
      {/* Left Panel - Auth Form */}
      <div className="flex w-full flex-col bg-gradient-to-b from-gray-900 to-[#111111] px-8 py-12 lg:w-2/5 lg:px-16 lg:py-16">
        {/* Branding */}
        <div className="mb-20">
          <Link href="/" className="flex items-center">
            <Image
              src="/uvsuLogo.svg"
              width={40}
              height={40}
              className="h-10 w-10"
              alt=""
            />
            <span className="ml-2 text-lg font-medium text-white">UvsU</span>
          </Link>
        </div>

        <div className="mx-auto flex max-w-sm flex-1 flex-col justify-center">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-[32px] font-normal leading-tight text-white">
              {title}
            </h1>
            <p className="mt-1.5 text-gray-400">{subtitle}</p>
          </div>

          {/* Content */}
          {children}

          {/* Terms & Privacy */}
          <div className="mt-auto pt-10">
            <p className="text-xs text-gray-600">
              By continuing, you agree to UvsU's{" "}
              <Link
                href="/terms"
                className="text-gray-500 transition-colors hover:text-teal-400"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-gray-500 transition-colors hover:text-teal-400"
              >
                Privacy Policy
              </Link>
              , and to receive periodic updates.
            </p>
          </div>
        </div>
      </div>

      {/* Vertical Separator Line - Only visible on lg screens */}
      <div className="hidden flex-col items-center justify-center lg:flex">
        <div className="h-[80%] w-[3px] rounded-full bg-gradient-to-b from-transparent via-teal-500/50 to-transparent shadow-md blur-[1px]"></div>
      </div>

      {/* Right Panel - Testimonial - Only visible on lg screens */}
      <div className="relative hidden bg-gradient-to-br from-[#0A0A0A] via-[#0D1214] to-[#0A0A0A] lg:block lg:w-3/5">
        {/* Documentation Button */}
        <div className="absolute right-6 top-6">
          <Link
            href="https://www.dasch.solutions"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              size="sm"
              className="h-8 transition-colors"
            >
              <ExternalLink className="mr-2 h-3.5 w-3.5" />
              Dasch Solutions
            </Button>
          </Link>
        </div>

        <div className="flex h-full flex-col items-center justify-center px-16">
          <div className="relative max-w-md">
            <div className="absolute -left-6 -top-10 font-serif text-7xl text-teal-500/30">
              "
            </div>
            <div className="absolute -bottom-16 -right-6 font-serif text-7xl text-teal-500/30">
              "
            </div>
            <blockquote className="relative z-10 mb-10 rounded-r-lg border-l-4 border-teal-500/50 bg-white/5 px-8 py-4 text-3xl font-normal italic leading-snug text-white">
              @UvsU is insane.
            </blockquote>
            <div className="ml-8 mt-6 flex items-center">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-700 font-bold text-white">
                <Image
                  src="/placeholder.svg?height=40&width=40"
                  alt="User avatar"
                  className="h-full w-full object-cover"
                  width={40}
                  height={40}
                />
              </div>
              <div className="ml-3">
                <p className="text-gray-500">@uvsuuniverse</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
