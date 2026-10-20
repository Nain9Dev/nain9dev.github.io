// Safe authoring of src/data/testimonials.json and the review intake client.
//   npm run testimonial -- invite "<label>" --relationship client|partner [--days 14]   create a single-use link
//   npm run testimonial -- pull [--keep]        bring submissions in as local "pending" entries (deleted from the service unless --keep)
//   npm run testimonial -- add <entry.json>     validate and store an entry written by hand as "pending"
//   npm run testimonial -- approve <id>         publish a pending entry on the next release
//   npm run testimonial -- reject <id>          drop a pending entry that will not be published
//   npm run testimonial -- list                 show every entry and its status
// The repository is public: approve or reject every pending entry before committing (a test enforces it).
// invite and pull need REVIEWS_ENDPOINT and REVIEWS_ADMIN_TOKEN in the environment. Add --data <path> to use another file.
import { readFile, writeFile } from 'node:fs/promises';
import { addEntry, approveEntry, removeEntry, serialize } from './lib/testimonials.mjs';
import { createInvitation, deleteSubmission, entryFromSubmission, pullSubmissions } from './lib/reviews-client.mjs';

const args = process.argv.slice(2);
const take = (flag) => {
  const index = args.indexOf(flag);
  return index >= 0 ? args.splice(index, 2)[1] : undefined;
};
const has = (flag) => {
  const index = args.indexOf(flag);
  if (index >= 0) args.splice(index, 1);
  return index >= 0;
};
const dataPath = take('--data') ?? 'src/data/testimonials.json';
const relationship = take('--relationship');
const days = take('--days');
const keep = has('--keep');
const [command, argument] = args;

const readList = async () => JSON.parse(await readFile(dataPath, 'utf8'));
const writeList = (list) => writeFile(dataPath, Buffer.from(serialize(list)));
const connection = () => {
  const { REVIEWS_ENDPOINT: endpoint, REVIEWS_ADMIN_TOKEN: adminToken } = process.env;
  if (!endpoint || !adminToken) throw new Error('Set REVIEWS_ENDPOINT and REVIEWS_ADMIN_TOKEN in your shell first (see docs/06-runbook/review-intake.md).');
  return { endpoint: endpoint.replace(/\/$/, ''), adminToken };
};

try {
  if (command === 'invite' && argument) {
    const invitation = await createInvitation({ ...connection(), label: argument, relationship, ttlDays: days ? Number(days) : 14 });
    console.log(`Invitation for "${argument}" (${relationship}), valid until ${invitation.expiresAt}. Send this link once; it works one time only:`);
    console.log(invitation.link);
  } else if (command === 'pull') {
    const options = connection();
    const submissions = await pullSubmissions(options);
    let list = await readList();
    for (const submission of submissions) {
      const entry = entryFromSubmission(submission, list);
      list = addEntry(list, entry);
      await writeList(list);
      if (!keep) await deleteSubmission({ ...options, id: submission.id });
      console.log(`Pulled "${entry.id}" from ${submission.name} (${submission.relationship}) as pending.`);
    }
    if (submissions.length === 0) console.log('No pending submissions.');
    else console.log('Review the text, then `approve <id>` or `reject <id>`. Do not commit pending entries.');
  } else if (command === 'add' && argument) {
    const entry = JSON.parse(await readFile(argument, 'utf8'));
    await writeList(addEntry(await readList(), entry));
    console.log(`Added "${entry.id}" as pending. It is not published yet.`);
    console.log('Next: review it, then `approve <id>`, `npm run translations:prepare`, translate, `npm run check`.');
  } else if (command === 'approve' && argument) {
    await writeList(approveEntry(await readList(), argument));
    console.log(`"${argument}" is approved. It goes live with the next release; its English text must be reviewed first.`);
  } else if (command === 'reject' && argument) {
    await writeList(removeEntry(await readList(), argument));
    console.log(`"${argument}" was removed. Nothing was published.`);
  } else if (command === 'list') {
    for (const entry of await readList()) console.log(`${entry.id.padEnd(36)}${entry.status.padEnd(10)}${entry.relationship.padEnd(9)}${entry.name}`);
  } else {
    console.error('Usage: testimonial.mjs invite "<label>" --relationship client|partner | pull [--keep] | add <entry.json> | approve <id> | reject <id> | list  [--data <path>]');
    process.exitCode = 2;
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
