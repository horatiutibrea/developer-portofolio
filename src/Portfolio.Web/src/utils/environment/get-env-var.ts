import { EnvVarEnum } from '@types';

export const getEnvVarOrThrow = (key: EnvVarEnum): string => {
  const value = import.meta.env[key];
  if (value == null) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value;
};

export const getEnvVarOrDefault = (key: EnvVarEnum, defaultValue: string): string => {
  const value = import.meta.env[key];
  return value ?? defaultValue;
};
