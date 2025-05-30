import { samplePolicies } from "@/services/data/sample-policies";

import { Policy } from "@/types/authorization";
import { generateId } from "@/utils/id";

const STORAGE_KEY = 'loan-os-policies';

// Initialize policies from localStorage or use sample policies if none exist
const policies: Policy[] = (() => {
    const storedPolicies = localStorage.getItem(STORAGE_KEY);
    if (storedPolicies) {
        return JSON.parse(storedPolicies);
    }
    // Store initial sample policies
    localStorage.setItem(STORAGE_KEY, JSON.stringify(samplePolicies));
    return samplePolicies;
})();

function getPolicies() : Policy[] {
    return policies;
}

function createPolicy(policy: Policy) : Policy {
    const newPolicy = { ...policy, id: generateId("policy") };
    policies.push(newPolicy);
    // Update localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(policies));
    return newPolicy;
}

function updatePolicy(policy: Policy) : Policy {
    const index = policies.findIndex(p => p.id === policy.id);
    if (index === -1) {
        throw new Error(`Policy with id ${policy.id} not found`);
    }
    policies[index] = policy;
    // Update localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(policies));
    return policy;
}

function deletePolicy(id: string) {
    const index = policies.findIndex(p => p.id === id);
    if (index === -1) {
        throw new Error(`Policy with id ${id} not found`);
    }
    policies.splice(index, 1);
    // Update localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(policies));
}

export { 
    getPolicies,
    createPolicy,
    updatePolicy,
    deletePolicy
}