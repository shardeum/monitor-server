import { NextFunction, Response } from 'express'
import { RequestWithBody } from '../interface/interface'
import { getFromArchiver } from '@shardeum-foundation/lib-archiver-discovery'

let foundationNodesCache: { nodes: unknown[]; timestamp: number } | null = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

async function getListOfFoundationNodes(): Promise<unknown[]> {
  // Check if we have cached data that's still valid
  if (foundationNodesCache && Date.now() - foundationNodesCache.timestamp < CACHE_DURATION) {
    console.log('Returning cached foundation nodes')
    return foundationNodesCache.nodes
  }

  try {
    const result = await getFromArchiver('full-nodelist?activeOnly=true')
    if (result && result.nodeList) {
      const foundationNodes = result.nodeList.filter((node: any) => node.foundationNode === true)
      
      // Cache the results
      foundationNodesCache = {
        nodes: foundationNodes,
        timestamp: Date.now()
      }
      
      console.log(`Found ${foundationNodes.length} foundation nodes from archiver`)
      return foundationNodes
    }
  } catch (error) {
    console.error('Error fetching foundation nodes from archiver:', error)
  }

  // Return cached data if available, even if stale, as fallback
  if (foundationNodesCache) {
    console.log('Returning stale cached foundation nodes due to error')
    return foundationNodesCache.nodes
  }

  return []
}

export const listFoundationNodes = (_req: RequestWithBody, res: Response, _next: NextFunction) => {
  getListOfFoundationNodes()
    .then((nodes) => {
      res.status(200).send(nodes)
    })
    .catch((error) => {
      console.error(error)
      res.status(500).send('Internal Server Error')
    })
}
