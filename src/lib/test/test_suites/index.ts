import broadcastExtension from './broadcast-extension'
import presenceExtension from './presence-extension'
import authorizationCheck from './authorization-check'
import broadcastChanges from './broadcast-changes'
import postgresChangesExtension from './postgres-changes-extension'
import { TestSuite } from '..'
import connection from './connection'
import loadPostgresChanges from './load-postgres-changes'
import loadBroadcastFromDb from './load-broadcast-from-db'
import loadBroadcast from './load-broadcast'
import loadBroadcastReplay from './load-broadcast-replay'
import broadcastReplay from './broadcast-replay'
import loadPresence from './load-presence'

export const testCases: TestSuite = {
  ...connection,
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
