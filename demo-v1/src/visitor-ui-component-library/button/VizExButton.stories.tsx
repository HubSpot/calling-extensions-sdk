import VizExButton, { VizExButtonProps } from './VizExButton';
// TODO: update when platform makes these available from '@storybook/react'
import { StoryFn, Meta } from '../../storybook/types';

export default {
  title: 'VizExButton',
  component: VizExButton,
} as Meta<VizExButtonProps>;

export const DefaultWithControls: StoryFn<VizExButtonProps> = args => (
  <VizExButton {...args}>{'Button'}</VizExButton>
);
DefaultWithControls.argTypes = {
  use: {
    options: ['primary', 'secondary', 'transparent-on-primary'],
    control: { type: 'radio' },
  },
  size: {
    options: ['xs', 'sm', 'md'],
    control: { type: 'radio' },
  },
};
DefaultWithControls.args = {
  use: 'secondary',
  size: 'md',
  disabled: false,
  focused: false,
  hovered: false,
  pressed: false,
};

export const Primary: StoryFn<VizExButtonProps> = () => (
  <>
    <VizExButton use="primary">{'Inactive'}</VizExButton>
    <VizExButton use="primary" hovered={true}>
      {'Hovered'}
    </VizExButton>
    <VizExButton use="primary" focused={true}>
      {'Focused'}
    </VizExButton>
    <VizExButton use="primary" pressed={true}>
      {'Pressed'}
    </VizExButton>
    <VizExButton use="primary" disabled={true}>
      {'Disabled'}
    </VizExButton>
  </>
);

export const Secondary: StoryFn<VizExButtonProps> = () => (
  <>
    <VizExButton use="secondary">{'Inactive'}</VizExButton>
    <VizExButton use="secondary" hovered={true}>
      {'Hovered'}
    </VizExButton>
    <VizExButton use="secondary" focused={true}>
      {'Focused'}
    </VizExButton>
    <VizExButton use="secondary" pressed={true}>
      {'Pressed'}
    </VizExButton>
    <VizExButton use="secondary" disabled={true}>
      {'Disabled'}
    </VizExButton>
  </>
);

export const Sizes: StoryFn<VizExButtonProps> = () => (
  <>
    <VizExButton use="primary" size="md">
      {'size="md"'}
    </VizExButton>
    <VizExButton use="primary" size="sm">
      {'size="sm"'}
    </VizExButton>
    <VizExButton use="primary" size="xs">
      {'size="xs"'}
    </VizExButton>
    <VizExButton size="md">{'size="md"'}</VizExButton>
    <VizExButton size="sm">{'size="sm"'}</VizExButton>
    <VizExButton size="xs">{'size="xs"'}</VizExButton>
  </>
);
