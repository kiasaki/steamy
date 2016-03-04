import { push } from 'react-router-redux';

import { getPersistedToken } from '../lib/auth';
import { CALL_API } from '../lib/api-middleware';

export function createSimpleActionCreator(type, key) {
    return (value) => {
        return {
            type,
            [key]: value
        };
    };
}

export const SET_AUTH_TOKEN = 'SET_AUTH_TOKEN';
export const setAuthToken = createSimpleActionCreator(SET_AUTH_TOKEN, 'authToken');


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
