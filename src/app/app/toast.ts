/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from 'fs'
import path from 'path'
import { Notification } from 'electron'
import { fileURLToPath } from 'node:url'
import isDev from 'electron-is-dev'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const NOTIFICATION_TITLE = 'LedFx Client - by Blade'
const NOTIFICATION_BODY = 'Testing Notification from the Main process'

function getConfig() {
  const configPath = path.join(
    path.dirname(__dirname),
    isDev ? '../' : '../../',
    'frontend_config.json'
  )
  const configData = fs.readFileSync(configPath)
  return JSON.parse(configData.toString())
}

export function showNotification(title = NOTIFICATION_TITLE, body = NOTIFICATION_BODY) {
  const config = getConfig()
  const updateUrl = config.updateUrl

  new Notification({
    toastXml: `<toast>
       <visual>
         <binding template="ToastText02">
           <text id="1">LedFx Update available</text>
           <text id="2">Click the button to see more informations.</text>
         </binding>
       </visual>
       <actions>
         <action content="Goto Release" activationType="protocol" arguments="${updateUrl}" />
       </actions>
    </toast>`
  }).show()
}
