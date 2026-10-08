import { RootState } from '@store';

export const localStorageKey = 'state';

const isValidPersistedUser = (user: unknown): boolean => {
  if (user == null || typeof user !== 'object') {
    return false;
  }

  const candidate = user as Record<string, unknown>;

  return typeof candidate.id === 'number'
    && typeof candidate.nume === 'string'
    && typeof candidate.prenume === 'string'
    && typeof candidate.email === 'string'
    && typeof candidate.guid === 'string'
    && typeof candidate.rol === 'string'
    && (candidate.urlPozaProfil == null || typeof candidate.urlPozaProfil === 'string');
};

const sanitizePersistedState = (state: unknown) => {
  if (state == null || typeof state !== 'object') {
    return undefined;
  }

  const candidate = state as Record<string, any>;
  const persistedUser = candidate.app?.auth?.user;

  if (persistedUser != null && !isValidPersistedUser(persistedUser)) {
    return {
      ...candidate,
      app: {
        ...candidate.app,
        auth: {
          ...candidate.app?.auth,
          user: null,
        },
      },
    };
  }

  return candidate;
};

export const loadLocalStorageState = () => {
  try {
    const serializedState = localStorage.getItem(localStorageKey);
    if (serializedState === null) {
      return undefined;
    }
    return sanitizePersistedState(JSON.parse(serializedState));
  } catch {
    return undefined;
  }
};

export const saveStateToLocalStorage = (state: RootState) => {
  try {
    const serializedState = JSON.stringify({
      app: {
        theme: state.app.theme,
        auth: {
          ...state.app.auth,
          isFetching: false,
        },
      },
    });
    localStorage.setItem(localStorageKey, serializedState);
  } catch (e) {
    console.warn(e);
  }
};
