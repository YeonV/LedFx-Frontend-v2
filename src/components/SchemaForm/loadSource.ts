type Loader = () => unknown

const inflight = new Map<string, Promise<void>>()

/**
 * Load an instance source (see instanceOptions) with its getter, then mark it loaded, also when
 * the getter resolves to nothing (a 404) or throws: the list is then as complete as it gets.
 * One request in flight per source, so fields mounting together share it. An unknown source
 * does nothing.
 */
export const loadSource = (
  source: string,
  loaders: Record<string, Loader | undefined>,
  markLoaded: (source: string) => void
): Promise<void> => {
  const load = loaders[source]
  if (!load) return Promise.resolve()
  const pending = inflight.get(source)
  if (pending) return pending
  const p = (async () => {
    try {
      await load()
    } catch {
      // still loaded: see above
    } finally {
      inflight.delete(source)
      markLoaded(source)
    }
  })()
  inflight.set(source, p)
  return p
}
