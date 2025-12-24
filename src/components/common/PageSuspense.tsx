import { Suspense, ReactNode , memo} from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface PageSuspenseProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const DefaultFallback = () => (
  <div className="flex flex-col space-y-4 p-6">
    <Skeleton className="h-8 w-64" />
    <Skeleton className="h-4 w-48" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      <Skeleton className="h-32" />
      <Skeleton className="h-32" />
      <Skeleton className="h-32" />
    </div>
    <Skeleton className="h-64 mt-6" />
  </div>
);

export const PageSuspense = ({ children, fallback }: PageSuspenseProps) => {
  return (
    <Suspense fallback={fallback ?? <DefaultFallback />}>
      {children}
    </Suspense>
  );
};

PageSuspense.displayName = 'PageSuspense';

export default PageSuspense;
