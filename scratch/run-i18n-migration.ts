import dotenv from 'dotenv';
dotenv.config();
import db from '../models';
import { up as upVocab } from '../migrations/20260923000000-add-indonesian-meaning-to-vocabularies';
import { up as upExample } from '../migrations/20260923000001-add-english-and-indonesian-to-examples';

async function run() {
  const queryInterface = db.sequelize.getQueryInterface();

  try {
    console.log("Running migration 20260923000000-add-indonesian-meaning-to-vocabularies...");
    await upVocab(queryInterface);
    console.log("Vocabularies migration executed successfully!");
  } catch (err: any) {
    if (err.message && (err.message.includes('Duplicate column name') || err.message.includes('already exists'))) {
      console.log("Column indonesianMeaning already exists on Vocabularies.");
    } else {
      console.error("Vocabularies migration error:", err);
    }
  }

  try {
    console.log("Running migration 20260923000001-add-english-and-indonesian-to-examples...");
    await upExample(queryInterface);
    console.log("Examples migration executed successfully!");
  } catch (err: any) {
    if (err.message && (err.message.includes('Duplicate column name') || err.message.includes('already exists'))) {
      console.log("Columns already exist on Examples.");
    } else {
      console.error("Examples migration error:", err);
    }
  }

  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
