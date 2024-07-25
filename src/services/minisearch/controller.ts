import MiniSearch from 'minisearch'
import { Request, Response } from "express";
import Common from "../common";
import * as CryptoJS from 'crypto-js';

const indexCache: Record<string, any> = {}
const MAX_RESULTS = 20

/**
 * 
 */
export class DsController {

    public async searchDs(req: Request, res: Response) {
        try {
            const schemaName = Common.getSchemaFromParams(req.params[0])
            const query = req.query.q.toString()
            const indexFields = req.query.fields ? req.query.fields.toString().split(',') : []
            const storeFields = req.query.store ? req.query.store.toString().split(',') : []
            console.log(`Searching for ${query} in ${schemaName} with index ${indexFields}`)

            const cacheKey = CryptoJS.MD5(`${schemaName}:${indexFields.join(',')}:${storeFields.join(',')}`).toString();

            let docs: any = {}
            if (indexCache[cacheKey]) {
                console.log('Loaded data from cache')
                docs = indexCache[cacheKey]
            } else {
                const { context } = await Common.getNetworkFromRequest(req)
                const permissions = Common.buildPermissions(req)
                

                // console.time('Opening datastore')
                const datastore = await context.openDatastore(schemaName, {
                    // @ts-ignore
                    permissions
                })

                const database = await datastore.getDb()
                const db = await database.getDb()
                const result = await db.allDocs({
                    include_docs: true,
                    attachments: false,
                    limit: 10
                });
                
                docs = result.rows.map((item: any) => {
                    // @todo: handle array fields
                    
                    return item
                })

                const miniSearch = new MiniSearch({
                    fields: indexFields, // fields to index for full-text search
                    storeFields: storeFields.length ? storeFields : Object.keys(docs[0]) // fields to return with search results, @todo: use schema
                })

                // Index all documents
                miniSearch.addAll(docs)

                indexCache[cacheKey] = miniSearch
            }

            const results = indexCache[cacheKey].search(query)

            return res.json({
                results: results.slice(0, MAX_RESULTS),
                count: results.length
            })
        } catch (error) {
            console.log(error)
            res.status(500).send(error.message);
        }
    }
}

export const controller = new DsController()