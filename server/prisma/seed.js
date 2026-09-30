import { seedDatabase } from '../src/seed/seedData.js';

async function main() {
  await seedDatabase(true);
  console.log('Seed executed successfully!');
}

main().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
