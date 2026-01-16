# ProscoutAI Chat Interface - Design Decisions

## Visual Hierarchy & Layout

### Message Bubbles
- **User Messages**: White background, primary-colored avatar
  - Clean and minimal
  - Left-aligned avatar maintains reading flow
  - Ring on avatar adds subtle depth

- **AI Messages**: Light gray background (`secondary-50/50`)
  - Gradient avatar (primary-500 to primary-600)
  - Distinguishable at a glance without being distracting
  - Slightly different background creates alternating rhythm

### Avatar Design
- **Size**: 40px (h-10 w-10) - Large enough to be noticed, small enough not to dominate
- **Shape**: Circular - Friendly, approachable, consistent with modern chat UIs
- **Icons**:
  - User: Simple user icon
  - AI: Bot icon representing intelligence
- **Colors**:
  - User: Teal ring on light background
  - AI: White icon on teal gradient

### Message Layout
- **Padding**: `px-4 py-6` - Generous vertical spacing for comfortable reading
- **Gap**: `gap-4` between avatar and content
- **Max Width**: 768px (3xl) - Optimal line length for reading comprehension

## Typography Scale

### Content Hierarchy
```
Message Label (Sender):  text-sm font-semibold (14px, 600 weight)
Message Content:         text-sm (14px, 400 weight)
Timestamp:              text-xs text-secondary-400 (12px, muted)
Input Hints:            text-xs text-secondary-500 (12px, slightly darker)
Character Counter:      text-xs (12px)
```

### Line Height
- **Message Content**: `leading-relaxed` - Extra spacing for comfortable reading
- **Prevents**: Visual fatigue during long conversations

## Color System

### Backgrounds
```css
Page Background:        bg-white
User Message:          bg-white
AI Message:            bg-secondary-50/50 (subtle gray)
Input Active:          white with border highlight
Empty State:           white
```

### Accents
```css
Primary Brand:         #14b8a6 (Teal)
AI Avatar Gradient:    from-primary-500 to-primary-600
User Avatar Ring:      ring-primary-200
Online Status:         bg-success-500 (Green)
Send Button:           Gradient from-primary-500 to-primary-600
```

### Text Colors
```css
Primary Text:          text-secondary-900 (#0f172a)
Secondary Text:        text-secondary-600 (#475569)
Muted Text:           text-secondary-400 (#94a3b8)
Placeholder:          text-secondary-400
```

## Spacing System

### Component Spacing
```css
Message Padding:       px-4 py-6 (16px horizontal, 24px vertical)
Input Container:       px-4 py-4 (16px all around)
Header Padding:        px-6 py-4 (24px horizontal, 16px vertical)

Element Gaps:
- Avatar to Content:   gap-4 (16px)
- Label Elements:      gap-2 (8px)
- Section Groups:      gap-3 (12px)
```

### Container Widths
```css
Max Content Width:     max-w-3xl (768px)
Reasoning:
- Optimal reading line length (50-75 characters)
- Prevents eye strain from wide text blocks
- Creates focused conversation area
```

## Animation Philosophy

### Timing Functions
```css
Fast Interactions:     200ms cubic-bezier(0.4, 0, 0.2, 1)
Page Transitions:      300-400ms cubic-bezier(0.4, 0, 0.2, 1)
Micro-interactions:    150ms ease
```

### Animation Purposes
1. **New Message**: Slide-up animation
   - Duration: 400ms
   - Effect: Message appears from below
   - Purpose: Draws attention to new content naturally

2. **Typing Indicator**: Bouncing dots
   - Staggered delays: -0.3s, -0.15s, 0s
   - Effect: Wave motion
   - Purpose: Creates anticipation, indicates system is working

3. **Send Button**: Active scale
   - Effect: `active:scale-[0.98]`
   - Purpose: Tactile feedback on interaction

4. **Online Status**: Pulse animation
   - Duration: 2s infinite
   - Effect: Subtle opacity change
   - Purpose: Indicates live connection

### Reduced Motion Support
All animations respect `prefers-reduced-motion` media query for accessibility.

## Interaction Patterns

### Input Behavior
1. **Auto-expand**: Textarea grows with content
   - Min Height: 44px
   - Max Height: 200px
   - Smooth height transition

2. **Send Triggers**:
   - Enter key (without Shift)
   - Click send button
   - Both disabled while loading

