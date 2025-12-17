import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <main className="w-full flex justify-center">
        {children}
      </main>
    </div>
  );
}