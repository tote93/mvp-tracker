import styled, { css } from "styled-components";

export const Container = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  padding-bottom: 30px;
  background-color: rgb(46, 46, 46);
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
  gap: 15px;
`;

export const SectionTitle = styled.span`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
`;

export const MvpsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  width: 90vw;
  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;
