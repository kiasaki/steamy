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

// Projects
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
export function projectsFetchList(params) {
    return {
        [CALL_API]: {
            id: 'list',
            entityType: 'projects',
            method: 'GET',
            endpoint: `/v1/projects/`,
            params
        }
    };
}
export function projectsCreate(project) {
    return {
        [CALL_API]: {
            entityType: 'projects',
            id: 'created',
            method: 'POST',
            endpoint: '/v1/projects/',
            body: project
        }
    };
}

export function projectsUpdate(project) {
    return {
        [CALL_API]: {
            entityType: 'projects',
            id: 'updated',
            method: 'PATCH',
            endpoint: `/v1/projects/${project.id}/`,
            body: project
        }
    };
}

// Environments
export function environmentsCreate(projectId, body) {
    return {
        [CALL_API]: {
            id: 'created',
            entityType: 'environments',
            method: 'POST',
            endpoint: `/v1/projects/${projectId}/environments/`,
            body
        }
    };
}

// Hosts
export function hostsFetchList(params) {
    return {
        [CALL_API]: {
            id: 'list',
            entityType: 'hosts',
            method: 'GET',
            endpoint: `/v1/hosts/`,
            params
        }
    };
}

// Users
export function usersFetchOne(id) {
    return {
        [CALL_API]: {
            id,
            entityType: 'users',
            method: 'GET',
            endpoint: `/v1/users/${id}/`
        }
    };
}
export function usersFetchList(params) {
    return {
        [CALL_API]: {
            id: 'list',
            entityType: 'users',
            method: 'GET',
            endpoint: `/v1/users/`,
            params
        }
    };
}
export function usersCreate(email, password) {
    return {
        [CALL_API]: {
            entityType: 'users',
            id: 'created',
            method: 'POST',
            endpoint: '/v1/users/',
            body: {email, password}
        }
    };
}
export function usersUpdate(user) {
    return {
        [CALL_API]: {
            entityType: 'users',
            id: 'updated',
            method: 'PATCH',
            endpoint: `/v1/users/${user.id}/`,
            body: user
        }
    };
}

// Builds
export function buildsFetchList(params) {
    return {
        [CALL_API]: {
            id: 'list',
            entityType: 'builds',
            method: 'GET',
            endpoint: `/v1/builds/`,
            params
        }
    };
}
