// mq_init.ts

import { BaseMQConnector } from './baseConnecter';
import { RabbitMQConnector } from './rabbitmQConnecter';
import { db } from "@/db";
import { eventLogs, eventMaster } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

// Your single registry for all 25+ events
export const BUS_EVENTS = {
  // User lifecycle
  USER_CREATED: 'user.created',
  USER_APPROVED: 'user.approved',
  USER_BLOCK: 'user.blocked',
  USER_SCAN_BLOCK: 'user.scan.blocked',
  USER_REDEMPTION_BLOCK: 'user.redemption.blocked',
  USER_LOGIN_OTP: 'user.login.otp',

  // KYC
  USER_KYC_SUBMITTED: 'user.kyc.submitted',
  USER_KYC_APPROVED: 'user.kyc.approved',
  USER_KYC_REJECT: 'user.kyc.rejected',

  // Profile
  PROFILE_UPDATE: 'user.profile.updated',

  // Ticketing
  TICKET_CREATE: 'ticket.created',
  TICKET_ASSIGNED: 'ticket.assigned',
  TICKET_CLOSED: 'ticket.closed',

  // Redemption
  REDEMPTION_REQUEST: 'redemption.requested',
  REDEMPTION_APPROVE: 'redemption.approved',
  REDEMPTION_REJECT: 'redemption.rejected',

  // Earnings
  EARNING_SCAN: 'earning.scan',
  EARNING_OTHER: 'earning.other',

  // QR
  QR_BATCH_CREATED: 'qr.batch.created',
  QR_BATCH_PROCESSED: 'qr.batch.processed',
  QR_BATCH_FAILED: 'qr.batch.failed',

  // Admin
  ADMIN_LOGIN: 'admin.login',
  ADMIN_HIEARCHY_CREATED: 'admin.hierarchy.created',
  ADMIN_MANUAL_TRANSACTION_ENTRY: 'admin.transaction.manual',
  SKU_POINT_CHANGE: 'sku.points.changed',
  SKU_RULE_MODIFY: 'sku.rule.modified',
  LOCATION_LEVEL_CHANGED: 'location.level.changed',
  MEMBER_MASTER_CONFIG_UPDATE: 'member.master.config.updated',

  // Compliance / Consent
  TDS_CONSENT: 'tds.consent.updated',
} as const;

export type BusEvent = typeof BUS_EVENTS[keyof typeof BUS_EVENTS];
export type BusEventKey = keyof typeof BUS_EVENTS;


let connector: BaseMQConnector | null = null;

export const initMQ = () => {
  if (!connector) {
    connector = new RabbitMQConnector();
  }
  return connector;
};

export const publish = (topic: string, payload: any) => initMQ().publish(topic, payload).then(r => console.log(r)).catch(e => console.log(e))

export const subscribe = (topic: string, handler: (payload: any) => Promise<void>) =>
  initMQ().subscribe(topic, handler).then(r => console.log(r)).catch(e => console.log(e));


export interface EventLogPayload {
  userId?: number;
  entityId?: string;
  correlationId?: string;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
  action?: string;
  eventType?: string;
}

const PUBLISHABLE_EVENTS = new Set<string>(Object.keys(BUS_EVENTS));

// Reverse mapping to find KEY from VALUE (topic)
const TOPIC_TO_KEY_MAP = Object.fromEntries(
  Object.entries(BUS_EVENTS).map(([key, value]) => [value, key])
) as Record<string, BusEventKey>;

/**
 * Centrally log an event into 'event_logs' and conditionally publish it to RabbitMQ.
 * All events are persisted for auditing, but only those in BUS_EVENTS are broadcasted.
 */
export async function emitEvent(
  eventInput: BusEventKey | BusEvent,
  payload: EventLogPayload & { [key: string]: any }
) {
  try {
    let eventKey: BusEventKey;
    let topic: string;

    // 1. Resolve Key and Topic
    if (eventInput in BUS_EVENTS) {
      // Input is a key (e.g., 'ADMIN_LOGIN')
      eventKey = eventInput as BusEventKey;
      topic = BUS_EVENTS[eventKey];
    } else {
      // Input is a value/topic (e.g., 'admin.login')
      topic = eventInput as string;
      eventKey = TOPIC_TO_KEY_MAP[topic] || (topic as BusEventKey);
    }

    // Automatically capture userId from session if not provided

    const session = await auth();
    if (session?.user?.id) {
      payload.userId = Number(session.user.id);
    }


    // Auto-generate correlationId if missing
    const correlationId = payload.correlationId || crypto.randomUUID();

    // 2. Find event in master to get ID (Always via the KEY)
    const [masterDef] = await db
      .select()
      .from(eventMaster)
      .where(eq(eventMaster.eventKey, eventKey))
      .limit(1);

    if (masterDef) {
      // 3. Persist to event_logs
      await db.insert(eventLogs).values({
        userId: payload.userId || null,
        eventId: masterDef.id,
        action: payload.action || eventKey,
        eventType: payload.eventType || masterDef.category || 'system',
        entityId: payload.entityId || null,
        correlationId: correlationId,
        metadata: payload.metadata || payload,
        ipAddress: payload.ipAddress || null,
        userAgent: payload.userAgent || null,
      });
    } else {
      console.warn(`[EventLogger] Event key '${eventKey}' not found in event_master. DB logging skipped.`);
    }

    // 4. Conditionally Publish to MQ
    if (PUBLISHABLE_EVENTS.has(eventKey)) {
      await publish(topic, {
        ...payload,
        userId: payload.userId,
        correlationId: correlationId,
        eventKey,
        topic,
        timestamp: new Date().toISOString(),
      });
      console.log(`[EventLogger] Successfully emitted and published: ${eventKey} (${topic})`);
    } else {
      console.log(`[EventLogger] Successfully logged (not publishable): ${eventKey}`);
    }

  } catch (error) {
    console.error(`[EventLogger] Failed to handle event '${eventInput}':`, error);
  }
}
