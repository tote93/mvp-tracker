import { useTimer } from '../../hooks';
import { Hour } from './styles';

export function HeaderTimer() {
  const { time } = useTimer();

  // Obtiene la hora actual y resta 8 horas manualmente
  const serverTime = new Date(time.toDate().getTime() - 8 * 60 * 60 * 1000);

  // Formatea la hora en formato HH:mm:ss
  const formattedServerTime = `${serverTime.getHours().toString().padStart(2, '0')}:${serverTime.getMinutes().toString().padStart(2, '0')}:${serverTime.getSeconds().toString().padStart(2, '0')}`;


  return <p>
    <Hour>Actual: {time.format('HH:mm:ss')}</Hour>
    <Hour>Server: {formattedServerTime}</Hour>
  </p>;
}
