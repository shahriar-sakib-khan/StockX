import { Types } from "mongoose";

// Generic Ref Resolver: handles both ObjectId and populated objects
function resolveRef<T extends { _id: any }>(ref: Types.ObjectId | T, sanitizer: (doc: T) => any) {
  if (!ref) return '';

  // If it's a plain ObjectId, do NOT sanitize
  if (typeof ref === 'object' && '_id' in ref && Object.keys(ref).length > 1) {
    return sanitizer(ref as T); // likely populated
  }

  return String(ref); // just return the ID
}

export default resolveRef;