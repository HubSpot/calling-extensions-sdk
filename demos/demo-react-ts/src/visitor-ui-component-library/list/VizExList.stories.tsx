import VizExList, { VizExListProps } from './VizExList';
// TODO: update when platform makes these available from '@storybook/react'
import { StoryFn, Meta } from '../../storybook/types';
import VizExListItemButton from './VizExListItemButton';

export default {
  title: 'VizExList',
  component: VizExList,
} as Meta<VizExListProps>;

export const DefaultWithControls: StoryFn<VizExListProps> = args => (
  <VizExList {...args}>
    <li>{'first item'}</li>
    <li>{'second item'}</li>
    <li>{'third item'}</li>
  </VizExList>
);

DefaultWithControls.args = {
  listStyled: true,
};

export const StyledList: StoryFn<VizExListProps> = () => (
  <VizExList listStyled={true}>
    <li>{'first item'}</li>
    <li>{'second item'}</li>
    <li>{'third item'}</li>
  </VizExList>
);

export const OrderedList: StoryFn<VizExListProps> = () => (
  <VizExList as="ol" listStyled={true}>
    <li>{'first item'}</li>
    <li>{'second item'}</li>
    <li>{'third item'}</li>
  </VizExList>
);

export const InteractiveList: StoryFn<VizExListProps> = () => (
  <VizExList>
    <VizExList>
      <VizExListItemButton>{'as a button'}</VizExListItemButton>
      <VizExListItemButton as="a" href="">
        {'as an anchor link'}
      </VizExListItemButton>
      <VizExListItemButton>{'as a button'}</VizExListItemButton>
    </VizExList>
  </VizExList>
);
