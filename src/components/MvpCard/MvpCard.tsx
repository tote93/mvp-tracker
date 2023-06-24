import React, { useMemo, useState } from 'react';
import { Map, RefreshCcw, Trash2, Edit2 } from '@styled-icons/feather';

import moment from 'moment';

import { MvpSprite } from '../MvpSprite';

import { Mvp } from '../../interfaces';

import {
    Container,
    Name,
    Respawn,
    MapName,
    Controls,
    Control,
    Bold,
    KilledNow,
    EditButton,
    SumMvpBtn
} from './styles';
import { useDispatch } from 'react-redux';
import { addLocalKilledMvpCount, removeActiveMvp, setEditingMvp } from '../../features/mvp/mvpSlice';
import { setModal } from '../../features/settings/settingsSlice';
import { MvpCardCountdown } from '../MvpCardCountdown';
import { getMvpRespawnTime, respawnAt } from '../../utils';

interface MvpCardProps {
    mvp: Mvp;
    isActive?: boolean;
    killed: number;
    /*     killed: number;
        sumMvpItem: Function; */
}
export const MvpCard = React.memo(
    ({ mvp, isActive = false, killed }: MvpCardProps) => {
        const nextRespawn = useMemo(
            () => moment(mvp.deathTime).add(getMvpRespawnTime(mvp), 'ms'),
            [mvp]
        );
        const respawnTime = useMemo(() => respawnAt(nextRespawn), [nextRespawn]);
        const dispatch = useDispatch();

        const [killedTimes, setKilledTimes] = useState<number>(killed);


        const addKill = () => {
            setKilledTimes(killedTimes + 1);
            // sumMvpItem(mvp.id)
            addLocalKilledMvpCount(mvp)
        }

        const handleKilledNow = () => {
            mvp = { ...mvp, timezone: "local" }
            dispatch(setEditingMvp(mvp))
            setIsMapModalOpen()

        }
        const handleKilledOther = () => {
            mvp = { ...mvp, timezone: "server" }
            dispatch(setEditingMvp(mvp))
            setIsMapModalOpen()
        }
        const handleRemoveActiveMvp = () => {
            console.log(mvp, "---");
            mvp.activeMaps = [...mvp.activeMaps.filter(map => map !== mvp.deathMap)]
            dispatch(removeActiveMvp(mvp))
        }

        const setIsMapModalOpen = () => {
            dispatch(setEditingMvp(mvp))
            dispatch(setModal())
        }
        const test = () => {
            console.log(mvp);
        }
        return (
            <>
                <Container>

                    <Name>{mvp.name} ({killedTimes})
                        <SumMvpBtn onClick={addKill}>
                            +1
                        </SumMvpBtn>
                    </Name>
                    <MvpSprite mvp={mvp} />

                    {isActive ? (
                        <>
                            <Respawn title={respawnTime}>

                                <MvpCardCountdown nextRespawn={nextRespawn} />
                            </Respawn>

                            <MapName>
                                Mapa
                                {'\n'}
                                <Bold>{mvp.deathMap}</Bold>
                            </MapName>

                            <Controls>
                                <Control style={{ backgroundColor: "#00a8ff" }} onClick={() => setIsMapModalOpen()} title='Show map'>
                                    <Map />
                                </Control>
                                <Control
                                    style={{ backgroundColor: "#f89200" }}
                                    /*  onClick={() => openAndEditModal(mvp)} */
                                    title='Edit this mvp'
                                >
                                    <Edit2 />
                                </Control>
                                <Control
                                    style={{ backgroundColor: "#3F51B5" }}
                                    onClick={test} title='Reset timer'>
                                    <RefreshCcw />
                                </Control>
                                <Control
                                    style={{ backgroundColor: "#D10000" }}
                                    onClick={handleRemoveActiveMvp} title='Remove this mvp'>
                                    <Trash2 />
                                </Control>

                            </Controls>
                        </>
                    ) : (
                        <Controls isActive={!isActive}>
                            <KilledNow onClick={handleKilledNow}>
                                Killed Now
                            </KilledNow>
                            <EditButton onClick={handleKilledOther}>
                                Add Respawn
                            </EditButton>
                        </Controls>
                    )}
                </Container>

                {/*                 {mvp.deathMap && isMapModalOpen && (
                    <MvpMapModal
                        deathMap={mvp.deathMap}
                        deathPosition={mvp.deathPosition}
                        close={() => setIsMapModalOpen(false)}
                    />
                )} */}
            </>
        );
    });
