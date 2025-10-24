'use client';

import {
  Branch,
  BranchMessages,
  BranchNext,
  BranchPage,
  BranchPrevious,
  BranchSelector,
} from '@/components/ai-elements/branch';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  type PromptInputMessage,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSpeechButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
} from '@/components/ai-elements/prompt-input';
import {
  Message,
  MessageContent,
} from '@/components/ai-elements/message';
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from '@/components/ai-elements/reasoning';
import { Response } from '@/components/ai-elements/response';
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from '@/components/ai-elements/sources';
import {
  Suggestion,
  Suggestions,
} from '@/components/ai-elements/suggestion';
import { GlobeIcon, SparklesIcon, Menu, Search, Settings, User } from 'lucide-react';
import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import type { ToolUIPart } from 'ai';
import { nanoid } from 'nanoid';

type MessageType = {
  key: string;
  from: 'user' | 'assistant';
  sources?: { href: string; title: string }[];
  versions: {
    id: string;
    content: string;
  }[];
  reasoning?: {
    content: string;
    duration: number;
  };
  tools?: {
    name: string;
    description: string;
    status: ToolUIPart['state'];
    parameters: Record<string, unknown>;
    result: string | undefined;
    error: string | undefined;
  }[];
  avatar: string;
  name: string;
};

const initialMessages: MessageType[] = [
  {
    key: nanoid(),
    from: 'assistant',
    versions: [
      {
        id: nanoid(),
        content: 'Hello! I\'m your AI assistant. I can help you with coding, writing, research, and more. What would you like to work on today?',
      },
    ],
    avatar: 'https://github.com/openai.png',
    name: 'AI Assistant',
  },
];

