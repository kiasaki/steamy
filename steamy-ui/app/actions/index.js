import { push } from 'redux-router';

import { getPersistedToken } from '../lib/auth';

export const SET_AUTH_TOKEN = 'SET_AUTH_TOKEN';
export const SET_AUTH_USER = 'SET_AUTH_USER';

export function fetchCurrentUser() {
    const token = getPersistedToken();
    return push('/signin');
}
