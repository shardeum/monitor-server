// const fs = require('fs')
// const path = require('path')
// const writeStream = fs.createWriteStream(path.join('.', 'node-reports.json'))

class Node {
  constructor () {
    this.totalTxInjected = 0
    this.totalTxRejected = 0
    this.totalTxExpired = 0
    this.totalProcessed = 0
    this.avgTps = 0
    this.maxTps = 0
    this.lastTotalProcessed = 0
    this.reportInterval = 1000
    this.nodes = this._createEmptyNodelist()
    this.isTimerStarted = false
  }

  _createEmptyNodelist () {
    return {
      joining: {},
      syncing: {},
      active: {}
    }
  }

  joining (publicKey, nodeIpInfo) {
    this.nodes.joining[publicKey] = { nodeIpInfo }
  }

  joined (publicKey, nodeId, nodeIpInfo) {
    delete this.nodes.joining[publicKey]
    this.nodes.syncing[nodeId] = { publicKey, nodeIpInfo }
  }

  active (nodeId) {
    delete this.nodes.syncing[nodeId]
    this.nodes.active[nodeId] = {}
  }

  removed (nodeId) {
    delete this.nodes.active[nodeId]
  }

  heartbeat (nodeId, data) {
    this.nodes.active[nodeId] = data
    this.nodes.active[nodeId].timestamp = Date.now()
    if (this.reportInterval !== data.reportInterval) {
      this.reportInterval = data.reportInterval
    }
    this.totalTxInjected += data.txInjected
    this.totalTxRejected += data.txRejected
    this.totalTxExpired += data.txExpired
    this.totalProcessed += data.txProcessed

    if (!this.isTimerStarted) {
      setTimeout(() => { this.updateAvgAndMaxTps()}, this.reportInterval)
      this.isTimerStarted = true
    }
    // this.avgApplied += (data.txInjected - data.txRejected - data.txExpired)
    // writeStream.write(JSON.stringify(this.nodes.active[nodeId], null, 2) + '\n')
  }

  updateAvgAndMaxTps() {
    if (Object.keys(this.nodes.active).length === 0) return
    let newAvgTps = Math.round((this.totalProcessed - this.lastTotalProcessed) / (this.reportInterval / 1000))
    let percentDiff = 0
    if (this.avgTps > 0) percentDiff = (newAvgTps - this.avgTps) / this.avgTps

    // console.log('this.totalProcessed', this.totalProcessed)
    // console.log('this.lastTotalProcessed', this.lastTotalProcessed)
    // console.log('newAvgTps', newAvgTps)
    // console.log('percentDiff', percentDiff)

    // if (!Number.isNaN(percentDiff) && percentDiff < 0.5) {
    if (true) {
      this.avgTps = newAvgTps
      if (newAvgTps > this.maxTps) this.maxTps = newAvgTps

      // console.log('this.avgTps', this.avgTps)
      // console.log('this.maxTps', this.maxTps)

    } else {
      console.log('percent diff is NaN or larger than 50%', percentDiff)
    }
    this.lastTotalProcessed = this.totalProcessed
    setTimeout(() => { this.updateAvgAndMaxTps() }, this.reportInterval)
  }

  report () {
    return {
      nodes: this.nodes,
      totalInjected: this.totalTxInjected,
      totalRejected: this.totalTxRejected,
      totalExpired: this.totalTxExpired,
      totalProcessed: this.totalProcessed,
      avgTps: this.avgTps,
      maxTps: this.maxTps,
      timestamp: Date.now()
    }
  }

  flush () {
    console.log('Flushing report')
    this.nodes = this._createEmptyNodelist()
    this.totalTxInjected = 0
    this.totalTxRejected = 0
    this.totalTxExpired = 0
    this.totalProcessed = 0
    this.avgTps = 0
    this.maxTps = 0
    this.lastTotalProcessed = 0
  }
}

module.exports = Node
