import { users } from '../usuarios/data.js';

export let currentUser = null;

export function authenticate(userId, password) {
    const user = users[userId];
    if (user && user.password === password) {
        currentUser = { id: userId, ...user };
        return currentUser;
    }
    return null;
}

export function logout() {
    currentUser = null;
}
