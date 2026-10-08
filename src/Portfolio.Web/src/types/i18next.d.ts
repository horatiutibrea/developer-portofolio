import 'i18next';
import { resources } from '@assets';
import { FlattenObjectKeys } from './utils/flatten-object-keys.type';

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: typeof resources['ro'];
  }
}

export type TranslationKey = FlattenObjectKeys<typeof resources['ro']['translation']>;
