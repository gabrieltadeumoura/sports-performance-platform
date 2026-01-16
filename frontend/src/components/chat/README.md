# Chat Interface Components

Modern, comfortable chat interface inspired by Claude's UI design for the ProscoutAI feature.

## Components

### ChatMessage

Displays individual chat messages with proper styling for user and assistant roles.

**Props:**
- `message: Message` - The message object to display
- `isLatest?: boolean` - Whether this is the latest message (triggers animation)

**Features:**
- Distinct visual treatment for user vs assistant messages
- User messages have white background with primary-colored avatar
- Assistant messages have subtle gray background with gradient avatar
- Timestamps in readable format
- Smooth slide-up animation for new messages
- Responsive typography with proper line spacing
- Support for multi-line content with preserved formatting

**Example:**
```tsx
<ChatMessage
  message={{
    id: '1',
    role: 'user',
    content: 'Hello, how can you help me?',
    timestamp: new Date()
  }}
  isLatest={true}
/>
```

### MessageList

Container component that displays the chat message history with smooth scrolling.

**Props:**
- `messages: Message[]` - Array of messages to display
- `isLoading?: boolean` - Show loading indicator when AI is typing
- `className?: string` - Additional CSS classes

**Features:**
- Auto-scroll to bottom on new messages
- Custom scrollbar styling matching app theme
- Empty state with welcoming message and example prompts
- Loading state with animated typing indicator
- Responsive max-width container (3xl)
- Smooth scroll behavior
- Dividers between messages for visual clarity

**Example:**
```tsx
<MessageList
  messages={conversationMessages}
  isLoading={isWaitingForResponse}
/>
```

### ChatInput

Modern input component with auto-expanding textarea and send button.

**Props:**
- `onSend: (message: string) => void` - Callback when message is sent
- `disabled?: boolean` - Disable input (e.g., while loading)
- `placeholder?: string` - Placeholder text
- `className?: string` - Additional CSS classes

**Features:**
- Auto-expanding textarea (up to 200px height)
- Enter to send, Shift+Enter for new line
- Character counter (max 2000 chars)
- Visual feedback on active state (border + ring)
- Disabled state when loading
- Gradient send button that activates when text is entered
- Helpful hint text for keyboard shortcuts
- Smooth transitions and animations

**Example:**
```tsx
<ChatInput
  onSend={(content) => handleSendMessage(content)}
  disabled={isLoading}
  placeholder="Type your question..."
/>
```

## Message Type

```typescript
interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}
```

## Usage in ProscoutAIPage

The ProscoutAI page demonstrates a complete chat interface:

```tsx
import { useState } from 'react'
import { ChatInput, MessageList, type Message } from '../components/chat'

export function ProscoutAIPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    setIsLoading(true)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'AI response here',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <MessageList messages={messages} isLoading={isLoading} />
      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
    </div>
  )
}
```

## Design System Integration

The chat components follow the app's design system:

### Colors
- **Primary (Teal)**: Brand colors for active states, AI avatar, and accents
- **Secondary (Slate)**: Text colors, borders, and neutral backgrounds
- **Success (Green)**: Online status indicator

### Typography
- **Font**: Inter (consistent with app)
- **Sizes**: Responsive text sizing with proper line height
- **Weight**: Medium for labels, regular for content

### Spacing
- Comfortable padding: `px-4 py-6` for messages
- Consistent gaps: `gap-2`, `gap-3`, `gap-4` hierarchy
- Max-width container: `max-w-3xl` for optimal reading

### Animations
- **Slide-up**: New messages animate in from below
- **Fade-in**: Loading states fade in smoothly
- **Bounce**: Typing indicator dots
- **Pulse**: Online status indicator

### Accessibility
- Semantic HTML structure
- ARIA labels for screen readers
- Focus states on interactive elements
- Keyboard navigation support (Enter, Shift+Enter)
- Reduced motion support (respects user preferences)

## Customization

### Styling
All components use Tailwind CSS classes and can be customized via the `className` prop or by extending the component styles.

### Theming
Colors are based on the app's color palette defined in `tailwind.config.js` and `index.css`. Update theme variables to change the appearance globally.

### Behavior
- Adjust max character limit in ChatInput (currently 2000)
- Modify textarea max height (currently 200px)
- Customize scroll behavior timing
- Add custom loading messages or animations

## Future Enhancements

Potential additions for production:
- Message reactions and interactions
- Code syntax highlighting
- File upload support
- Voice input
- Message editing and deletion
- Conversation history
- Search functionality
- Export conversations
- Typing indicators with real-time updates
- Read receipts
- Multi-modal content (images, charts)
