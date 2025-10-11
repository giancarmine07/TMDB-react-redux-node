import { configureStore } from '@reduxjs/toolkit';
import authReducer, { setCredentials, logout } from '../src/store/slices/authSlice';

describe('Auth Slice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });
  });

  it('should set credentials', () => {
    const user = { id: 1, username: 'test', email: 'test@example.com' };
    const token = 'test-token';

    store.dispatch(setCredentials({ user, token }));

    const state = store.getState().auth;
    expect(state.user).toEqual(user);
    expect(state.token).toBe(token);
    expect(state.isAuthenticated).toBe(true);
  });

  it('should logout', () => {
    const user = { id: 1, username: 'test', email: 'test@example.com' };
    store.dispatch(setCredentials({ user, token: 'test-token' }));

    store.dispatch(logout());

    const state = store.getState().auth;
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
