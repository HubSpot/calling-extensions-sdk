'use es6';

import PropTypes from 'prop-types';
import SVGClose from 'visitor-ui-component-library-icons/icons/SVGClose';
import VizExIconButton from './VizExIconButton';
import VizExIcon from '../icon/VizExIcon';
import styled, { css, ThemeConsumer } from 'styled-components';
import themePropType from '../utils/themePropType';
import { TRANSPARENT_ON_BACKGROUND } from './constants/IconButtonUses';
import { CIRCLE } from './constants/IconButtonShapes';
import { EXTRA_SMALL, MEDIUM, SMALL } from '../constants/sizes';
import { setTransparentOnBackgroundIconButton } from './theme/iconButtonThemeOperators';
import { getCloseButtonColor } from './theme/closeButtonThemeOperators';
import { ICON_BUTTON_SIZE_TO_ICON_SIZE } from './constants/IconButtonSizeToIconSize';

const getMarginStyles = ({ size }) => {
  switch (size) {
    case EXTRA_SMALL:
    case SMALL:
      return css`
        margin-top: 8px;
        margin-right: 8px;
      `;
    case MEDIUM:
    default:
      return css`
        margin-top: 12px;
        margin-right: 12px;
      `;
  }
};
export const ButtonContainer = styled(VizExIconButton)`
  right: 0;
  position: absolute;
  top: 0;
  ${getMarginStyles}
`;

const VizExCloseButton = props => {
  const { onClick, theme, size, ...rest } = props;
  return (
    <ThemeConsumer>
      {contextTheme => (
        <ButtonContainer
          {...rest}
          onClick={onClick}
          theme={setTransparentOnBackgroundIconButton(
            getCloseButtonColor(theme || contextTheme),
            theme || contextTheme
          )}
          use={TRANSPARENT_ON_BACKGROUND}
          shape={CIRCLE}
          size={size}
        >
          <VizExIcon
            icon={<SVGClose />}
            size={ICON_BUTTON_SIZE_TO_ICON_SIZE[size]}
          />
        </ButtonContainer>
      )}
    </ThemeConsumer>
  );
};

VizExCloseButton.displayName = 'VizExCloseButton';

VizExCloseButton.propTypes = {
  onClick: PropTypes.func,
  size: PropTypes.oneOf([EXTRA_SMALL, SMALL, MEDIUM]),
  theme: themePropType,
};

export default VizExCloseButton;
