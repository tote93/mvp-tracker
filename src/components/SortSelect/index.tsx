
import { Option, Select } from './styles';

interface SortSwitchProps {
  onChange: (id: string) => void;
}

const OPTIONS = [
  { id: 'level', name: 'Level' },
  { id: 'health', name: 'Health' },
  { id: 'baseExperience', name: 'Base EXP' },
  { id: 'jobExperience', name: 'Job EXP' },
  { id: 'respawnTime', name: 'Respawn' },
  { id: 'name', name: 'Name' },
  { id: 'id', name: 'ID' },
];

export function SortSelect({ onChange }: SortSwitchProps) {
  return (
    <Select defaultValue='respawnTime' onChange={(e) => onChange(e.target.value)}>
      <Option value='none'>
        None
      </Option>
      {OPTIONS.map(({ id, name }) => (
        <Option key={id} value={id}>
          <span id={id} >{name}</span>
        </Option>
      ))}
    </Select>
  );
}
