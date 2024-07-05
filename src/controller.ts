import { AutoAccount } from '@verida/account-node';
import { Client } from '@verida/client-ts';
import { AccountNodeDIDClientConfig, EnvironmentType, IContext } from '@verida/types';
import { Request, Response } from 'express'

const DID_CLIENT_CONFIG: AccountNodeDIDClientConfig = {
    callType: 'web3',
    web3Config: {
        privateKey: 'abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef0d3babcdef'
    }

}

/**
 * 
 */
export default class Controller {

    /**
     * Initiate an auth connection for a given provider.
     * 
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    public static async save(req: Request, res: Response, next: any) {
        const query = req.query
        const seedPhrase = query.seed.toString()

        const { context } = await Controller.getNetwork(seedPhrase)

        const db = await context.openDatabase('test_db')
        const result = await db.save({
            randomValue: Math.floor(Math.random() * 1000)
        })

        await context.close()

        return res.status(200).send({
            status: "success",
            result
        });
    }

    public static async read(req: Request, res: Response, next: any) {
        const query = req.query
        const seedPhrase = query.seed.toString()

        const { context } = await Controller.getNetwork(seedPhrase)

        const db = await context.openDatabase('test_db')
        const results = await db.getMany()

        await context.close()

        return res.status(200).send({
            status: "success",
            results
        });
    }

    private static async getNetwork(signature: string): Promise<{
        client: Client,
        context: IContext,
        account: AutoAccount
    }> {
        const VAULT_CONTEXT_NAME = 'Verida: Vault'
        const VERIDA_ENVIRONMENT = EnvironmentType.MAINNET
        const client = new Client({
            environment: VERIDA_ENVIRONMENT
        })

        // @todo: Switch to context account once context storage node issue fixed and deployed
        //const account = new ContextAccount({
        const account = new AutoAccount({
            privateKey: signature,
            environment: VERIDA_ENVIRONMENT,
            // @ts-ignore
            didClientConfig: DID_CLIENT_CONFIG
        })
        const did = await account.did()
        console.log(did)
        await client.connect(account)
        const context = await client.openContext(VAULT_CONTEXT_NAME)

        return {
            client,
            context,
            account
        }
    }

}