// Read records.json
import fs from 'fs';
const records = JSON.parse(fs.readFileSync('records.json'));

// TO_COMPARE = "username1,username2"
const to_compare = process.env.TO_COMPARE.split(",");

const day_shown = [];

for(let record of records) {
    const date = new Date(record.date);
    const date_str = date.toLocaleDateString();
    
    // Skip if already shown
    if(day_shown.includes(date_str)) {
        continue;
    }

    day_shown.push(date_str);

    const user1 = record.profiles.find(profile => profile.username === to_compare[0]);
    const user1_scores = user1.submitCounts;
    const user2 = record.profiles.find(profile => profile.username === to_compare[1]);
    const user2_scores = user2.submitCounts;

    // Print stylized date
    console.log(`${date_str}`);

    // Print comparison among user1 and user2
    console.log(`${to_compare[0]} / ${to_compare[1]}`);
    console.log(`${user1_scores.All} / ${user2_scores.All}`);
    console.log(`${user1_scores.Easy} / ${user2_scores.Easy}`);
    console.log(`${user1_scores.Medium} / ${user2_scores.Medium}`);
    console.log(`${user1_scores.Hard} / ${user2_scores.Hard}`);
    
    // Print 2 empty lines
    console.log("\n==========================================================\n");
}

// ex: shiftwidth=4 expandtab:
