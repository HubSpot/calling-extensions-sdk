'use es6';

import { useRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import { callIfValid } from '../utils/callIfValid';
import styled from 'styled-components';

const FilePickerInput = styled.input`
  display: none;
`;

const VizExFileButton = props => {
  const { children, multiple, accept, onChange, onClick, ...rest } = props;
  const fileInputRef = useRef();
  const handleClick = evt => {
    fileInputRef.current.click();
    callIfValid(onClick, evt);
  };
  return (
    <Fragment>
      {children({ onClick: handleClick })}
      <FilePickerInput
        {...rest}
        ref={fileInputRef}
        type="file"
        accept={accept.join(',')}
        multiple={multiple}
        onChange={onChange}
      />
    </Fragment>
  );
};
VizExFileButton.displayName = 'VizExFileButton';
VizExFileButton.defaultProps = {
  accept: [],
};
VizExFileButton.propTypes = {
  accept: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.func.isRequired,
  multiple: PropTypes.bool,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
};

export default VizExFileButton;
