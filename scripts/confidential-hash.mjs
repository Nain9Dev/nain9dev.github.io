// Prints the hash of each term given as an argument, for scripts/confidential-hashes.json.
// Nothing is stored or logged: run it, paste the hash into the list, keep the term out of the repository.
//   node scripts/confidential-hash.mjs "a term" "another-term-#"
import { hashTerm } from './lib/confidential.mjs';

const terms = process.argv.slice(2);
if (terms.length === 0) {
  console.error('usage: node scripts/confidential-hash.mjs "<term>" ...');
  process.exit(2);
}
for (const term of terms) console.log(hashTerm(term));
