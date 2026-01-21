'use server'

import { db } from "@/db"
import { tickets, users, ticketTypes, ticketStatuses } from "@/db/schema"
import { desc, eq } from "drizzle-orm"
import { alias } from "drizzle-orm/pg-core"

export async function getTicketsAction() {
    try {
        const requester = alias(users, 'requester');
        const assignee = alias(users, 'assignee');

        const dbTickets = await db.select({
            id: tickets.id,
            subject: tickets.subject,
            description: tickets.description,
            priority: tickets.priority,
            createdAt: tickets.createdAt,
            updatedAt: tickets.updatedAt,
            typeName: ticketTypes.name,
            statusName: ticketStatuses.name,
            requesterName: requester.name,
            assigneeName: assignee.name,
        })
            .from(tickets)
            .leftJoin(ticketTypes, eq(tickets.typeId, ticketTypes.id))
            .leftJoin(ticketStatuses, eq(tickets.statusId, ticketStatuses.id))
            .leftJoin(requester, eq(tickets.createdBy, requester.id))
            .leftJoin(assignee, eq(tickets.assigneeId, assignee.id))
            .orderBy(desc(tickets.createdAt))
            .limit(100);

        return dbTickets.map(t => ({
            id: `TKT-${t.id.toString().padStart(3, '0')}`,
            subject: t.subject || 'No Subject',
            description: t.description,
            requester: t.requesterName || 'Unknown',
            type: t.typeName || 'General',
            status: t.statusName || 'Open',
            priority: t.priority || 'Medium',
            assignedTo: t.assigneeName || 'Unassigned',
            createdAt: t.createdAt,
            lastUpdated: t.updatedAt
        }));
    } catch (error) {
        console.error("Error in getTicketsAction:", error);
        return [];
    }
}
