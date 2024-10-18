"use client";

import { Header } from "./components/header";

export default function Page() {
  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-4">Main Content</h1>
          <p className="text-gray-700">
            This is where your main content will go.
          </p>
        </div>
      </main>
    </div>
  );
}
