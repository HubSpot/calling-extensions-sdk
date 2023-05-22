'use es6';

import { cloneElement, Children } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { PLACEMENTS } from './constants/PlacementConstants';
import VizExTooltipArrow from './VizExTooltipArrow';
import VizExTooltipBody from './VizExTooltipBody';
import themePropType from '../utils/themePropType';
import { callIfValid } from '../utils/callIfValid';
import { useTooltipTriggerState } from '@react-stately/tooltip';
import { useTooltipTrigger } from '@react-aria/tooltip';

const Popover = styled.div`
  transition-property: ${({ transitioning }) =>
    transitioning ? 'opacity ease-out, transform ease-out' : 'none'};
  transition-duration: ${({ duration }) => duration}ms;
  opacity: ${({ open }) => (open ? '1' : '0')};
  transform: ${({ open, transitioning }) => {
    if (open && !transitioning) return 'none'; /* IE bugfix: #5368 */
    return open ? 'scale(1)' : 'scale(.75)';
  }};
  position: absolute;
  pointer-events: none;
  width: 100%;
  height: 100%;
`;

const PopoverWrapper = styled.div`
  display: inline-block;
  position: relative;
`;

const VizExTooltip = props => {
  const {
    content,
    backgroundColor,
    textColor,
    placement,
    children,
    theme,
    onOpenChange,
    open,
    delay = 0,
    ...rest
  } = props;
  const hasValidOpenProp = typeof open === 'boolean';
  const tooltipTriggerProps = {
    delay,
    ...(hasValidOpenProp && {
      isOpen: open,
    }),
  };
  const state = useTooltipTriggerState(tooltipTriggerProps);
  const { triggerProps, tooltipProps } = useTooltipTrigger(
    tooltipTriggerProps,
    state,
    null
  );

  if (!content) return children;

  const handleMouseEnter = () => {
    if (!hasValidOpenProp) {
      callIfValid(onOpenChange, true);
      state.open(true);
    }
  };
  const handleMouseLeave = () => {
    if (!hasValidOpenProp) {
      callIfValid(onOpenChange, false);
      state.close(true);
    }
  };

  return (
    <PopoverWrapper
      {...rest}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Popover open={state.isOpen} duration={250} transitioning={true}>
        <VizExTooltipBody
          textColor={textColor}
          backgroundColor={backgroundColor}
          placement={placement}
          open={state.isOpen}
          theme={theme}
          data-test-open={state.isOpen}
          {...tooltipProps}
        >
          {content}
        </VizExTooltipBody>
        <VizExTooltipArrow
          backgroundColor={backgroundColor}
          placement={placement}
          theme={theme}
        />
      </Popover>
      {cloneElement(Children.only(children), {
        ...triggerProps,
        onClick: children.props.onClick,
      })}
    </PopoverWrapper>
  );
};

VizExTooltip.propTypes = {
  backgroundColor: PropTypes.string,
  children: PropTypes.node,
  content: PropTypes.node,
  delay: PropTypes.number,
  onOpenChange: PropTypes.func,
  open: PropTypes.bool,
  placement: PropTypes.oneOf(PLACEMENTS),
  textColor: PropTypes.string,
  theme: themePropType,
};
VizExTooltip.displayName = 'VizExTooltip';
VizExTooltip.defaultProps = {
  placement: 'top right',
};

export default VizExTooltip;
