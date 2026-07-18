import dotenv from 'dotenv';
dotenv.config();
import db from '../models';
import { up as upSheets } from '../migrations/20260719010000-create-writing-sheets';
import { up as upItems } from '../migrations/20260719011000-create-writing-sheet-items';

async function run() {
  const queryInterface = db.sequelize.getQueryInterface();
  try {
    console.log("Running migration 20260719010000-create-writing-sheets...");
    await upSheets(queryInterface);
    console.log("WritingSheets table created successfully!");
  } catch (err: any) {
    if (err.message && err.message.includes('already exists')) {
      console.log("WritingSheets table already exists.");
    } else {
      console.error("WritingSheets migration error:", err);
    }
  }

  try {
    console.log("Running migration 20260719011000-create-writing-sheet-items...");
    await upItems(queryInterface);
    console.log("WritingSheetItems table created successfully!");
  } catch (err: any) {
    if (err.message && err.message.includes('already exists')) {
      console.log("WritingSheetItems table already exists.");
    } else {
      console.error("WritingSheetItems migration error:", err);
    }
  }

  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
