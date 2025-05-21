import { Button } from '@/components/ui/button';
import { ArrowLeft, Info } from 'lucide-react';
import Link from 'next/link';

const AboutPage = () => {
  return (
    <main className="flex-1 px-2 py-10">
      <section className="flex justify-center">
        <div className="flex flex-col items-center text-center space-y-6 max-w-3xl">
          <Info className="h-16 w-16 text-primary mb-4" />
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            About Pulse IPO
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl">
            Pulse IPO is an advanced analytics tool designed to provide
            investors and analysts with real-time insights into upcoming Initial
            Public Offerings (IPOs). We achieve this by meticulously parsing SEC
            EDGAR filings and aggregating social media data from platforms like
            X (formerly Twitter) and Reddit.
          </p>
          <p className="text-lg text-muted-foreground md:text-xl">
            Our platform offers critical metrics such as sentiment scores,
            mention counts, and key financial figures extracted directly from
            S-1 filings and online discussions. This comprehensive data empowers
            our users to make well-informed investment decisions.
          </p>
          <p className="text-lg text-muted-foreground md:text-xl">
            Built with cutting-edge technologies including Next.js 15, React 19,
            Tailwind CSS 4, and Shadcn UI, Pulse IPO ensures a responsive,
            interactive, and secure user experience. User authentication is
            managed via Clerk, safeguarding sensitive financial data. We keep
            our information current with hourly updates on new S-1 filings and
            social media metrics.
          </p>
          <Link href="/">
            <Button variant="outline" size="lg" className="gap-2 mt-6">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
