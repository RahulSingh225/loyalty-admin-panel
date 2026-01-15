'use server'

export interface StakeholderType {
    id: string;
    name: string;
    desc: string;
    mult: string;
    status: string;
}

export interface PointsRule {
    id: string;
    stakeholder: string;
    category: string;
    base: number;
    mult: string;
    from: string;
    status: string;
}

const stakeholderTypes = [
    { id: 'ST001', name: 'Retailer', desc: 'Retail outlets selling products', mult: '1.0x', status: 'Active' },
    { id: 'ST002', name: 'CSB', desc: 'Channel Sales Business partners', mult: '1.2x', status: 'Active' },
    { id: 'ST003', name: 'Electrician', desc: 'Electricians installing products', mult: '0.8x', status: 'Active' },
    { id: 'ST004', name: 'Distributor', desc: 'Product distributors', mult: '0.5x', status: 'Inactive' },
];

const pointsMatrix = [
    { id: 'PM001', stakeholder: 'Retailer', category: 'Electrical Products', base: 10, mult: '1.0x', from: '2023-01-01', status: 'Active' },
    { id: 'PM002', stakeholder: 'CSB', category: 'Electrical Products', base: 10, mult: '1.2x', from: '2023-01-01', status: 'Active' },
    { id: 'PM003', stakeholder: 'Electrician', category: 'Electrical Products', base: 10, mult: '0.8x', from: '2023-01-01', status: 'Active' },
    { id: 'PM004', stakeholder: 'Retailer', category: 'Lighting Products', base: 8, mult: '1.0x', from: '2023-01-01', status: 'Active' },
    { id: 'PM005', stakeholder: 'All', category: 'Special Promotion', base: 15, mult: '1.5x', from: '2023-10-01', status: 'Scheduled' },
];

export async function getMastersDataAction() {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
        stakeholderTypes,
        pointsMatrix
    };
}
