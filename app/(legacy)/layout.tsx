// Legacy pages are designed for light-only appearance and do not support dark mode.
export default function LegacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-white text-black">{children}</div>;
}
