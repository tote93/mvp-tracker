import { useEffect, useState } from 'react';
import { Moment } from 'moment';
import { useCountown } from '../../hooks';
import { Container, Text, Bold } from './styles';

interface MvpCardCountdownProps {
  nextRespawn: Moment;
}

const SOON_THRESHOLD = 600000; // 10 minutes

export function MvpCardCountdown({ nextRespawn }: MvpCardCountdownProps) {
  const { duration, isRunning } = useCountown(nextRespawn);
  const [timeString, setTimeString] = useState<string>('-- : -- : --');
  const [respawningSoon, setRespawningSoon] = useState(false);
  const [isBefore, setIsBefore] = useState(false);

  const respawnText = respawningSoon ? "Respawning" : isBefore ? 'Already Respawned' : "Respawn in"

  useEffect(() => {
    if (!duration || !isRunning) return;

    const durationAsMs = duration.asMilliseconds();
    const soon = durationAsMs >= 0 && durationAsMs <= SOON_THRESHOLD;
    if (soon) {
      setIsBefore(false);
      setRespawningSoon(true)
    }
    else {
      if (durationAsMs <= 0) {
        //alert("Respawned")
        setIsBefore(true);
        setRespawningSoon(false)
      };
    }

  }, [duration, isRunning]);

  useEffect(() => {
    if (!duration || !isRunning) return;

    const negative = duration.asMilliseconds() < 0;

    const time = [duration.hours(), duration.minutes(), duration.seconds()]
      .map((time) => String(time).replace('-', '').padStart(2, '0'))
      .join(':');

    setTimeString(`${negative ? '-' : ''}${time}`);
  }, [duration, isRunning]);

  useEffect(() => {
    setRespawningSoon(false);
    setIsBefore(false);
  }, [nextRespawn]);

  return (
    <Container>
      <Text>{respawnText}</Text>
      <Bold respawningSoon={respawningSoon} isBefore={isBefore}>
        {timeString} {'\n'}
      </Bold>
    </Container>
  );
}
