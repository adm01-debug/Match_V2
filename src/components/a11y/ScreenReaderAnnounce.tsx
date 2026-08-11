/**
 * @fileoverview Screen Reader Announcements
 * Provides accessible announcements for dynamic content changes
 */

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { LiveRegion } from "./LiveRegion";

type Politeness = "polite" | "assertive" | "off";

interface AnnounceContextType {
  announce: (message: string, politeness?: Politeness) => void;
  announcePolite: (message: string) => void;
  announceAssertive: (message: string) => void;
  clearAnnouncements: () => void;
}

const AnnounceContext = createContext<AnnounceContextType | undefined>(undefined);

interface ScreenReaderAnnounceProviderProps {
  children: ReactNode;
}

export function ScreenReaderAnnounceProvider({ children }: ScreenReaderAnnounceProviderProps) {
  const [politeMessage, setPoliteMessage] = useState("");
  const [assertiveMessage, setAssertiveMessage] = useState("");

  const announce = useCallback((message: string, politeness: Politeness = "polite") => {
    if (politeness === "polite") {
      setPoliteMessage("");
      // Small delay to ensure screen readers pick up the change
      setTimeout(() => setPoliteMessage(message), 100);
    } else if (politeness === "assertive") {
      setAssertiveMessage("");
      setTimeout(() => setAssertiveMessage(message), 100);
    }

    // Clear after announcement
    setTimeout(() => {
      if (politeness === "polite") {
        setPoliteMessage("");
      } else {
        setAssertiveMessage("");
      }
    }, 3000);
  }, []);

  const announcePolite = useCallback((message: string) => {
    announce(message, "polite");
  }, [announce]);

  const announceAssertive = useCallback((message: string) => {
    announce(message, "assertive");
  }, [announce]);

  const clearAnnouncements = useCallback(() => {
    setPoliteMessage("");
    setAssertiveMessage("");
  }, []);

  return (
    <AnnounceContext.Provider
      value={{
        announce,
        announcePolite,
        announceAssertive,
        clearAnnouncements
      }}
    >
      {children}
      
      {/* Polite announcements */}
      <LiveRegion mode="polite">
        {politeMessage}
      </LiveRegion>
      
      {/* Assertive announcements */}
      <LiveRegion mode="assertive">
        {assertiveMessage}
      </LiveRegion>
    </AnnounceContext.Provider>
  );
}

export function useAnnounce() {
  const context = useContext(AnnounceContext);
  if (context === undefined) {
    throw new Error("useAnnounce must be used within a ScreenReaderAnnounceProvider");
  }
  return context;
}

/**
 * Hook for common announcement patterns
 */
export function useAccessibleAnnouncements() {
  const { announce, announcePolite, announceAssertive } = useAnnounce();

  return {
    // Navigation announcements
    announcePageChange: (pageName: string) => 
      announcePolite(`Navegou para ${pageName}`),
    
    // Loading announcements
    announceLoading: () => 
      announcePolite("Carregando conteúdo..."),
    announceLoadComplete: () => 
      announcePolite("Conteúdo carregado"),
    
    // Form announcements
    announceFormError: (errorCount: number) => 
      announceAssertive(`Formulário contém ${errorCount} erro${errorCount > 1 ? 's' : ''}`),
    announceFormSuccess: () => 
      announcePolite("Formulário enviado com sucesso"),
    
    // Action announcements
    announceAction: (action: string) => 
      announcePolite(action),
    announceError: (error: string) => 
      announceAssertive(`Erro: ${error}`),
    
    // Data announcements
    announceDataUpdate: (description: string) => 
      announcePolite(description),
    announceItemAdded: (itemName: string) => 
      announcePolite(`${itemName} adicionado`),
    announceItemRemoved: (itemName: string) => 
      announcePolite(`${itemName} removido`),
    
    // Generic
    announce,
    announcePolite,
    announceAssertive
  };
}

export default ScreenReaderAnnounceProvider;
