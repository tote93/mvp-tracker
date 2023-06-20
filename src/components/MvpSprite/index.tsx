import { useContext } from 'react';

import { Mvp } from '../../interfaces';
import { getMvpSprite, getAnimatedMvpSprite } from '../../utils';

import { Sprite } from './styles';

interface MvpSpriteProps {
  mvp:
  | {
    id: number;
    name?: string;
  }
  | Mvp;
}

export function MvpSprite({ mvp }: MvpSpriteProps) {
  const animatedSprites = false;

  return (
    <Sprite
      src={
        !animatedSprites ? getMvpSprite(mvp.id) : getAnimatedMvpSprite(mvp.id)
      }
      alt={mvp?.name}
      isAnimated={animatedSprites}
    />
  );
}
