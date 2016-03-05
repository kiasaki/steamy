import { push } from 'react-router-redux';

import { getPersistedToken } from '../lib/auth';
import { CALL_API } from '../lib/api-middleware';
import { API_UPDATE } from '../lib/api-middleware';

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

export function clearCurrentUser() {
    return {
        type: API_UPDATE,
        response: {
            data: {},
            entityType: 'users',
            id: 'current'
        }
    };
}

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

export function projectsCreate(title) {
    return {
        [CALL_API]: {
            entityType: 'projects',
            id: 'created',
            method: 'POST',
            endpoint: '/v1/projects',
            body: {title}
        }
    };
}

export function projectsFetchOne(id) {
    return {
        [CALL_API]: {
            id,
            entityType: 'projects',
            method: 'GET',
            endpoint: `/v1/projects/${id}`
        }
    };
}
