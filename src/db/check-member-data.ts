
import { db } from '@/db';
import { userTypeLevelMaster, userTypeEntity } from '@/db/schema';
import dotenv from 'dotenv';
import path from 'path';

// Try to load env from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Fallback to .env if needed (though user likely uses .env.local)
dotenv.config();

console.log('DATABASE_URL:', process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/:[^:]+@/, ':***@') : 'UNDEFINED');

async function checkMemberData() {
    try {
        console.log('Checking userTypeLevelMaster...');
        const levels = await db.select().from(userTypeLevelMaster);
        console.log('Levels:', JSON.stringify(levels, null, 2));

        console.log('Checking userTypeEntity...');
        const entities = await db.select().from(userTypeEntity);
        console.log('Entities:', JSON.stringify(entities, null, 2));

    } catch (error) {
        console.error('Error checking data:', error);
    }
}

checkMemberData();
