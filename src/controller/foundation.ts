import { NextFunction, Response } from "express";
import { RequestWithBody } from "../interface/interface";
import axios from "axios";

async function getListOfFoundationNodes(): Promise<unknown[]>   {
    /*
    20250121.S.I. - It may make sense to cache this list in the future to reduce unnecessary network requests. It is unknown
    how ofter the lists are update, so for now we'll make the request to the GCP bucket to retrieve the data every time this function
    is invoked.
     */
    const getFoundationNodes = async (url: string): Promise<{data: {nodes: any[]}}> => {
        let res = {
            data: {
                nodes: []
            }
        }
        try {
            const a = new Date().getTime()
            res = await axios.get(url, {
                timeout: 10000
            })
            console.log(`duration: ${new Date().getTime()-a}, url: ${url}`)
        } catch (error) {
            console.error(error)
        }
        return res
    }

    let nodes = []
    try {
        const results = await Promise.all([
            getFoundationNodes('https://storage.googleapis.com/shardeum-info-and-counts/network/itn4/nodeInfo.json'),
            getFoundationNodes('https://storage.googleapis.com/shardeum-info-and-counts/network/bb/nodeInfo.json')
        ])
        for(let i = 0; i < results.length; i++) {
            nodes.push(...results[i].data.nodes)
        }
    } catch (error){
        console.error(error)
    }

    return nodes
}

export const listFoundationNodes = (req: RequestWithBody, res: Response, next: NextFunction) => {
    let nodes = []
    getListOfFoundationNodes().then(nodes => {
        res.status(200).send(nodes);
    }).catch(error => {
        console.error(error)
        res.status(500).send("Internal Server Error");
    })
};