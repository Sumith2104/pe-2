
"use client";

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AUTH_KEY } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Building, Loader2, LogOut, Database } from 'lucide-react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (isClient) {
      const isAuthenticated = localStorage.getItem(AUTH_KEY) === 'true';
      if (!isAuthenticated) {
        router.replace('/login');
      } else {
        // The user is authenticated for this initial render.
        // Immediately remove the key so that any subsequent page refresh
        // will fail the authentication check and redirect to login.
        localStorage.removeItem(AUTH_KEY);
        setIsAuthenticating(false);
      }
    }
  }, [router, isClient]);

  const handleLogout = () => {
    // This function handles the explicit logout button click.
    localStorage.removeItem(AUTH_KEY);
    router.replace('/login');
  };

  if (!isClient || isAuthenticating) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Building className="h-7 w-7 text-primary" />
            <h1 className="text-xl font-bold font-headline tracking-tight">GymTrack Admin</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/data-center">
                <Database size={16} className="mr-2" />
                Data Center
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-grow container mx-auto py-8 px-4 md:px-6">{children}</main>
      <footer className="border-t border-border py-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} GymTrack Central. All rights reserved.
      </footer>
    </div>
  );
}
