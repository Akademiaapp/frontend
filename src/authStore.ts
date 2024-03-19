import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';
import type Keycloak from 'keycloak-js';

export interface UserInfo {
    email: string;
    name: string;
    username: string;
    sub: string;
    email_verified: boolean;
    preferred_username: string;
    given_name: string;
    family_name: string;
    token: string;
}

export const userInfo: Writable<UserInfo> = writable(JSON.parse(localStorage.getItem('userInfo') || '{}'));
export const keycloakState: Writable<Keycloak> = writable(JSON.parse(localStorage.getItem('keycloakState') || '{}'));

// Persist the user info and keycloak in local storage
userInfo.subscribe((value) => {
    localStorage.setItem('userInfo', JSON.stringify(value));
});
keycloakState.subscribe((value) => {
    localStorage.setItem('keycloakState', JSON.stringify(value));
});