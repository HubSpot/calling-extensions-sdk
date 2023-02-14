import PropTypes from 'prop-types';

export type InteractionProps = {
  disabled?: boolean;
  focused?: boolean;
  hovered?: boolean;
  pressed?: boolean;
};

export const interactionPropTypes = {
  disabled: PropTypes.bool,
  focused: PropTypes.bool,
  hovered: PropTypes.bool,
  pressed: PropTypes.bool,
};

export type PolymorphicRef<
  C extends React.ElementType
> = React.ComponentPropsWithRef<C>['ref'];
