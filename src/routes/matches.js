import {Router} from 'express';
import {createMatchSchema, listMatchesQuerySchema} from '../validation/matches.js'
import { getMatchStatus } from './../utils/match-status.js';
import {matches} from '../db/schema.js'
import {db} from '../db/db.js'

import { desc } from 'drizzle-orm';

export const matchRouter = Router();

const MAX_LIMIT = 100;

matchRouter.get('/', async (req, res) => {
    const parsed = listMatchesQuerySchema.safeParse(req.query);
    console.log("🚀 ~ parsed:", parsed)

     if(!parsed.success){
        return res.status(400).json({
            error: 'Invalid query.', details: JSON.stringify(parsed.error)
        });
    }

    const limit = Math.min(parsed.data.limit ?? 50, MAX_LIMIT);
    console.log("🚀 ~ limit:", limit)
    try {
        const data = await db.select().from(matches).orderBy((desc(matches.createdAt)))
        .limit(limit)
        console.log("🚀 ~ data:", data)

       res.json({data});

    } catch (error) {
         console.log("🚀 ~ error:", error)
         res.status(500).json({error: 'Failed to get list of  match', details: JSON.stringify(error)});
    }

})

matchRouter.post('/',async (req, res) => {
    const parsed = createMatchSchema.safeParse(req.body);
    console.log("🚀 ~ parsed:", parsed)
    const {data: {sport,startTime, endTime, homeScore, awayScore}} = parsed
    

    if(!parsed.success)
    {
        return res.status(400).json({
            error: 'Invalid payload.', details: JSON.stringify(parsed.error)
        });
    }

    try {

        const [event] = await db.insert(matches).values({
            ...parsed.data,
            startTime: new Date(startTime),
            endTime: new Date(startTime),
            homeScore: homeScore ?? 0,
            awayScore: awayScore ?? 0,
            status: getMatchStatus(startTime, endTime),

        }).returning();
        res.status(201).json({data: event})
    } catch (error) {
        console.log("🚀 ~ error:", error)
        res.status(500).json({error: 'Failed to create match', details: JSON.stringify(error)});
    }

})