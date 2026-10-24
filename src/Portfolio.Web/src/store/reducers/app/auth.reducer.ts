import { configuration } from '@config';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosResponse } from 'axios';
import { AuthenticateUserInput, AppUser } from './models';
import { axiosInstance, clearCsrfToken } from '@modules';
import { RootState } from 'src/store/store';

const getInitialState = () => {
  if (configuration.mocks.user) {
    return {
      ...initialState,
    };
  }
  return initialState;
};

type SliceState = {
  user: AppUser | null,
  isFetching: boolean,
  error: string | null,
}

const initialState: SliceState = {
  user: null,
  isFetching: false,
  error: null,
};

export const authenticateUser = createAsyncThunk(
  'auth/authenticateUser',
  async (input: AuthenticateUserInput, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<AuthenticateUserInput, AxiosResponse<AppUser>>(
        '/api/auth/verify',
        input,
      );
      clearCsrfToken();
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const msg =
          (error.response.data as any)?.message ||
          (error.response.data as any)?.Message ||
          'Autentificare eșuată.';
        return rejectWithValue(msg);
      }
      return rejectWithValue('Failed to authenticate');
    }
  },
);

export const authenticateAdmin = createAsyncThunk(
  'auth/authenticateAdmin',
  async (input: AuthenticateUserInput, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<AuthenticateUserInput, AxiosResponse<AppUser>>(
        '/api/auth/verify/admin',
        input,
      );
      clearCsrfToken();
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const msg =
          (error.response.data as any)?.message ||
          (error.response.data as any)?.Message ||
          'Autentificare eșuată.';
        return rejectWithValue(msg);
      }
      return rejectWithValue('Failed to authenticate');
    }
  },
);

export const logoutUser = createAsyncThunk<undefined, undefined, { state: RootState }>(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post('/api/auth/logout');
      clearCsrfToken();
    } catch (error) {
      clearCsrfToken();
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Failed to logout');
    }
  },
);

const authSlice = createSlice({
  name: 'app.auth',
  initialState: getInitialState(),
  reducers: {
    clearUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticateUser.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isFetching = false;
        state.error = null;
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as string;
      })
      .addCase(authenticateAdmin.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(authenticateAdmin.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isFetching = false;
        state.error = null;
      })
      .addCase(authenticateAdmin.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUser } = authSlice.actions;

export const authReducer = authSlice.reducer;
