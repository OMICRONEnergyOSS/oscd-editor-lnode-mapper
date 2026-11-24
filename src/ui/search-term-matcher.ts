const regexSpecials = /[.+^${}()|[\]\\]/g;

/**
 * Compiles a search term into a predicate over text.
 *
 * Whitespace separates terms and every term must match (case-insensitive
 * substring). `*` matches any run of characters, `?` matches one character, and
 * double or single quotes group words into one term.
 *
 * Returns `undefined` for a blank term, meaning "everything matches".
 */
export function searchTermMatcher(searchTerm: string): ((text: string) => boolean) | undefined {
  const words = searchTerm.match(/(?:"[^"]*"|'[^']*'|\S)+/g) ?? [];
  const patterns = words
    .map(word => word.replace(/["']/g, ''))
    .filter(word => word.length > 0)
    .map(
      word => new RegExp(
        word.replace(regexSpecials, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.'),
        'is',
      ),
    );
  if (patterns.length === 0) {
    return undefined;
  }
  return text => patterns.every(pattern => pattern.test(text));
}
