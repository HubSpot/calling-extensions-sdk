import PropTypes from 'prop-types';
import { forwardRef, ComponentProps } from 'react';
import styled, { DefaultTheme, StyledComponent } from 'styled-components';
import themePropType from '../utils/themePropType';
import {
  interactionPropTypes,
  InteractionProps,
  PolymorphicRef,
} from '../utils/types';

type Props = {
  children?: React.ReactNode;
  theme: DefaultTheme;
  alignItems?: 'flex-start' | 'center';
  disablePadding: boolean;
  disableGutters: boolean;
} & InteractionProps;

export type VizExListItemButtonProps = Omit<
  ComponentProps<StyledComponent<'button' | 'a', Props>>,
  'theme'
>;

const Container = styled.button`
  ${({ theme }) => theme.components.ListItemButton.style}
`;

const VizExListItemButton = forwardRef(
  <C extends React.ElementType>(
    props: VizExListItemButtonProps,
    ref: PolymorphicRef<C>
  ) => {
    return <Container {...props} ref={ref} />;
  }
);

VizExListItemButton.displayName = 'VizExListItemButton';
VizExListItemButton.propTypes = {
  alignItems: PropTypes.oneOf(['center', 'flex-start']),
  autoFocus: PropTypes.bool,
  children: PropTypes.node,
  disableGutters: PropTypes.bool,
  disablePadding: PropTypes.bool,
  ordered: PropTypes.bool,
  theme: themePropType,
  ...interactionPropTypes,
};

export default VizExListItemButton;
