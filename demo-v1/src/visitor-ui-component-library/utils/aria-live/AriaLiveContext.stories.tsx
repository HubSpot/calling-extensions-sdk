import { useEffect, useState } from 'react';
import {
  AriaLiveContextProvider,
  AriaLiveContextProviderProps,
  useAriaLiveContext,
  Message,
  Assertiveness,
} from './AriaLiveContext';
// TODO: update when platform makes these available from '@storybook/react'
import { StoryFn, Meta } from '../../../storybook/types';

export default {
  title: 'AriaLiveContextProvider',
  component: AriaLiveContextProvider,
} as Meta<AriaLiveContextProviderProps>;

const TextToAnnounce = ({
  message = { id: '1', text: 'Some text' },
  assertiveness,
}: {
  message?: Message;
  assertiveness?: Assertiveness;
}) => {
  const { announce } = useAriaLiveContext();

  useEffect(() => announce(message, assertiveness), [
    announce,
    assertiveness,
    message,
  ]);

  return <p>{message.text}</p>;
};

export const UsageDemo: StoryFn<AriaLiveContextProviderProps> = () => {
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
      <p>
        {
          '(Polite text will be announced twice due to VO polite text bug where text is repeated when in an iframe)'
        }
      </p>
      {shouldRenderText && (
        <>
          <TextToAnnounce
            message={{ id: '1', text: 'polite text to announce' }}
            assertiveness="polite"
          />
          <TextToAnnounce
            message={{ id: '2', text: 'polite repeated text to announce once' }}
            assertiveness="polite"
          />
          <TextToAnnounce
            message={{ id: '2', text: 'polite repeated text to announce once' }}
            assertiveness="polite"
          />
          <TextToAnnounce
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
