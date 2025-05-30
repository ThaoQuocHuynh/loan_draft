import { User } from "@/types/user";
import { sampleUsers } from "@/services/data/sample-users";

const STORAGE_KEY = 'loan-os-users';

// Initialize users from localStorage or use sample users if none exist
let users: User[] = (() => {
    const storedUsers = localStorage.getItem(STORAGE_KEY);
    if (storedUsers) {
        return JSON.parse(storedUsers);
    }
    // Store initial sample users
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleUsers));
    return sampleUsers;
})();

function getUsers(): User[] {
    return Object.values(users);
}

function getUser(key: string): User {
    const user = Object.values(users).find(user => user.id === key);
    if (!user) {
        throw new Error(`User with id ${key} not found`);
    }
    return user;
}

function getUserByEmail(email: string): User {
    const user = Object.values(users).find(user => user.email === email);
    if (!user) {
        throw new Error(`User with email ${email} not found`);
    }
    return user;
}

function updateUser(user: User): User {
    if (!users.find(u => u.id === user.id)) {
        throw new Error(`User with id ${user.id} not found`);
    }
    const index = users.findIndex(u => u.id === user.id);
    users[index] = user;
    // Update localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    return user;
}

function deleteUser(id: string) {
    if (!users.find(u => u.id === id)) {
        throw new Error(`User with id ${id} not found`);
    }
    users = users.filter(u => u.id !== id);
    // Update localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function addUser(user: User) {
    users.push(user);
    //users[user.id] = user;
    // Update localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function getUserRoleKeys(userId: string): string[] {
    if (!users.find(u => u.id === userId)) {
        throw new Error(`User with id ${userId} not found`);
    }
    const user_permissions = users.find(u => u.id === userId)?.permissions;
    return user_permissions?.roles || [];
}

function getUserClaimKeys(userId: string): string[] {
    if (!users.find(u => u.id === userId)) {
        throw new Error(`User with id ${userId} not found`);
    }
    const user_permissions = users.find(u => u.id === userId)?.permissions;
    return user_permissions?.claims || [];
}

function getUserPolicyKeys(userId: string): string[] {
    if (!users.find(u => u.id === userId)) {
        throw new Error(`User with id ${userId} not found`);
    }
    const user_permissions = users.find(u => u.id === userId)?.permissions;
    return user_permissions?.policies || [];
}

function addClaimToUser(userId: string, claimKey: string) {
    if (!users.find(u => u.id === userId)) {
        throw new Error(`User with id ${userId} not found`);
    }
    users.find(u => u.id === userId)?.permissions.claims.push(claimKey);
}

function addRoleToUser(userId: string, roleKey: string) {
    if (!users.find(u => u.id === userId)) {
        throw new Error(`User with id ${userId} not found`);
    }
    users.find(u => u.id === userId)?.permissions.roles.push(roleKey);
}

function addPolicyToUser(userId: string, policyKey: string) {
    if (!users.find(u => u.id === userId)) {
        throw new Error(`User with id ${userId} not found`);
    }
    users.find(u => u.id === userId)?.permissions.policies.push(policyKey);
}

function removeClaimFromUser(userId: string, claimKey: string) {
    if (!users.find(u => u.id === userId)) {
        throw new Error(`User with id ${userId} not found`);
    }
    const user = users.find(u => u.id === userId);
    if (user) {
        user.permissions.claims = user.permissions.claims.filter((claim) => claim !== claimKey);
    }
}

function removeRoleFromUser(userId: string, roleKey: string) {
    if (!users.find(u => u.id === userId)) {
        throw new Error(`User with id ${userId} not found`);
    }
    const user = users.find(u => u.id === userId);
    if (user) {
        user.permissions.roles = user.permissions.roles.filter((role) => role !== roleKey);
    }
}

function removePolicyFromUser(userId: string, policyKey: string) {
    if (!users.find(u => u.id === userId)) {
        throw new Error(`User with id ${userId} not found`);
    }
    const user = users.find(u => u.id === userId);
    if (user) {
        user.permissions.policies = user.permissions.policies.filter((policy) => policy !== policyKey);
    }
}

export { 
    getUsers, 
    getUser, 
    getUserByEmail, 
    updateUser,
    deleteUser,
    getUserRoleKeys,
    getUserClaimKeys,
    getUserPolicyKeys,
    addClaimToUser,
    addRoleToUser,
    addPolicyToUser,
    removeClaimFromUser,
    removeRoleFromUser,
    removePolicyFromUser,
    addUser,
}