'use es6';

import PropTypes from 'prop-types';
import styled from 'styled-components';
import VizExLoadingSpinner from '../loading/VizExLoadingSpinner';
import LoadingButtonUses, {
  buttonUse,
  spinnerUse,
} from './constants/LoadingButtonUses';
import themePropType from '../utils/themePropType';

const Spinner = styled(VizExLoadingSpinner)`
  height: 0;
  position: absolute;
  top: 50%;
  right: 0;
  transition: opacity 0.2s;
  opacity: ${({ show }) => (show ? 1 : 0)};
`;

const ReadyWrapper = styled.div`
  transition: opacity 0.2s;
  opacity: ${({ show }) => (show ? 1 : 0)};
`;

const VizExLoadingButton = props => {
  const {
    children,
    Button,
    result,
    use,
    theme,
    currentState,
    onClick,
    ...rest
  } = props;

  const isReady = currentState === 'ready';
  const isSubmitting = currentState === 'submitting';
  const isDone = currentState === 'done';

  return (
    <Button
      theme={theme}
      onClick={isSubmitting || isDone ? () => {} : onClick}
      use={buttonUse(use)}
      style={{ position: 'relative' }}
      {...rest}
    >
      <ReadyWrapper data-testid="VizExLoadingButton-Ready" show={isReady}>
        {children}
      </ReadyWrapper>
      <Spinner
        size="xs"
        grow={true}
        use={spinnerUse(use)}
        theme={theme}
        showResult={isDone}
        show={isSubmitting || isDone}
        data-testid="VizExLoadingButton-Spinner"
      >
        {result}
      </Spinner>
    </Button>
  );
};

VizExLoadingButton.propTypes = {
  Button: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  currentState: PropTypes.oneOf(['ready', 'submitting', 'done']),
  onClick: PropTypes.func,
  result: PropTypes.node,
  theme: themePropType,
  use: PropTypes.oneOf(Object.values(LoadingButtonUses)),
};

VizExLoadingButton.defaultProps = {
  'data-test-id': 'loading-button',
  use: LoadingButtonUses.PRIMARY,
  onClick: () => {},
};

VizExLoadingButton.displayName = 'VizExLoadingButton';

export default VizExLoadingButton;
