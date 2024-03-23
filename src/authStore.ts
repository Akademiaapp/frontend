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
}

export const userInfo: Writable<UserInfo> = writable();
export const keycloakState: Writable<Keycloak> = writable();

