# Accessibility Guide

## WCAG 2.1 Compliance

### Level A Requirements
- [x] Text alternatives for images
- [x] Keyboard navigation
- [x] No keyboard traps
- [x] Skip links

### Level AA Requirements
- [x] Color contrast 4.5:1
- [x] Resizable text
- [x] Focus visible
- [x] Error identification

## Implementation

### Components

#### Skip Links
```tsx
import { SkipLinks } from '@/components/a11y/SkipLinks';
```

#### Live Regions
```tsx
import { LiveRegion } from '@/components/a11y/LiveRegion';
```

#### Visually Hidden
```tsx
import { VisuallyHidden } from '@/components/a11y/VisuallyHidden';
```

### Hooks

#### Focus Trap
```tsx
import { useFocusTrap } from '@/hooks/useFocusTrap';
```

#### Announcements
```tsx
import { useAnnounce } from '@/hooks/useAnnounce';
```

#### Reduced Motion
```tsx
import { useReducedMotion } from '@/hooks/useReducedMotion';
```

## Testing

### Automated
```bash
npm run test:a11y
```

### Manual
- Screen reader testing (NVDA, VoiceOver)
- Keyboard-only navigation
- Color contrast checker

## Resources
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [A11y Project](https://www.a11yproject.com/)
