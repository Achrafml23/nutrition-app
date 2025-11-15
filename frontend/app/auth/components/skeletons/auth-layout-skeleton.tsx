// app/auth/components/skeletons/auth-layout-skeleton.tsx
export function AuthLayoutSkeleton() {
  return (
    <div className="flex min-h-[100dvh] lg:min-h-screen">
      {/* Left Panel - Auth Form Skeleton */}
      <div className="flex w-full flex-col bg-gradient-to-b from-gray-900 to-[#111111] px-8 py-12 lg:w-2/5 lg:px-16 lg:py-16">
        {/* Branding Skeleton */}
        <div className="mb-20">
          <div className="flex items-center">
            <div className="h-10 w-10 animate-pulse rounded bg-gray-700" />
            <div className="ml-2 h-6 w-16 animate-pulse rounded bg-gray-700" />
          </div>
        </div>

        <div className="mx-auto flex max-w-sm flex-1 flex-col justify-center">
          {/* Header Skeleton */}
          <div className="mb-10 space-y-2 text-center">
            <div className="mx-auto h-10 w-48 animate-pulse rounded bg-gray-700" />
            <div className="mx-auto h-5 w-32 animate-pulse rounded bg-gray-700" />
          </div>

          {/* Social Buttons Skeleton */}
          <div className="mb-6 space-y-3">
            <div className="h-10 w-full animate-pulse rounded bg-gray-700" />
            <div className="h-10 w-full animate-pulse rounded bg-gray-700" />
          </div>

          {/* Divider Skeleton */}
          <div className="relative mb-6">
            <div className="h-px w-full bg-gray-800" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="h-4 w-6 animate-pulse rounded bg-gray-700" />
            </div>
          </div>

          {/* Form Skeleton */}
          <div className="space-y-5">
            {/* Email Field */}
            <div>
              <div className="mb-1.5 h-4 w-16 animate-pulse rounded bg-gray-700" />
              <div className="h-10 w-full animate-pulse rounded bg-gray-700" />
            </div>

            {/* Password Field */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <div className="h-4 w-20 animate-pulse rounded bg-gray-700" />
                <div className="h-4 w-28 animate-pulse rounded bg-gray-700" />
              </div>
              <div className="h-10 w-full animate-pulse rounded bg-gray-700" />
            </div>

            {/* Submit Button */}
            <div className="h-10 w-full animate-pulse rounded bg-gray-700" />
          </div>

          {/* Sign Up Link Skeleton */}
          <div className="mt-8">
            <div className="mx-auto h-4 w-40 animate-pulse rounded bg-gray-700" />
          </div>

          {/* Terms Skeleton */}
          <div className="mt-auto space-y-2 pt-10">
            <div className="h-3 w-full animate-pulse rounded bg-gray-800" />
            <div className="h-3 w-3/4 animate-pulse rounded bg-gray-800" />
          </div>
        </div>
      </div>

      {/* Vertical Separator - Only visible on lg screens */}
      <div className="hidden flex-col items-center justify-center lg:flex">
        <div className="h-[80%] w-[3px] rounded-full bg-gradient-to-b from-transparent via-gray-600/50 to-transparent" />
      </div>

      {/* Right Panel Skeleton - Only visible on lg screens */}
      <div className="relative hidden bg-gradient-to-br from-[#0A0A0A] via-[#0D1214] to-[#0A0A0A] lg:block lg:w-3/5">
        {/* Documentation Button Skeleton */}
        <div className="absolute right-6 top-6">
          <div className="h-8 w-32 animate-pulse rounded bg-gray-700" />
        </div>

        <div className="flex h-full flex-col items-center justify-center px-16">
          <div className="relative max-w-md">
            {/* Quote Skeleton */}
            <div className="mb-10 space-y-3">
              <div className="h-8 w-full animate-pulse rounded bg-gray-700" />
              <div className="h-8 w-4/5 animate-pulse rounded bg-gray-700" />
              <div className="h-8 w-3/5 animate-pulse rounded bg-gray-700" />
            </div>

            {/* Avatar and Name Skeleton */}
            <div className="ml-8 mt-6 flex items-center">
              <div className="h-10 w-10 animate-pulse rounded-full bg-gray-700" />
              <div className="ml-3">
                <div className="h-4 w-24 animate-pulse rounded bg-gray-700" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
