import { push } from 'react-router-redux';

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

export function tokensCreate(email, password) {
    return {
        [CALL_API]: {
            entityType: 'tokens',
            id: 'login',
            method: 'POST',
            endpoint: '/v1/tokens',
            body: {email, password}
        }
    };
}
