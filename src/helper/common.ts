export function isValidObjectId(str: string) {
  // Define the ObjectID pattern
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  // Test the provided string against the pattern
  return objectIdPattern.test(str);
}