3. **Visual Feedback**:
   - Border changes from gray to teal when active
   - Ring appears on focus (ring-4 ring-primary-100)
   - Send button activates (gradient) when text present

### Scroll Behavior
1. **Auto-scroll**: New messages trigger smooth scroll to bottom
2. **Initial Load**: Instant scroll on mount
3. **User Control**: Can scroll up to read history
4. **Smooth Scrolling**: `scroll-behavior: smooth` in CSS

## Empty State Design

### Components
1. **Icon**: Large gradient teal circle with lightning bolt
2. **Heading**: "Olá! Como posso ajudar?"
3. **Description**: Brief explanation of capabilities
4. **Example Prompts**: 3 pill-shaped suggestion badges

### Purpose
- Reduces intimidation for first-time users
- Provides clear guidance on what to ask
- Sets expectations for AI capabilities
- Invites interaction through friendly tone

## Loading States

### Typing Indicator
```
Structure:
- AI avatar (with spinning loader)
- "ProscoutAI" label
- "digitando..." timestamp
- Three bouncing dots
```

### Purpose
- Sets clear expectation that response is coming
- Prevents user from sending multiple messages
- Creates anticipation without anxiety
- Maintains visual consistency with regular messages

## Responsive Design Considerations

### Mobile (< 768px)
- Same layout (already mobile-optimized)
- Touch-friendly tap targets (44px minimum)
- Full-width input on small screens
- Optimized scrolling for touch

### Tablet (768px - 1024px)
- Max-width container prevents overly wide lines
- Comfortable spacing maintained
- All interactions remain touch-friendly

### Desktop (> 1024px)
- Centered max-width container
- Hover states on interactive elements
- Keyboard shortcuts prominently displayed
- Mouse-optimized scrollbars

## Accessibility Decisions

### Keyboard Navigation
- Natural tab order (header → messages → input → send)
- Clear focus indicators (2px teal ring)
- Enter/Shift+Enter for send/new line
- Focus trapped in input during typing

### Screen Readers
- Semantic HTML (`<main>`, `<section>`, `<button>`)
- ARIA labels on icon buttons
- Role="status" on loading indicator
- Alt text on all images/icons

### Visual Accessibility
- Contrast ratios exceed WCAG AA (4.5:1 for text)
- Focus indicators visible in all states
- No color-only information conveyance
- Resizable text support

### Cognitive Accessibility
- Predictable layout and behavior
- Clear, simple language
- Consistent visual patterns
- Helpful error messages
- Undo capabilities (future)

## Design Rationale

### Why Alternating Backgrounds?
- **Problem**: Long conversations become difficult to parse
- **Solution**: Subtle background alternation creates visual rhythm
- **Benefit**: Easier to track who said what at a glance

### Why Auto-expanding Input?
- **Problem**: Fixed-height textarea limits expression
- **Solution**: Input grows with content up to reasonable limit
- **Benefit**: User sees full message before sending, reducing errors

### Why Max-Width Container?
- **Problem**: Wide screens create very long line lengths
- **Solution**: Container maxes out at 768px
- **Benefit**: Comfortable reading experience across all screen sizes

### Why Gradient Avatars?
- **Problem**: Flat colors can feel boring
- **Solution**: Subtle gradient adds depth and polish
- **Benefit**: Professional appearance without being flashy

### Why Typing Indicator?
- **Problem**: Users don't know if system received their message
- **Solution**: Immediate visual feedback that AI is responding
- **Benefit**: Reduces anxiety, sets clear expectations

## Future Design Considerations

### Conversation History
- Left sidebar with past conversations
- Search and filter capabilities
- Favorites/pinned conversations

### Rich Content Support
- Markdown rendering for formatted text
- Code blocks with syntax highlighting
- Embedded images and charts
- Interactive elements (buttons, forms)

### Personalization
- User avatar customization
- Theme variants (light/dark mode)
- Adjustable text size
- Conversation export formats

### Advanced Interactions
- Message reactions
- Copy to clipboard buttons
- Regenerate response option
- Edit sent messages
- Voice input/output

## Conclusion

Every design decision prioritizes user comfort and emotional engagement. The interface feels professional yet approachable, modern yet familiar. By following established patterns from successful chat interfaces (like Claude) while maintaining the app's design system, we create a cohesive experience that users will find both powerful and pleasant to use.
