import { Button } from '@/components/ui/button';
import { ArrowLeft, Construction } from 'lucide-react';
import Link from 'next/link';

const UnderDevelopmentPage = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center h-full">
      <Construction className="h-16 w-16 text-slate-400 mb-6" />
      <h2 className="text-3xl font-bold tracking-tight text-slate-100 mb-2">
        Dashboard Under Development
      </h2>
      <p className="text-lg text-slate-300 max-w-md mb-8">
        We&apos;re working hard to bring you an amazing dashboard experience.
        Please check back soon for updates!
      </p>
      <Link href="/">
        <Button
          variant="outline"
          className="gap-2 bg-transparent hover:bg-slate-700 text-slate-300 hover:text-slate-100 border-slate-600 hover:border-slate-500"
        >
          <ArrowLeft className="h-4 w-4" />
          Go back to Homepage
        </Button>
      </Link>
    </div>
  );
};

export default UnderDevelopmentPage;
