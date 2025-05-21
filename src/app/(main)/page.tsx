import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex-1 px-2">
      <section className="flex justify-center">
        <div className="flex flex-col items-center text-center space-y-4 py-10">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Make informed IPO investment decisions
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl">
            Real-time insights, analytics, and data visualization for upcoming
            and ongoing IPOs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
