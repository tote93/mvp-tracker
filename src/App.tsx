import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import './App.css';
import { Container, MvpsContainer, Section, SectionTitle } from './styles';
import { useDispatch, useSelector } from 'react-redux';

import { getActiveMvps, getAllMvps, getLocalActiveMvps, setActiveMvps, setAllMvps } from './features/mvp/mvpSlice';
import { MvpCard } from './components/MvpCard/MvpCard';
import { Mvp } from './interfaces';
import { GlobalStyle } from './styles/Global';
import { Theme } from './styles/Themes';
import { Header } from './components/Header';
import { EditMvpModal } from './components/EditMvpModal';
import { getEditModal } from './features/settings/settingsSlice';
import killedMvps from "./data/killed_mvp.json"
function App() {
  // get active mvps from the context with useselector and assign it to a state with useState
  const activeMvps = useSelector(getActiveMvps);
  const allMvps = useSelector(getAllMvps);
  const isEditModalOpen = useSelector(getEditModal);
  const dispatch = useDispatch();
  const localMvpKilled: any = localStorage.getItem('mvp_count') ? JSON.parse(localStorage.getItem('mvp_count') || "[]") : killedMvps
  React.useEffect(() => {
    dispatch(setActiveMvps(getLocalActiveMvps()));
    const activeIds = activeMvps.map((mvp: Mvp) => mvp.id);
    const filtered = allMvps.filter((mvp: Mvp) => activeIds.indexOf(mvp.id) === -1);
    dispatch(setAllMvps(filtered));
  }, [])
  React.useEffect(() => {
    // check if localstorage "mvp_count" exists and if not, set it to killedMvps
    if (!localStorage.getItem("mvp_count")) {
      localStorage.setItem("mvp_count", JSON.stringify(localMvpKilled))
    }
  }, [])
  const getKilledTimes = (id: number) => {
    return localMvpKilled.find((i: any) => i.id == id)?.killed || 0;
  };
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
          <MvpsContainer>
            {allMvps.map((mvp: Mvp) => (
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
