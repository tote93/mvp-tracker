import { useCallback, useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import { useScrollBlock, useKey } from '../../hooks';
import { IMapMark, Mvp } from '../../interfaces';

import { ModalBase } from '../ModalBase';
import { MvpSprite } from '../MvpSprite';
import { Map } from '../Map';
import { ModalCloseButton } from '../ModalCloseButton';

import {
  Modal,
  SpriteWrapper,
  Name,
  Question,
  TextItem,
  Optional,
  Time,
  DatePickerContainer,
  SelectMap,
  SelectMapOption,
  ConfirmButton,
} from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { addKilledMvp, getKilledMvp } from '../../features/mvp/mvpSlice';
import { getEditMode, setEditMode, setModal } from '../../features/settings/settingsSlice';

export function EditMvpModal() {
  useScrollBlock(true);

  const mvp = useSelector(getKilledMvp);
  const editMode = useSelector(getEditMode);
  const dispatch = useDispatch();
  const [newTime, setNewTime] = useState<Date | null>(moment().subtract(8, 'hours').toDate());
  const [isServerTime, setIsServerTime] = useState(mvp.timeZone === "server" ? true : false);

  useEffect(() => {
    if (isServerTime) {
      const serverTime = moment().subtract(8, 'hours').toDate();
      setNewTime(serverTime);
    } else {
      setNewTime(moment().toDate());
    }
  }, [isServerTime]);
  const [selectedMap, setSelectedMap] = useState<string>(mvp.spawn.find((spawn) => ![...mvp.activeMaps.map(map => map)].includes(spawn.mapname))?.mapname || '');
  const [markCoordinates, setMarkCoordinates] = useState<IMapMark>({
    x: -1,
    y: -1,
  });

  const canChangeMap = useMemo(() => !mvp.deathMap, [mvp.deathMap]);
  const hasMoreThanOneMap = useMemo(
    () => mvp.spawn.length > 1,
    [mvp.spawn.length]
  );

  const toggleEditModal = () => {
    dispatch(setEditMode(false))
    dispatch(setModal())
  }

  const handleConfirm = useCallback(() => {
    if (!selectedMap) return;

    const serverTime = moment(newTime).add(8, 'hours').toDate();
    const updatedTime = isServerTime ? serverTime : moment(newTime).toDate();
    const updatedMvp: Mvp = {
      ...mvp,
      deathMap: selectedMap,
      activeMaps: [...mvp.activeMaps, selectedMap],
      deathPosition: markCoordinates,
      deathTime: moment(updatedTime || new Date()).format('YYYY-MM-DD HH:mm:ss')
    };
    dispatch(addKilledMvp(updatedMvp))
    dispatch(setModal())
  }, [selectedMap, mvp, markCoordinates, newTime, toggleEditModal]);

  useEffect(() => {
    if (!hasMoreThanOneMap) setSelectedMap(mvp.spawn[0].mapname);
  }, [hasMoreThanOneMap, mvp.spawn]);

  useKey('Escape', toggleEditModal);

  return (
    <ModalBase>
      <Modal>
        <ModalCloseButton onClick={toggleEditModal} />

        <Name>{mvp.name}</Name>

        <SpriteWrapper>
          <MvpSprite mvp={mvp} />
        </SpriteWrapper>
        <TextItem>
          <label htmlFor="timeSwitch">Server Time</label>
          <input
            type="checkbox"
            id="timeSwitch"
            style={{ marginLeft: '10px' }}
            checked={isServerTime}
            onChange={(e) => setIsServerTime(e.target.checked)}
          />
        </TextItem>
        <Question>When was the mvp killed?</Question>

        <DatePickerContainer>
          <DatePicker
            selected={newTime}
            onChange={(date: any) => setNewTime(date)}
            showTimeInput
            placeholderText='Select mvp death time'
            withPortal
            minDate={moment().subtract(4, 'days').toDate()}
            maxDate={moment().add(1, 'days').toDate()}
          />
        </DatePickerContainer>

        <Time>At {newTime && moment(newTime).format('HH:mm')}</Time>

        {canChangeMap && hasMoreThanOneMap && !editMode && (
          <>
            <Question>Please select the map</Question>
            <SelectMap
              value={selectedMap}
              onChange={(e) => setSelectedMap(e.target.value)}
            >

              <>
                {!selectedMap && (
                  <SelectMapOption disabled value=''>
                    Select the map
                  </SelectMapOption>
                )}

                {mvp.spawn.filter((spawn) => ![...mvp.activeMaps.map(map => map)].includes(spawn.mapname)).map((map) => (
                  <SelectMapOption key={map.mapname} value={map.mapname}>
                    {map.mapname} -{' '}
                    {moment.duration(map.respawnTime).asHours()}h
                  </SelectMapOption>
                ))}
              </>

            </SelectMap>
          </>
        )}

        {selectedMap && (
          <>
            <Question>
              Where's mvp tombstone:
              <Optional>(optional - click to mark)</Optional>
            </Question>
            <Map mapName={selectedMap} onChange={setMarkCoordinates} />
          </>
        )}

        <ConfirmButton onClick={handleConfirm} disabled={!selectedMap}>
          {!editMode ? "Confirm" : "Edit"}
        </ConfirmButton>
      </Modal>
    </ModalBase>
  );
}
