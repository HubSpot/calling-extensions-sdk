"use es6";

import PropTypes from "prop-types";
import { useState } from "react";
import styled from "styled-components";
import SVGCsatSad from "visitor-ui-component-library-icons/icons/SVGCsatSad";
import SVGCsatNeutral from "visitor-ui-component-library-icons/icons/SVGCsatNeutral";
import SVGCsatHappy from "visitor-ui-component-library-icons/icons/SVGCsatHappy";
import {
  BORDER_RATIO_RATING,
  RATING_ICON_SIZES,
} from "./constants/RatingSizes";
import themePropType from "../utils/themePropType";
import {
  getSadColor,
  getNeutralColor,
  getHappyColor,
} from "./theme/VizExCsatRatingThemeOperator";
import { MEDIUM } from "../constants/sizes";

const RatingComponents = [SVGCsatSad, SVGCsatNeutral, SVGCsatHappy];

const getIconColor = (index, theme) => {
  if (index === 0) {
    return getSadColor(theme);
  } else if (index === 1) {
    return getNeutralColor(theme);
  }
  return getHappyColor(theme);
};

const getWrapperStyle = ({ index, svgSize, theme }) => {
  const bSize = Math.ceil(BORDER_RATIO_RATING * svgSize);
  return `
    border-color: ${getIconColor(index, theme)};
    border-width: ${bSize}px;
    padding: ${bSize}px;
  `;
};

const Wrapper = styled.span`
  cursor: pointer;
  display: inline-block;
  border-radius: 50%;
  border-style: solid;
  ${getWrapperStyle}
  transition: border-color linear 0.2s;
  margin: 0 4px;

  &:not(:hover):not(.selected) {
    border-color: transparent;
  }

  svg {
    fill: ${({ index, theme }) => getIconColor(index, theme)};
  }
`;

const RatingsContainer = styled.div`
  display: inline-flex;
`;

const VizExCsatRating = ({ iconSize = MEDIUM, onChange, theme }) => {
  const ratingSize = RATING_ICON_SIZES[iconSize];
  const [selectedValue, setSelectedValue] = useState();
  const handleSelect = (rating) => () => {
    setSelectedValue(rating);
    if (onChange) {
      onChange(rating);
    }
  };

  return (
    <RatingsContainer data-selenium-test="feedback-rating-csat">
      {RatingComponents.map((RatingComponent, index) => {
        const selected = selectedValue === index;
        const svgSize = ratingSize - ratingSize * BORDER_RATIO_RATING;
        return (
          <div key={index} value={index}>
            <Wrapper
              index={index}
              className={selected ? "selected" : ""}
              svgSize={svgSize}
              theme={theme}
            >
              <RatingComponent
                data-testid={`VizExCsatRating-${index}`}
                style={{ display: "block" }}
                data-selenium-test={`rating-${index}`}
                onClick={handleSelect(index)}
                selected={selected}
                height={svgSize}
                width={svgSize}
              />
            </Wrapper>
          </div>
        );
      })}
    </RatingsContainer>
  );
};

VizExCsatRating.propTypes = {
  iconSize: PropTypes.oneOf(Object.keys(RATING_ICON_SIZES)),
  onChange: PropTypes.func,
  theme: themePropType,
};

VizExCsatRating.displayName = "VizExCsatRating";

export default VizExCsatRating;
