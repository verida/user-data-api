import { Request, Response } from "express";
import Common from "../common";
import { IContext, IDatabase, IDatastore } from "@verida/types";

/**
 * 
 */
export class DbController {
    
    public async get(req: Request, res: Response) {
        const { context } = await Common.getNetworkFromRequest(req)
        const dbName = req.params[0]
        const permissions = Common.buildPermissions(req)
        
        console.log(permissions)
        
        try {
            const db = await context.openDatabase(dbName, {
                // @ts-ignore
                permissions
            })
            const results = await (await db).getMany()
            res.json(results)
        } catch (error) {
            let message = error.message
            if (error.message.match('invalid encoding')) {
                message = 'Invalid encoding (check permissions header)'
            }

            res.status(500).send(message);
        }
    }

    public async getById(req: Request, res: Response) {
        const { context } = await Common.getNetworkFromRequest(req)
        const dbName = req.params[0]
        const rowId = req.params[1]
        const db = await context.openDatabase(dbName)
        
        try {
            const results = await (await db).get(rowId)
            res.json(results)
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    public async query(req: Request, res: Response) {
        const { context } = await Common.getNetworkFromRequest(req)
        const dbName = req.params[0]
        const db = await context.openDatabase(dbName)
        
        try {
            const selector = req.body.selector
            const options = req.body.options || {}
            const results = await (await db).getMany({ selector, ...options })
            res.json(results)
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
}

export const controller = new DbController()