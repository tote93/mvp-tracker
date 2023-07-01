import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import './App.css';
import { Container, MvpsContainer, Section, SectionTitle } from './styles';
import { useDispatch, useSelector } from 'react-redux';

import { getAllMvps, getLocalActiveMvps, removeActiveMvp, setActiveMvps, setAllMvps } from './features/mvp/mvpSlice';
import { MvpCard } from './components/MvpCard/MvpCard';
import { Mvp } from './interfaces';
import { GlobalStyle } from './styles/Global';
import { Theme } from './styles/Themes';
import { Header } from './components/Header';
import { EditMvpModal } from './components/EditMvpModal';
import { getEditModal } from './features/settings/settingsSlice';
import killedMvps from "./data/killed_mvp.json"
import { MvpsContainerFilter } from './components/MvpsContainerFilter';
import { sortBy } from './utils/sort';
function App() {

  let allMvps: Mvp[] = useSelector(getAllMvps);
  const isEditModalOpen = useSelector(getEditModal);
  const dispatch = useDispatch();
  const localMvpKilled: any = localStorage.getItem('mvp_count') ? JSON.parse(localStorage.getItem('mvp_count') || "[]") : killedMvps

  const [activeMvpList, setActiveMvpList] = useState<any>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentSort, setCurrentSort] = useState<string>('id');
  const [reverseSort, setReverseSort] = useState<boolean>(false);
  const activeMvpsRef = React.useRef<any[]>([]);
  activeMvpsRef.current = getLocalActiveMvps();


  React.useEffect(() => {

    const activeLocalMvps = getLocalActiveMvps();
    const activeIds = activeLocalMvps.map((mvp: Mvp) => mvp.id);
    const groupedArray = activeLocalMvps.reduce((acc: any[], obj: any) => {
      const foundIndex = acc.findIndex((item: any) => item.id === obj.id);
      if (foundIndex !== -1) {
        acc[foundIndex].activeMaps.push(obj.deathMap);
      } else {
        acc.push({ ...obj, activeMaps: [obj.deathMap] });
      }
      return acc;
    }, []);

    groupedArray.forEach((mvp: Mvp) => {
      const foundItems = activeLocalMvps.filter((item: any) => item.id === mvp.id);
      if (foundItems.length) {
        foundItems.forEach((item: any) => {
          item.activeMaps = mvp.activeMaps;
        });
      }
    });
    let filtered: any[] = [];
    allMvps.map((mvp: Mvp) => {
      let item = { ...mvp };
      const foundIndex = groupedArray.findIndex((item: any) => item.id === mvp.id);
      if (foundIndex !== -1) {
        const copyItem = { ...groupedArray[foundIndex] };
        delete copyItem.deathMap;
        delete copyItem.deathPosition
        delete copyItem.deathTime
        item = copyItem;
      }
      filtered.push(item);
    });

    filtered = filtered.filter((mvp: Mvp) => activeIds.indexOf(mvp.id) === -1 || mvp.activeMaps.length !== mvp.spawn.length || mvp.activeMaps.length !== mvp.spawn.length);

    dispatch(setAllMvps(filtered));
    dispatch(setActiveMvps(activeLocalMvps));
    activeMvpsRef.current = [...activeLocalMvps];
    setActiveMvpList(activeLocalMvps);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    setActiveMvpList(activeMvpsRef.current);

  }, [activeMvpsRef.current.length]);


  const allMvpsFilteredAndSorted = React.useMemo(() => {
    let filteredMvps = searchQuery
      ? allMvps.filter((i) =>
        i.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      : allMvps;
    return [...filteredMvps].sort(sortBy(currentSort));
  }, [searchQuery, allMvps, currentSort]);

  React.useEffect(() => {
    // check if localstorage "mvp_count" exists and if not, set it to killedMvps
    if (!localStorage.getItem("mvp_count")) {
      localStorage.setItem("mvp_count", JSON.stringify(localMvpKilled))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const getKilledTimes = (id: number) => {
    return localMvpKilled.find((i: any) => i.id === id)?.killed || 0;
  };
  const displayAllMvps = React.useMemo(
    () =>
      reverseSort
        ? allMvpsFilteredAndSorted.slice().reverse()
        : allMvpsFilteredAndSorted,
    [reverseSort, allMvpsFilteredAndSorted]
  );

  const handleDeleteMap = (mvp: Mvp) => {
    const mvpFound = activeMvpList.find((item: any) => item.id === mvp.id && item.deathMap === mvp.deathMap);
    const copiedMvp = { ...mvpFound, activeMaps: mvpFound.activeMaps.filter((map: string) => map !== mvp.deathMap) };
    const filteredItems = activeMvpList.filter((item: any) => (item.id === mvp.id && item.deathMap !== mvp.deathMap) || item.id !== mvp.id);
    // find all mvps from the activeLocalMvps with the same id and remove the map from the array
    const filtered = filteredItems.map((item: any) => {
      const copy = { ...item };
      if (item.id === mvp.id) {
        copy.activeMaps = item.activeMaps.filter((map: string) => map !== mvp.deathMap);
      }
      return copy
    });


    activeMvpsRef.current = filtered; // Actualiza activeMvpsRef.current con los cambios realizados
    setActiveMvpList(filtered);
    dispatch(removeActiveMvp(copiedMvp))

  }





  return (
    <ThemeProvider theme={Theme.dark}>
      <Header />
      <Container>
        {activeMvpsRef.current.length > 0 && (
          <Section>
            <SectionTitle>
              {/* <FormattedMessage id='active' /> */}
            </SectionTitle>

            <MvpsContainer>
              {activeMvpsRef.current.map((mvp: Mvp) =>
                <MvpCard key={`${mvp.id}-${mvp.deathMap}`} isActive mvp={mvp} killed={getKilledTimes(mvp.id)} handleDeleteMap={handleDeleteMap} />
              )}
            </MvpsContainer>
          </Section>
        )}
        <Section>
          <SectionTitle>
            All MVP
          </SectionTitle>

          <MvpsContainerFilter
            onChangeQuery={(value) => setSearchQuery(value)}
            onSelectSort={(value) => setCurrentSort(value)}
            isReverse={reverseSort}
            onReverse={() => setReverseSort((s) => !s)}
          />
          <MvpsContainer>
            {displayAllMvps.map((mvp: Mvp) => (
              <MvpCard key={`${mvp.id}-${mvp.deathMap}`} mvp={mvp} killed={getKilledTimes(mvp.id)} handleDeleteMap={handleDeleteMap} />

            ))}
          </MvpsContainer>
        </Section>
      </Container>
      <GlobalStyle />
      {isEditModalOpen && <EditMvpModal />}
    </ThemeProvider>
  );
}

export default App;
