import { sampleClaims } from "@/services/data/sample-claims";

import { Claim } from "@/types/authorization";
import { generateId } from "@/utils/id";

const STORAGE_KEY = 'loan-os-claims';

// Initialize claims from localStorage or use sample claims if none exist
const claims: Claim[] = (() => {
    const storedClaims = localStorage.getItem(STORAGE_KEY);
    if (storedClaims) {
        return JSON.parse(storedClaims);
    }
    // Store initial sample claims
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleClaims));
    return sampleClaims;
})();

function getClaims() : Claim[] {
    return claims;
}

function createClaim(claim: Claim) : Claim {
    const newClaim = { ...claim, id: generateId("claim") };
    claims.push(newClaim);
    // Update localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(claims));
    return newClaim;
}

function updateClaim(claim: Claim) : Claim {
    const index = claims.findIndex(c => c.id === claim.id);
    if (index === -1) {
        throw new Error(`Claim with id ${claim.id} not found`);
    }
    claims[index] = claim;
    // Update localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(claims));
    return claim;
}

function deleteClaim(id: string) {
    const index = claims.findIndex(c => c.id === id);
    if (index === -1) {
        throw new Error(`Claim with id ${id} not found`);
    }
    claims.splice(index, 1);
    // Update localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(claims));
}

export { 
    getClaims, 
    createClaim, 
    updateClaim, 
    deleteClaim 
};