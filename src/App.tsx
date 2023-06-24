import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import './App.css';
import { Container, MvpsContainer, Section, SectionTitle } from './styles';
import { useDispatch, useSelector } from 'react-redux';

import { getAllMvps, getLocalActiveMvps, setActiveMvps, setAllMvps } from './features/mvp/mvpSlice';
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
  let activeMvps: any[] = getLocalActiveMvps();
  let allMvps: Mvp[] = useSelector(getAllMvps);
  const isEditModalOpen = useSelector(getEditModal);
  const dispatch = useDispatch();
  const localMvpKilled: any = localStorage.getItem('mvp_count') ? JSON.parse(localStorage.getItem('mvp_count') || "[]") : killedMvps
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentSort, setCurrentSort] = useState<string>('id');
  const [reverseSort, setReverseSort] = useState<boolean>(false);

  React.useEffect(() => {
    dispatch(setActiveMvps(getLocalActiveMvps()));
    const activeIds = activeMvps.map((mvp: Mvp) => mvp.id);
    const groupedArray = activeMvps.reduce((acc: any[], obj: any) => {
      const foundIndex = acc.findIndex((item: any) => item.id === obj.id);
      if (foundIndex !== -1) {
        acc[foundIndex].activeMaps.push(obj.deathMap);
      } else {
        acc.push({ ...obj, activeMaps: [obj.deathMap] });
      }
      return acc;
    }, []);

    let filtered = allMvps.map((mvp: Mvp) => {
      const foundIndex = groupedArray.findIndex((item: any) => item.id === mvp.id);
      if (foundIndex !== -1) {
        return groupedArray[foundIndex];
      }
      return mvp;
    });
    filtered = allMvps.filter((mvp: Mvp) => activeIds.indexOf(mvp.id) === -1 && mvp.activeMaps.length !== mvp.spawn.length);
    dispatch(setAllMvps(filtered));
  }, [])
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
  return (
    <ThemeProvider theme={Theme.dark}>
      <Header />
      <Container>
        {activeMvps.length > 0 && (
          <Section>
            <SectionTitle>
              {/* <FormattedMessage id='active' /> */}
            </SectionTitle>

            <MvpsContainer>
              {activeMvps.map((mvp: Mvp) => (
                <MvpCard key={`${mvp.id}-${mvp.deathMap}`} mvp={mvp} isActive killed={getKilledTimes(mvp.id)} />
                /*  <MvpCard key={`${mvp.id}-${mvp.deathMap}`} killed={getKilledTimes(mvp.id)} mvp={mvp} isActive sumMvpItem={sumMvpItem} /> */
              ))}
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
              <MvpCard key={`${mvp.id}-${mvp.deathMap}`} mvp={mvp} killed={getKilledTimes(mvp.id)} />
              /*  <MvpCard key={`${mvp.id}-${mvp.deathMap}`} killed={getKilledTimes(mvp.id)} mvp={mvp} isActive sumMvpItem={sumMvpItem} /> */
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
