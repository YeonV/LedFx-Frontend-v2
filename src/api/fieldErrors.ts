export interface ValidationError {
  type?: string
  loc?: (string | number)[]
  msg: string
  input?: unknown
}

export type FieldErrors = Record<string, string>

/**
 * Map a `validation_error` response ({status: 'failed', errors: [...]}) to
 * {field id: message}. A leading `config` segment of `loc` is skipped; an error
 * with no field (empty `loc`) is left to the snackbar. Anything else maps to {}.
 */
export const fieldErrors = (resp: unknown): FieldErrors => {
  const out: FieldErrors = {}
  const errors = (resp as { errors?: ValidationError[] } | null | undefined)?.errors
  if (!Array.isArray(errors)) return out
  for (const e of errors) {
    const loc = Array.isArray(e?.loc) ? e.loc : []
    const msg = e?.msg
    const id = loc[0] === 'config' ? loc[1] : loc[0]
    if (id === undefined || msg === undefined) continue
    out[id] = out[id] ? `${out[id]}; ${msg}` : msg
  }
  return out
}

/** Drop the errors of the fields in `changed` (a partial model the user just edited). */
export const clearFieldErrors = (errors: FieldErrors, changed: object): FieldErrors =>
  Object.fromEntries(Object.entries(errors).filter(([id]) => !(id in changed)))
