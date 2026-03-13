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

export const testCases: TestSuite = {
  ...connection,
  ...loadPostgresChanges,
  ...loadBroadcastFromDb,
  ...loadBroadcast,
  ...loadBroadcastReplay,
  ...broadcastExtension,
  ...presenceExtension,
  ...authorizationCheck,
  ...broadcastChanges,
  ...postgresChangesExtension,
}
