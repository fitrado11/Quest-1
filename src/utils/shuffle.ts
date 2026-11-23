/**
 * Fisher-Yates array shuffling utility.
 * Returns a new shuffled copy of the array so students cannot memorize option positions.
 */
export function shuffleArray<T>(array: readonly T[] | T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
