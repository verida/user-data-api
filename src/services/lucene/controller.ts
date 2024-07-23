import { Request, Response } from "express";
import Common from "../common";
import { filter, QueryParser } from 'lucene-kit';

const dsCache: Record<string, any> = {}

/**
 * 
 */
export class DsController {
    
    public async searchDb(req: Request, res: Response) {
        try {
            const { context } = await Common.getNetworkFromRequest(req)
            const permissions = Common.buildPermissions(req)
            //const schemaName = Common.getSchemaFromParams(req.params[0])
            const dbName = req.params[0]
            const query = req.query.q.toString()
            console.log(`Searching for ${query}`)

            console.time('Opening database')
            const database = await context.openDatabase(dbName, {
                // @ts-ignore
                permissions
            })

            const db = await database.getDb()
            const result = await db.allDocs({
                include_docs: true,
                attachments: true
            });
            const data = result.rows.map((item: any) => item.doc)
            console.timeEnd('Opening database')

            console.time('Searching Lucene')
            const $q = (q: string) => new QueryParser(q);
            const luceneResult = filter($q(query), data);
            console.timeEnd('Searching Lucene')

            return res.json({
                results: luceneResult
            })
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    public async searchDs(req: Request, res: Response) {
        try {
            const schemaName = Common.getSchemaFromParams(req.params[0])
            const query = req.query.q.toString()
            console.log(`Searching for ${query} in ${schemaName}`)

            let data: any = {}
            if (dsCache[query]) {
                console.log('Loaded data from cache')
                data = dsCache[query]
            } else {
                const { context } = await Common.getNetworkFromRequest(req)
                const permissions = Common.buildPermissions(req)
                

                console.time('Opening datastore')
                const datastore = await context.openDatastore(schemaName, {
                    // @ts-ignore
                    permissions
                })

                const database = await datastore.getDb()
                const db = await database.getDb()
                const result = await db.allDocs({
                    include_docs: true,
                    attachments: true
                });
                data = result.rows.map((item: any) => item.doc)
                console.timeEnd('Opening datastore')

                dsCache[query] = data
            }

            console.time(`Searching Lucene ${data.length} items`)
            const $q = (q: string) => new QueryParser(q);
            const luceneResult = filter($q(query), data);
            console.timeEnd(`Searching Lucene ${data.length} items`)

            return res.json({
                results: luceneResult,
                count: luceneResult.length
            })
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
}

export const controller = new DsController()