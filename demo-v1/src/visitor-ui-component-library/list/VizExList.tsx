import styled from 'styled-components';

export interface VizExListProps {
  /** If true, styles with browser ul/ol default bullet points or numbers */
  listStyled?: boolean;
}

const VizExList = styled.ul<VizExListProps>`
  ${({ listStyled }) => (listStyled ? '' : 'list-style: none;')}
  ${({ theme }) => theme.components.List.style}
`;

export default VizExList;
