/**
 * Compiles a search term into a predicate over text.
 *
 * Whitespace separates terms and every term must match (case-insensitive
 * substring). `*` matches any run of characters, `?` matches one character, and
 * double or single quotes group words into one term.
 *
 * Returns `undefined` for a blank term, meaning "everything matches".
 */
export declare function searchTermMatcher(searchTerm: string): ((text: string) => boolean) | undefined;
