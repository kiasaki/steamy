import { push } from 'redux-router';

import { getPersistedToken } from '../lib/auth';
import { CALL_API } from '../lib/api-middleware';

export const SET_AUTH_TOKEN = 'SET_AUTH_TOKEN';
export const SET_AUTH_USER = 'SET_AUTH_USER';

export function fetchCurrentUser() {
    return {
        [CALL_API]: {
            entityType: 'users',
            id: 'current',
            endpoint: '/v1/current-user'
        }
    };
}
