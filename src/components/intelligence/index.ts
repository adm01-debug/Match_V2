/**
 * @fileoverview Intelligence Components Exports
 * @module components/intelligence
 */

export { SmartSuggestions, QuickSuggestion, SuggestionChips, type Suggestion } from './SmartSuggestions';
export { ContextualHelp, InlineHelp, OnboardingTooltip, type HelpTopic } from './ContextualHelp';
export { 
  KeyboardShortcutsOverlay, 
  KeyBadge, 
  useKeyboardShortcuts, 
  type KeyboardShortcut 
} from './KeyboardShortcuts';
export { 
  RecentActions, 
  QuickActionsFloating, 
  useRecentActions, 
  type RecentAction 
} from './RecentActions';
