import Link from "next/link";

export default function Home() {
  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold">Electric Shop ⚡</h1>
      <Link href="/products" className="text-blue-500">
        View Products
      </Link>
    </div>
  );
}