const models = [
  { id: 'gpt-4', name: 'GPT-4' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
  { id: 'claude-2', name: 'Claude 2' },
  { id: 'claude-instant', name: 'Claude Instant' },
  { id: 'palm-2', name: 'PaLM 2' },
  { id: 'llama-2-70b', name: 'Llama 2 70B' },
  { id: 'llama-2-13b', name: 'Llama 2 13B' },
  { id: 'cohere-command', name: 'Command' },
  { id: 'mistral-7b', name: 'Mistral 7B' },
];

const suggestions = [
  'Help me write a function to sort an array',
  'Explain how recursion works',
  'Create a todo list app in React',
  'Debug this error message',
];

const mockResponses = [
  "That's a great question! Let me help you understand this concept better. The key thing to remember is that proper implementation requires careful consideration of the underlying principles and best practices in the field.",
  "I'd be happy to explain this topic in detail. From my understanding, there are several important factors to consider when approaching this problem. Let me break it down step by step for you.",
  "This is an interesting topic that comes up frequently. The solution typically involves understanding the core concepts and applying them in the right context. Here's what I recommend...",
  "Great choice of topic! This is something that many developers encounter. The approach I'd suggest is to start with the fundamentals and then build up to more complex scenarios.",
  "That's definitely worth exploring. From what I can see, the best way to handle this is to consider both the theoretical aspects and practical implementation details.",
];

const Example = () => {
  const [model, setModel] = useState<string>(models[0].id);
  const [text, setText] = useState<string>('');
  const [useWebSearch, setUseWebSearch] = useState<boolean>(false);
  const [status, setStatus] = useState<
    'submitted' | 'streaming' | 'ready' | 'error'
  >('ready');
  const [messages, setMessages] = useState<MessageType[]>(initialMessages);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null,
  );
  const shouldCancelRef = useRef<boolean>(false);
  const addMessageTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const stop = useCallback(() => {
    console.log('Stopping generation...');

    // Set cancellation flag
    shouldCancelRef.current = true;

    // Clear timeout for adding assistant message
    if (addMessageTimeoutRef.current) {
      clearTimeout(addMessageTimeoutRef.current);
      addMessageTimeoutRef.current = null;
    }

    setStatus('ready');
    setStreamingMessageId(null);
  }, []);

  const streamResponse = useCallback(
    async (messageId: string, content: string) => {
      setStatus('streaming');
      setStreamingMessageId(messageId);
      shouldCancelRef.current = false;

      const words = content.split(' ');
      let currentContent = '';

      for (let i = 0; i < words.length; i++) {
        // Check if streaming should be cancelled
        if (shouldCancelRef.current) {
          setStatus('ready');
          setStreamingMessageId(null);
          return;
        }

        currentContent += (i > 0 ? ' ' : '') + words[i];

        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.versions.some((v) => v.id === messageId)) {
              return {
                ...msg,
                versions: msg.versions.map((v) =>
                  v.id === messageId ? { ...v, content: currentContent } : v,
                ),
              };
            }
            return msg;
          }),
        );

        await new Promise((resolve) =>
          setTimeout(resolve, Math.random() * 100 + 50),
        );
      }

      setStatus('ready');
      setStreamingMessageId(null);
    },
    [],
  );

  const addUserMessage = useCallback(
    (content: string) => {
      const userMessage: MessageType = {
        key: `user-${Date.now()}`,
        from: 'user',
        versions: [
          {
            id: `user-${Date.now()}`,
            content,
          },
        ],
        avatar: 'https://github.com/haydenbleasel.png',
        name: 'User',
      };

      setMessages((prev) => [...prev, userMessage]);

      addMessageTimeoutRef.current = setTimeout(() => {
        const assistantMessageId = `assistant-${Date.now()}`;
        const randomResponse =
          mockResponses[Math.floor(Math.random() * mockResponses.length)];

        const assistantMessage: MessageType = {
          key: `assistant-${Date.now()}`,
          from: 'assistant',
          versions: [
            {
              id: assistantMessageId,
              content: '',
            },
          ],
          avatar: 'https://github.com/openai.png',
          name: 'Assistant',
        };

        setMessages((prev) => [...prev, assistantMessage]);
        streamResponse(assistantMessageId, randomResponse);
        addMessageTimeoutRef.current = null;
      }, 500);
    },
    [streamResponse],
  );

  const handleSubmit = (message: PromptInputMessage) => {
    // If currently streaming or submitted, stop instead of submitting
    if (status === 'streaming' || status === 'submitted') {
      stop();
      return;
    }

    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    setStatus('submitted');

    if (message.files?.length) {
      toast.success('Files attached', {
        description: `${message.files.length} file(s) attached to message`,
      });
    }

    addUserMessage(message.text || 'Sent with attachments');
    setText('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    setStatus('submitted');
    addUserMessage(suggestion);
  };

  return (
    <div className="relative flex h-screen flex-col bg-[#0f0f0f]">
      {/* Grok-style Header */}
      <header className="flex items-center justify-between px-6 py-4">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white">
            <SparklesIcon className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-white">Copilot</h1>
        </div>
        
        {/* Right: Navigation Icons + Buttons */}
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-white transition-colors">
            <Menu size={20} />
          </button>
          <button className="text-gray-400 hover:text-white transition-colors">
            <Search size={20} />
          </button>
          <button className="text-gray-400 hover:text-white transition-colors">
            <Settings size={20} />
          </button>
          <button className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2">
            <User size={16} />
            Sign up
          </button>
          <button className="bg-black text-white border border-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-900 transition-colors">
            Sign in
          </button>
        </div>
      </header>

      {/* Main Conversation Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl h-full">
          <Conversation>
            <ConversationContent className="pb-32">
            {messages.map(({ versions, ...message }) => (
              <Branch defaultBranch={0} key={message.key}>
                <BranchMessages>
                  {versions.map((version) => (
                    <Message
                      from={message.from}
                      key={`${message.key}-${version.id}`}
                    >
                      <MessageContent>
                        <Response>{version.content}</Response>
                      </MessageContent>
                    </Message>
                  ))}
                </BranchMessages>
                {versions.length > 1 && (
                  <BranchSelector from={message.from}>
                    <BranchPrevious />
                    <BranchPage />
                    <BranchNext />
                  </BranchSelector>
                )}
              </Branch>
            ))}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
        </div>
      </div>

      {/* Sticky Input Area */}
      <div className="sticky bottom-0 shadow-lg">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-3 p-6">
          <Suggestions>
            {suggestions.map((suggestion) => (
              <Suggestion
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                suggestion={suggestion}
              />
            ))}
          </Suggestions>
          <PromptInput globalDrop multiple onSubmit={handleSubmit}>
            <PromptInputBody>
              <PromptInputAttachments>
                {(attachment) => <PromptInputAttachment data={attachment} />}
              </PromptInputAttachments>
              <PromptInputTextarea
                onChange={(event) => setText(event.target.value)}
                ref={textareaRef}
                value={text}
              />
            </PromptInputBody>
            <PromptInputFooter>
              <PromptInputTools>
                <PromptInputActionMenu>
                  <PromptInputActionMenuTrigger />
                  <PromptInputActionMenuContent>
                    <PromptInputActionAddAttachments />
                  </PromptInputActionMenuContent>
                </PromptInputActionMenu>
                <PromptInputSpeechButton
                  onTranscriptionChange={setText}
                  textareaRef={textareaRef}
                />
                <PromptInputButton
                  onClick={() => setUseWebSearch(!useWebSearch)}
                  variant={useWebSearch ? 'default' : 'ghost'}
                >
                  <GlobeIcon size={16} />
                  <span>Search</span>
                </PromptInputButton>
                <PromptInputModelSelect onValueChange={setModel} value={model}>
                  <PromptInputModelSelectTrigger>
                    <PromptInputModelSelectValue />
                  </PromptInputModelSelectTrigger>
                  <PromptInputModelSelectContent>
                    {models.map((model) => (
                      <PromptInputModelSelectItem
                        key={model.id}
                        value={model.id}
                      >
                        {model.name}
                      </PromptInputModelSelectItem>
                    ))}
                  </PromptInputModelSelectContent>
                </PromptInputModelSelect>
              </PromptInputTools>
              <PromptInputSubmit
                disabled={(!text.trim() && !status) || status === 'streaming'}
                status={status}
              />
            </PromptInputFooter>
          </PromptInput>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Example;
