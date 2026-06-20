import { db } from './src/lib/db';

async function test() {
  try {
    const campaigns = await db.getCampaigns();
    console.log("SUCCESS!", campaigns.length, "campaigns found.");
    console.log(JSON.stringify(campaigns, null, 2));
  } catch (err) {
    console.error("FAILED!", err);
  }
}

test();
