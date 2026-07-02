import type { TestSuite } from '../types'
import authorizationCheck from './authorization-check'
import broadcastChanges from './broadcast-changes'
import broadcastExtension from './broadcast-extension'
import broadcastReplay from './broadcast-replay'
import connection from './connection'
import defaultSettings from './default-settings'
import loadBroadcast from './load-broadcast'
import loadBroadcastFromDb from './load-broadcast-from-db'
import loadBroadcastReplay from './load-broadcast-replay'
import loadPostgresChanges from './load-postgres-changes'
import loadPresence from './load-presence'
import postgresChangesExtension from './postgres-changes-extension'
import presenceExtension from './presence-extension'

export const testCases: TestSuite = {
  ...connection,
  ...defaultSettings,
  ...loadPostgresChanges,
  ...loadBroadcastFromDb,
  ...loadBroadcast,
  ...loadBroadcastReplay,
  ...loadPresence,
  ...broadcastExtension,
  ...presenceExtension,
  ...authorizationCheck,
  ...broadcastChanges,
  ...postgresChangesExtension,
  ...broadcastReplay,
}
