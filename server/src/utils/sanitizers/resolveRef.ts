import { Types } from 'mongoose';

/**
 * Generic Ref Resolver
 * Handles both ObjectId and populated objects.
 * Returns sanitized object if populated, or string ID if plain ObjectId.
 */
function resolveRef<T extends { _id: any }>(
  ref: Types.ObjectId | T | null | undefined,
  sanitizer: (doc: T) => any
) {
  // If it's completely missing or null -> ignore it
  if (ref === null || ref === undefined) return undefined;

  // If it's a populated object (has _id and other fields)
  if (typeof ref === 'object' && '_id' in ref && Object.keys(ref).length > 1) {
    return sanitizer(ref as T);
  }

  // If it's just a raw ObjectId
  return String(ref);
}

export default resolveRef;
