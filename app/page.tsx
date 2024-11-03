import { BrainCog } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ModeToggle } from '@/components/theme-toggler';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
      <div className="top-left"><ModeToggle /></div>
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <BrainCog className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-4xl font-bold tracking-tight">Welcome to the maths quiz</CardTitle>
           
          </CardHeader>
          <CardContent className="flex flex-col gap-4 items-center">
            <Link href="/quiz" className="w-full max-w-xs">
              <Button className="w-full" size="lg">
                Start Quiz
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}