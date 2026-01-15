'use server'

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    department: string;
    lastLogin: string;
    status: 'active' | 'inactive' | 'pending';
    avatar: string;
    initials: string;
    color: string;
}

export interface Role {
    id: string;
    name: string;
    description: string;
    type: 'system' | 'custom';
    permissions: string[];
}

export interface AccessLog {
    id: string;
    user: string;
    initials: string;
    color: string;
    action: string;
    module: string;
    ip: string;
    dateTime: string;
    status: 'success' | 'failed';
}

const usersData: User[] = [
    {
        id: 'USR001',
        name: 'John Doe',
        email: 'john.doe@sturlite.com',
        role: 'Admin',
        department: 'IT',
        lastLogin: 'Oct 25, 2023 10:30 AM',
        status: 'active',
        avatar: '',
        initials: 'JD',
        color: 'primary.main'
    },
    {
        id: 'USR002',
        name: 'Alice Smith',
        email: 'alice.smith@sturlite.com',
        role: 'Manager',
        department: 'Sales',
        lastLogin: 'Oct 25, 2023 09:15 AM',
        status: 'active',
        avatar: '',
        initials: 'AS',
        color: 'success.main'
    },
    {
        id: 'USR003',
        name: 'Robert Johnson',
        email: 'robert.johnson@sturlite.com',
        role: 'Operator',
        department: 'Operations',
        lastLogin: 'Oct 24, 2023 04:45 PM',
        status: 'active',
        avatar: '',
        initials: 'RJ',
        color: 'secondary.main'
    },
    {
        id: 'USR004',
        name: 'Emma Wilson',
        email: 'emma.wilson@sturlite.com',
        role: 'Viewer',
        department: 'Marketing',
        lastLogin: 'Oct 23, 2023 02:30 PM',
        status: 'pending',
        avatar: '',
        initials: 'EW',
        color: 'warning.main'
    },
    {
        id: 'USR005',
        name: 'Michael Brown',
        email: 'michael.brown@sturlite.com',
        role: 'Manager',
        department: 'Finance',
        lastLogin: 'Oct 22, 2023 11:20 AM',
        status: 'inactive',
        avatar: '',
        initials: 'MB',
        color: 'error.main'
    }
];

const rolesData: Role[] = [
    {
        id: 'admin',
        name: 'Admin',
        description: 'Full system access with all permissions',
        type: 'system',
        permissions: ['User Management', 'Role Management', 'System Configuration', 'Reports', 'All Modules']
    },
    {
        id: 'manager',
        name: 'Manager',
        description: 'Department-level access with limited permissions',
        type: 'system',
        permissions: ['Team Management', 'Department Reports', 'Process Approval']
    },
    {
        id: 'operator',
        name: 'Operator',
        description: 'Day-to-day operations with limited access',
        type: 'system',
        permissions: ['Scan/Transaction', 'Redemption', 'Basic Reports']
    },
    {
        id: 'viewer',
        name: 'Viewer',
        description: 'Read-only access to reports and dashboards',
        type: 'system',
        permissions: ['View Reports', 'View Dashboard']
    }
];

const accessLogsData: AccessLog[] = [
    {
        id: 'LOG001',
        user: 'John Doe',
        initials: 'JD',
        color: 'primary.main',
        action: 'Login',
        module: 'Authentication',
        ip: '192.168.1.1',
        dateTime: 'Oct 25, 2023 10:30 AM',
        status: 'success'
    },
    {
        id: 'LOG002',
        user: 'Alice Smith',
        initials: 'AS',
        color: 'success.main',
        action: 'View Report',
        module: 'Reports',
        ip: '192.168.1.2',
        dateTime: 'Oct 25, 2023 09:45 AM',
        status: 'success'
    },
    {
        id: 'LOG003',
        user: 'Robert Johnson',
        initials: 'RJ',
        color: 'secondary.main',
        action: 'Failed Login',
        module: 'Authentication',
        ip: '192.168.1.3',
        dateTime: 'Oct 25, 2023 09:15 AM',
        status: 'failed'
    }
];

export async function getRoleDataAction() {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
        users: usersData,
        roles: rolesData,
        logs: accessLogsData
    };
}
