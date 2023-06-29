import { useDispatch } from 'react-redux';
import { SortSelect } from '../SortSelect';

import {
  Container,
  SearchContainer,
  SearchIcon,
  SearchInput,
  SortContainer,
  Reverse,
  UpArrow,
  ClearButton,
  DownArrow,
} from './styles';
import { removeAllSavedMvps } from '../../features/mvp/mvpSlice';

interface FilterProps {
  onChangeQuery: (value: string) => void;
  onSelectSort: (value: string) => void;
  isReverse: boolean;
  onReverse: () => void;
}

export function MvpsContainerFilter({
  onChangeQuery,
  onSelectSort,
  isReverse,
  onReverse,
}: FilterProps) {
  const dispatch = useDispatch()
  const clearMvps = () => {
    dispatch(removeAllSavedMvps())
  }

  return (
    <Container>
      <SearchContainer>
        <SearchIcon />
        <SearchInput onChange={(e) => onChangeQuery(e.target.value)} />
      </SearchContainer>

      <SortContainer>
        <SortSelect onChange={(type: string) => onSelectSort(type)} />
        <Reverse onClick={onReverse} title='Reverse'>
          {isReverse ? <UpArrow /> : <DownArrow />}
        </Reverse>
      </SortContainer>
      <ClearButton onClick={clearMvps} >Clear Mvps</ClearButton>
    </Container>
  );
}
