import { NextFunction, Response } from "express";
import { Node } from "../class/node";
import { NodeIpInfo, RequestWithBody } from "../interface/interface";
const Logger = require("../class/logger");

const joined = (req: RequestWithBody, res: Response, next: NextFunction) => {
  try {
    const publicKey: string = req.body.publicKey;
    const nodeId: string = req.body.nodeId;
    const nodeIpInfo: NodeIpInfo = req.body.nodeIpInfo;
    let Node: Node = global.node;
    Node.joined(publicKey, nodeId, nodeIpInfo);
    let resp = {
      received: true,
    };
    res.status(200).send(resp);
  } catch (e) {
    Logger.mainLogger.error(e)
  }
};

module.exports = joined;
