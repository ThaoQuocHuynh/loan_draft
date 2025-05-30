import { sampleClaims } from "@/services/data/sample-claims";
import { samplePolicies } from "@/services/data/sample-policies";
import { sampleRoles, sampleRolePolicyAssignments, sampleRoleClaimsAssignments } from "@/services/data/sample-roles";

import { Claim, Policy, Role } from "@/types/authorization";
import { generateId } from "@/utils/id";

const STORAGE_KEYS = {
    ROLES: 'loan-os-roles',
    ROLE_POLICY_ASSIGNMENTS: 'loan-os-role-policy-assignments',
    ROLE_CLAIMS_ASSIGNMENTS: 'loan-os-role-claims-assignments'
};

// Initialize roles from localStorage or use sample roles if none exist
const roles: Role[] = (() => {
    const storedRoles = localStorage.getItem(STORAGE_KEYS.ROLES);
    if (storedRoles) {
        return JSON.parse(storedRoles);
    }
    // Store initial sample roles
    localStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(sampleRoles));
    return sampleRoles;
})();

// Initialize role policy assignments from localStorage or use sample assignments if none exist
const rolePolicyAssignments = (() => {
    const storedAssignments = localStorage.getItem(STORAGE_KEYS.ROLE_POLICY_ASSIGNMENTS);
    if (storedAssignments) {
        return JSON.parse(storedAssignments);
    }
    // Store initial sample assignments
    localStorage.setItem(STORAGE_KEYS.ROLE_POLICY_ASSIGNMENTS, JSON.stringify(sampleRolePolicyAssignments));
    return sampleRolePolicyAssignments;
})();

// Initialize role claims assignments from localStorage or use sample assignments if none exist
const roleClaimsAssignments = (() => {
    const storedAssignments = localStorage.getItem(STORAGE_KEYS.ROLE_CLAIMS_ASSIGNMENTS);
    if (storedAssignments) {
        return JSON.parse(storedAssignments);
    }
    // Store initial sample assignments
    localStorage.setItem(STORAGE_KEYS.ROLE_CLAIMS_ASSIGNMENTS, JSON.stringify(sampleRoleClaimsAssignments));
    return sampleRoleClaimsAssignments;
})();

function getRoles(): Role[] {
    return roles;
}

function createRole(role: Role): Role {
    const newRole = { ...role, id: generateId("role") };
    roles.push(newRole);
    // Update localStorage
    localStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(roles));
    return newRole;
}

function updateRole(role: Role): Role {
    const index = roles.findIndex(r => r.id === role.id);
    if (index === -1) {
        throw new Error(`Role with id ${role.id} not found`);
    }
    roles[index] = role;
    // Update localStorage
    localStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(roles));
    return role;
}

function deleteRole(id: string) {
    const index = roles.findIndex(r => r.id === id);
    if (index === -1) {
        throw new Error(`Role with id ${id} not found`);
    }
    roles.splice(index, 1);
    // Update localStorage
    localStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(roles));
}

function getRolePolicies(roleId: string): Policy[] {
    return rolePolicyAssignments
        .filter((a: { targetId: string }) => a.targetId === roleId)
        .map((a: { policyId: string }) => samplePolicies.find(p => p.id === a.policyId))
        .filter((policy: Policy | undefined): policy is Policy => policy !== null);
}

function getRoleClaims(roleId: string): Claim[] {
    return roleClaimsAssignments
        .filter((a: { targetId: string }) => a.targetId === roleId)
        .map((a: { claimId: string }) => sampleClaims.find(c => c.id === a.claimId))
        .filter((claim: Claim | undefined): claim is Claim => claim !== null);
}

function addClaimToRole(roleId: string, claimId: string) {
    roleClaimsAssignments.push({
        id: generateId("claim-assignment"),
        targetType: "role",
        targetId: roleId,
        claimId: claimId
    });
    // Update localStorage
    localStorage.setItem(STORAGE_KEYS.ROLE_CLAIMS_ASSIGNMENTS, JSON.stringify(roleClaimsAssignments));
}

function removeClaimFromRole(roleId: string, claimId: string) {
    const index = roleClaimsAssignments.findIndex((a: { targetId: string; claimId: string }) => a.targetId === roleId && a.claimId === claimId);
    if (index !== -1) {
        roleClaimsAssignments.splice(index, 1);
        // Update localStorage
        localStorage.setItem(STORAGE_KEYS.ROLE_CLAIMS_ASSIGNMENTS, JSON.stringify(roleClaimsAssignments));
    }
}

function addPolicyToRole(roleId: string, policyId: string) {
    rolePolicyAssignments.push({
        id: generateId("policy-assignment"),
        targetType: "role",
        targetId: roleId,
        policyId: policyId
    });
    // Update localStorage
    localStorage.setItem(STORAGE_KEYS.ROLE_POLICY_ASSIGNMENTS, JSON.stringify(rolePolicyAssignments));
}

function removePolicyFromRole(roleId: string, policyId: string) {
    const index = rolePolicyAssignments.findIndex((a: { targetId: string; policyId: string }) => a.targetId === roleId && a.policyId === policyId);
    if (index !== -1) {
        rolePolicyAssignments.splice(index, 1);
        // Update localStorage
        localStorage.setItem(STORAGE_KEYS.ROLE_POLICY_ASSIGNMENTS, JSON.stringify(rolePolicyAssignments));
    }
}

export { 
    getRoles, 
    createRole, 
    updateRole, 
    deleteRole,
    getRolePolicies,
    getRoleClaims,
    addClaimToRole,
    removeClaimFromRole,
    addPolicyToRole,
    removePolicyFromRole
}