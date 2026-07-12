import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Loader2 } from "lucide-react";
import { SpeedInsights } from "@vercel/speed-insights/react";

import { AuthProvider } from "./contexts/AuthContext";
import { CandidatoAuthProvider } from "./contexts/CandidatoAuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { AnalyticsProvider } from "./contexts/AnalyticsProvider";
import { AnimatedRoutes } from "./components/layout/AnimatedRoutes";
import { GlobalShortcutsProvider } from "./components/common/GlobalShortcutsProvider";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { NewDeviceDetector } from "./components/auth/NewDeviceDetector";
import { OnboardingProvider } from "./components/onboarding/OnboardingProvider";
import { AppRoutes } from "./routes/AppRoutes";

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <TooltipProvider>
          <BrowserRouter>
            <AnalyticsProvider>
              <AuthProvider>
                <CandidatoAuthProvider>
                  <NotificationProvider>
                    <OnboardingProvider>
                      <ErrorBoundary>
                        <GlobalShortcutsProvider>
                          <NewDeviceDetector />
                          <Suspense fallback={<PageLoader />}>
                            <AnimatedRoutes>
                              <AppRoutes />
                            </AnimatedRoutes>
                          </Suspense>
                        </GlobalShortcutsProvider>
                      </ErrorBoundary>
                    </OnboardingProvider>

                    <Toaster />
                    <Sonner />
                  </NotificationProvider>
                </CandidatoAuthProvider>
              </AuthProvider>
            </AnalyticsProvider>
          </BrowserRouter>
          <SpeedInsights />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
