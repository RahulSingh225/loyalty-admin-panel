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

import { db } from "@/db";
import { users, userTypeEntity, approvalStatuses } from "@/db/schema";
import { eq, and, count, or, ilike, sql } from "drizzle-orm";

export interface UserFilters {
    searchTerm?: string;
    roleFilter?: string;
    statusFilter?: string;
}

export async function getRoleDataAction(filters?: UserFilters) {
    try {
        const { searchTerm, roleFilter, statusFilter } = filters || {};

        let userQuery = db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: userTypeEntity.typeName,
            status: approvalStatuses.name,
            lastLogin: users.lastLoginAt,
            isSuspended: users.isSuspended,
        })
            .from(users)
            .leftJoin(userTypeEntity, eq(users.roleId, userTypeEntity.id))
            .leftJoin(approvalStatuses, eq(users.approvalStatusId, approvalStatuses.id))
            .$dynamic();

        const conditions = [];

        if (searchTerm) {
            conditions.push(or(
                ilike(users.name, `%${searchTerm}%`),
                ilike(users.email, `%${searchTerm}%`),
                sql`CAST(${users.id} AS TEXT) ILIKE ${'%' + searchTerm + '%'}`
            ));
        }

        if (roleFilter) {
            conditions.push(eq(userTypeEntity.typeName, roleFilter));
        }

        if (statusFilter) {
            if (statusFilter === 'active') {
                conditions.push(eq(users.isSuspended, false));
                conditions.push(or(
                    ilike(approvalStatuses.name, '%approved%'),
                    ilike(approvalStatuses.name, '%active%')
                ));
            } else if (statusFilter === 'inactive') {
                conditions.push(eq(users.isSuspended, true));
            } else if (statusFilter === 'pending') {
                conditions.push(eq(users.isSuspended, false));
                conditions.push(sql`NOT (${approvalStatuses.name} ILIKE '%approved%' OR ${approvalStatuses.name} ILIKE '%active%')`);
            }
        }

        if (conditions.length > 0) {
            userQuery = userQuery.where(and(...conditions));
        }

        const dbUsers = await userQuery.limit(100);

        const [totalUsersCount] = await db.select({ value: count() }).from(users);
        const [activeUsersCount] = await db.select({ value: count() }).from(users).where(eq(users.isSuspended, false));
        const [adminUsersCount] = await db.select({ value: count() }).from(users).innerJoin(userTypeEntity, and(eq(users.roleId, userTypeEntity.id), eq(userTypeEntity.typeName, 'Admin')));

        const formattedUsers: User[] = dbUsers.map(u => {
            const initials = u.name ? u.name.split(' ').map(n => n[0]).join('').toUpperCase() : '??';
            const colors = ['#3f51b5', '#673ab7', '#4caf50', '#ff9800', '#f44336']; // Use consistent hex colors
            const color = colors[u.id % colors.length];

            return {
                id: `USR${u.id.toString().padStart(3, '0')}`,
                name: u.name || 'Unknown',
                email: u.email || 'N/A',
                role: u.role || 'User',
                department: 'N/A',
                lastLogin: u.lastLogin ? new Date(u.lastLogin).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Never',
                status: u.isSuspended ? 'inactive' : (u.status?.toLowerCase().includes('approved') || u.status?.toLowerCase().includes('active') ? 'active' : 'pending'),
                avatar: '',
                initials: initials,
                color: color
            };
        });

        return {
            users: formattedUsers,
            roles: rolesData,
            logs: accessLogsData,
            stats: {
                totalUsers: totalUsersCount.value,
                activeUsers: activeUsersCount.value,
                adminUsers: adminUsersCount.value,
                pendingInvites: 0
            }
        };
    } catch (error) {
        console.error("Error fetching role data:", error);
        return {
            users: [],
            roles: [],
            logs: [],
            stats: {
                totalUsers: 0,
                activeUsers: 0,
                adminUsers: 0,
                pendingInvites: 0
            }
        };
    }
}
