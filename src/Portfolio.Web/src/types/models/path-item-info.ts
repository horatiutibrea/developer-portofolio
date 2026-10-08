import { PathEnum, TranslationKey, UserRoleEnum } from '@types';
import { PathItemVisibilityEnum } from '../enums/path-item-visibility.enum';

export class PathItemInfo {
  id: string;
  label: TranslationKey;
  path: PathEnum;
  icon: string;
  priority: number;
  visibility: (PathItemVisibilityEnum | UserRoleEnum)[];
}
