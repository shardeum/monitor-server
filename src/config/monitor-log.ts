export default {
  "saveConsoleOutput": true,
  "dir": "monitor-logs",
  "files": { "main": "", "history": "", "errorFile": "", "ignored": "" },
  "options": {
    "appenders": {
      "out": { "type": "console" },
      "main": {
        "type": "file",
        "maxLogSize": 10000000,
        "backups": 10
      },
      "history": {
        "type": "file",
        "maxLogSize": 10000000,
        "backups": 10
      },
      "errorFile": {
        "type": "file",
        "maxLogSize": 10000000,
        "backups": 10
      },
      "ignored": {
        "type": "file",
        "maxLogSize": 10000000,
        "backups": 10
      },
      "errors": {
        "type": "logLevelFilter",
        "level": "ERROR",
        "appender": "errorFile"
      }
    },
    "categories": {
      "default": { "appenders": ["out"], "level": "trace" },
      "main": { "appenders": ["main", "errors"], "level": "trace" },
      "history": { "appenders": ["history"], "level": "trace" },
      "ignored": { "appenders": ["ignored"], "level": "trace" }
    }
  }
}
