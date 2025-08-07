import { NextFunction, Response } from 'express'
import { Node } from '../class/node'
import { RequestWithBody } from '../interface/interface'

const getProblematicNodes = (req: RequestWithBody, res: Response, next: NextFunction) => {
  let Node: Node = global.node
  let data = Node.getProblematicNodes()
  res.status(200).send(data)
}

module.exports = getProblematicNodes
