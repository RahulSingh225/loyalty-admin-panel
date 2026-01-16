'use server'

export interface Member {
    id: string;
    name: string;
    email: string;
    mobile: string;
    points: number;
    status: 'active' | 'inactive' | 'blocked';
    joinDate: string;
    tier: string;
}

const membersData: Member[] = [
    {
        id: 'MEM001',
        name: 'John Doe',
        email: 'john.doe@example.com',
        mobile: '+91 9876543210',
        points: 2500,
        status: 'active',
        joinDate: '2023-01-15',
        tier: 'Gold'
    },
    {
        id: 'MEM002',
        name: 'Alice Smith',
        email: 'alice.smith@example.com',
        mobile: '+91 9876543211',
        points: 1800,
        status: 'active',
        joinDate: '2023-02-20',
        tier: 'Silver'
    },
    {
        id: 'MEM003',
        name: 'Bob Johnson',
        email: 'bob.johnson@example.com',
        mobile: '+91 9876543212',
        points: 500,
        status: 'inactive',
        joinDate: '2023-03-10',
        tier: 'Bronze'
    },
    {
        id: 'MEM004',
        name: 'Emma Wilson',
        email: 'emma.wilson@example.com',
        mobile: '+91 9876543213',
        points: 3200,
        status: 'blocked',
        joinDate: '2023-01-05',
        tier: 'Gold'
    }
];

export async function getMembersAction(): Promise<Member[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return membersData;
}
