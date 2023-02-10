import PropTypes from 'prop-types';
import themePropType from '../utils/themePropType';
import { DEFAULT } from './constants/LinkVariations';
import { getExternalLinkIconColor } from './theme/linkThemeOperators';
import SVGExternalLink from 'visitor-ui-component-library-icons/icons/SVGExternalLink';
// @ts-expect-error not typed yet
import VizExIcon from '../icon/VizExIcon';
import { createTheme } from '../theme/createTheme';
import { setIconColor } from '../icon/theme/iconThemeOperators';
import VizExLink, { VizExLinkProps } from './VizExLink';

const VizExExternalLink = (props: VizExLinkProps) => {
  const { children, theme, ...rest } = props;

  return (
    <VizExLink
      {...rest}
      rel="noopener noreferrer"
      target="_blank"
      style={{ display: 'inline-flex', alignItems: 'center' }}
      theme={theme}
    >
      {children}
      <VizExIcon
        theme={createTheme(setIconColor(getExternalLinkIconColor()))}
        icon={<SVGExternalLink />}
        size="1em"
        style={{ marginLeft: '4px' }}
      />
    </VizExLink>
  );
};

VizExExternalLink.displayName = 'VizExExternalLink';
VizExExternalLink.propTypes = {
  children: PropTypes.node,
  theme: themePropType,
};
VizExExternalLink.defaultProps = {
  use: DEFAULT,
};

export default VizExExternalLink;
