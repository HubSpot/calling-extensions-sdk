import { createContext, useContext, useEffect } from 'react';
import { announce, clearAnnouncer } from './AriaLiveAnnouncer';

export type Message = { id: string; text: string };
export type Assertiveness = 'assertive' | 'polite';

const announcedMessages = new Map<string, string>();
const clearAnnouncedMessages = () => announcedMessages.clear();

const defaultValue = {
  announce: (
    message: Message,
    assertiveness: Assertiveness = 'assertive',
    timeout?: number
  ) => {
    if (announcedMessages.has(message.id)) return;
    announce(message.text, assertiveness, timeout);
    announcedMessages.set(message.id, message.text);
  },
  clearAnnouncer,
  clearAnnouncedMessages,
};

export const AriaLiveContext = createContext(defaultValue);

export type AriaLiveContextProviderProps = {
  children: React.ReactNode;
  clearOnUnmount?: boolean;
};

/**
 * Provides a context in which unique messages are announced using aria-live only once and clears unique message store when unmounted or programmatically (using the consuming hook methods).
 *
 * **NOTE:** There's a bug in VoiceOver that makes aria-live "polite" message repeat once for each iframe they may be nested within on a parent document. So we default to "assertive", which doesn't have this issue, but "polite" should be favored in general if not used in an iframe.
 *
 * Usage Demo
 *
 * ```tsx
 * const DemoUsageWithinATextComp = ({
    message = { id: '1', text: 'Some text' },
    assertiveness,
  }: {
    message: { id: string, text: string };
    assertiveness?: 'polite' | 'assertive';
  }) => {
    const { announce } = useAriaLiveContext();

    useEffect(() => announce(message, assertiveness), []);

    return <p>{message.text}</p>;
  };

  const UsageDemo = () => {
    const { clearAnnouncedMessages } = useAriaLiveContext();
    const [shouldRenderText, setShouldRenderText] = useState(false);

    return (
      <AriaLiveContextProvider>
        <button
          onClick={() => {
            clearAnnouncedMessages();
            setShouldRenderText(!shouldRenderText);
          }}
        >
          {'Toggle text to announce'}
        </button>
        {shouldRenderText && (
          <>
            <DemoUsageWithinATextComp message={{ id: '1', text: 'text to announce' }} />
            <DemoUsageWithinATextComp
              message={{ id: '2', text: 'repeated text to announce once' }}
            />
            <DemoUsageWithinATextComp
              message={{ id: '2', text: 'repeated text to announce once' }}
            />
            <DemoUsageWithinATextComp
              message={{
                id: '3',
                text: 'assertive text to announce immediately',
              }}
              assertiveness="assertive"
            />
          </>
        )}
      </AriaLiveContextProvider>
    );
};
```
 */
export const AriaLiveContextProvider = ({
  children,
  clearOnUnmount = true,
}: AriaLiveContextProviderProps) => {
  useEffect(
    () => () => {
      if (clearOnUnmount) {
        clearAnnouncer('assertive');
        clearAnnouncer('polite');
        clearAnnouncedMessages();
      }
    },
    [clearOnUnmount]
  );

  return (
    <AriaLiveContext.Provider value={defaultValue}>
      {children}
    </AriaLiveContext.Provider>
  );
};
AriaLiveContextProvider.displayName = 'AriaLiveContextProvider';

export const useAriaLiveContext = () => useContext(AriaLiveContext);
