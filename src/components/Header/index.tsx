import { HeaderTimer } from '../HeaderTimer';
import mvpImg from '../../assets/mvp.png';

import { Container, Logo, LogoContainer, Title } from './styles';

export function Header() {
  return (
    <Container>
      <LogoContainer>
        <Logo src={mvpImg} alt='mvp' />
        <Title>Ragnarok MVP Timer</Title>
      </LogoContainer>
      <HeaderTimer />
    </Container>
  );
}
