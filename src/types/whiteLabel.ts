export interface WhiteLabelConfig {
  // Branding
  companyName: string;
  logo: string;
  logoSmall?: string;
  favicon: string;

  // Colors
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;

  // Typography
  fontFamily: string;
  headingFontFamily?: string;

  // Features
  enabledModules: string[];
  customFeatures?: Record<string, boolean>;

  // Custom Domain
  customDomain?: string;
  subdomainPrefix?: string;

  // Email
  fromEmail: string;
  fromName: string;
  emailFooter?: string;

  // Metadata
  metaTitle?: string;
  metaDescription?: string;

  // Support
  supportEmail?: string;
  supportPhone?: string;
  helpUrl?: string;

  // Legal
  termsUrl?: string;
  privacyUrl?: string;
}

export const DEFAULT_WHITE_LABEL: WhiteLabelConfig = {
  companyName: "Match ATS",
  logo: "/logo.svg",
  favicon: "/favicon.ico",
  primaryColor: "#8B5CF6",
  secondaryColor: "#3B82F6",
  accentColor: "#10B981",
  backgroundColor: "#FFFFFF",
  textColor: "#1F2937",
  fontFamily: "Inter, sans-serif",
  enabledModules: ["candidates", "jobs", "pipeline", "reports", "settings"],
  fromEmail: "noreply@matchats.com",
  fromName: "Match ATS",
};
