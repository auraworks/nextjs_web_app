export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center pt-safe-top">
      <div className="max-w-md w-full mx-auto px-safe-left pr-safe-right">
        {children}
      </div>
    </div>
  );
}
