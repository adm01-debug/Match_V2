import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { Layout } from './Layout';
import { BrowserRouter } from 'react-router-dom';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

expect.extend(matchers);

// Mock components that might be problematic in JSDOM or need complex contexts
vi.mock('@/components/ui/sidebar', () => ({
  SidebarProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SidebarInset: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SidebarTrigger: () => <button>Sidebar</button>,
}));

vi.mock('./AppSidebar', () => ({
  AppSidebar: () => <nav>Sidebar</nav>,
}));

vi.mock('@/components/navigation/BottomNavigation', () => ({
  BottomNavigation: () => <footer>Bottom Nav</footer>,
}));

describe('Layout Accessibility', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <NotificationProvider>
          <BrowserRouter>
            <Layout title="Test Page">
              <div>Main Content</div>
            </Layout>
          </BrowserRouter>
        </NotificationProvider>
      </QueryClientProvider>
    );

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
