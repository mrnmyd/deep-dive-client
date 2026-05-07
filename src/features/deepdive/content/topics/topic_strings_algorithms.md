# Strings: KMP, Rabin-Karp, Z-Algorithm, Manacher

Strings are arrays with domain-specific matching concerns. Simple substring search is `O(nm)` in the worst case. Pattern algorithms exist to avoid rechecking characters.

KMP builds an LPS table, where `lps[i]` is the length of the longest proper prefix of the pattern ending at `i` that is also a suffix. During matching, when a mismatch happens, KMP does not move the text pointer backward; it shifts the pattern using LPS. The interview explanation should focus on **reusing previous comparisons**.

Rabin-Karp uses rolling hash. It is useful when searching many patterns or when comparing windows cheaply. Hash collisions are possible, so production-grade logic verifies actual string equality when hashes match.

The Z-algorithm builds `z[i]`, the length of the substring starting at `i` that matches the prefix. It is useful for pattern search, prefix matching, and string periodicity. The mental model is maintaining a rightmost known matching box `[L, R]`.

Manacher's algorithm finds palindromic radii in linear time by mirroring around centers. It is harder to derive live, so know the concept: previously computed palindrome spans let you skip symmetric work.

- For most interviews, clearly explaining KMP or rolling hash is enough.
- Normalize assumptions: ASCII vs Unicode, case sensitivity, whitespace handling.
- For palindromes, decide early whether you need odd/even centers or transformed strings.
