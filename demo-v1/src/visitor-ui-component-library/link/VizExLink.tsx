import PropTypes from 'prop-types';
import styled, { DefaultTheme } from 'styled-components';
import themePropType from '../utils/themePropType';
import { interactionPropTypes, InteractionProps } from '../utils/types';
import { ON_BRIGHT, DEFAULT, ERROR } from './constants/LinkVariations';

const defaultProps = {
  use: DEFAULT,
};

export type VizExLinkProps = {
  children?: React.ReactNode;
  external?: boolean;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  theme: DefaultTheme;
  use: typeof ON_BRIGHT | typeof DEFAULT | typeof ERROR;
} & InteractionProps &
  typeof defaultProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement>;

const StyledATag = styled.a<VizExLinkProps>`
  ${({ theme }) => theme.components.Link.style}
`;

const VizExLink = (props: VizExLinkProps) => {
  return <StyledATag {...props} />;
};

VizExLink.displayName = 'VizExLink';
VizExLink.propTypes = {
  children: PropTypes.node,
  external: PropTypes.bool,
  href: PropTypes.string,
  onClick: PropTypes.func,
  theme: themePropType,
  use: PropTypes.oneOf([ON_BRIGHT, DEFAULT, ERROR]),
  ...interactionPropTypes,
};
VizExLink.defaultProps = defaultProps;

export default VizExLink;
