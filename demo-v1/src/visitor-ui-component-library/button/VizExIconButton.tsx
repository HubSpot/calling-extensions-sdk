import PropTypes from 'prop-types';
import styled, { DefaultTheme } from 'styled-components';
import themePropType from '../utils/themePropType';
import { interactionPropTypes, InteractionProps } from '../utils/types';
import * as IconButtonUses from './constants/IconButtonUses';
import { CIRCLE, DEFAULT } from './constants/IconButtonShapes';
import { MEDIUM, EXTRA_SMALL, SMALL } from '../constants/sizes';
import { BUTTON_SIZES } from './constants/ButtonSizes';

const defaultProps = {
  use: IconButtonUses.PRIMARY,
  shape: DEFAULT,
  size: MEDIUM,
};

export type VizExIconButtonProps = {
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  shape: 'circle' | 'default';
  size: keyof typeof BUTTON_SIZES;
  theme: DefaultTheme;
  use: 'primary' | 'transparent-on-background' | 'transparent-on-primary';
} & InteractionProps &
  typeof defaultProps &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

const AbstractVizExIconButton = styled.button<VizExIconButtonProps>`
  ${({ theme }) => theme.components.IconButton.style}
`;

const VizExIconButton = (props: VizExIconButtonProps) => {
  return <AbstractVizExIconButton {...props} />;
};

VizExIconButton.displayName = 'VizExIconButton';

VizExIconButton.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  shape: PropTypes.oneOf([CIRCLE, DEFAULT]),
  size: PropTypes.oneOf([EXTRA_SMALL, SMALL, MEDIUM]),
  theme: themePropType,
  use: PropTypes.oneOf(Object.values(IconButtonUses)),
  ...interactionPropTypes,
};

VizExIconButton.defaultProps = defaultProps;

export default VizExIconButton;
