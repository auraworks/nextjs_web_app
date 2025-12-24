export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 w-full h-full bg-gray-100 z-50">
      {children}
    </div>
  );
}
