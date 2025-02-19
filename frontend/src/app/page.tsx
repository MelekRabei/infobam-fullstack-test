import Link from 'next/link';

export default function Home() {
  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">Welcome</h1>
      <p className="mt-4">
        <Link href="/vehicules" className="text-blue-500">
          View Vehicles
        </Link>
      </p>
    </main>
  );
}
