/**
 * @author Aditya Gupta
 * @year 2022
 * @description Leetcode Profile Watcher, data can be used to graph your progress later
 * @version 1.0
 * @license Unlicense
 * */

import fetch from 'node-fetch';
import fs from "fs";

// NOTE: The `node-fetch` module won't be required in node >= v18

// Add your Leetcode username in ../data/watchlist.json
const usernames = JSON.parse(fs.readFileSync("../data/watchlist.json"));

if( !usernames ) {
    console.error("No user to monitor");
    process.exit(1);
}

let allQuestionsCount = null;
let profiles = [];

let profiles_fetched = 0;

await new Promise((res, _) => {
    usernames.forEach(uname => {
        // Got these from seeing requests in Networks tab
        const url = "https://leetcode.com/graphql";
        const body = {
            query: "\n    query userProblemsSolved($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n  }\n  matchedUser(username: $username) {\n    problemsSolvedBeatsStats {\n      difficulty\n      percentage\n    }\n    submitStatsGlobal {\n      acSubmissionNum {\n        difficulty\n        count\n      }\n    }\n  }\n}\n    ",
            variables: {
                username: uname,
            }
        };

        // POST to url with body
        fetch(url, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
                "Accept": "*/*",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "en-US,en;q=0.5",
                "Connection": "keep-alive",
            }
        })
            .then(res => res.json())
            .then(data => data.data)
            .then(data => {
                if(!data.matchedUser) {
                    console.error("Couldn't find user: " + uname);
                    // Exit if this was the last profile to look for
                    profiles_fetched = profiles_fetched + 1;
                    if (profiles_fetched === usernames.length) {
                        res();
                    }
                    return;
                }

                /**
                 * @type {Object} data
                 * @property {Array} allQuestionsCount [{
                 *	@key {String} difficulty
                 *	@value {Number} count
                 * }]
                 * @property {Object} matchedUser {
                 *	@key {String} problemsSolvedBeatsStats
                 *	@value {Array}  [{
                 *		@key {String} difficulty
                 *		@value {Number} percentage
                 *  }],
                 *  @key {String} submitStatsGlobal
                 *  @value {Object} {
                 *  	@key {String} acSubmissionNum
                 *  	@value {Array} [{
                 *  		@key {String} difficulty
                 *  		@value {Number} count
                 *  	}]
                 *  }
                 * }
                 * */
		let modifiedProblemsSolvedBeatsStats = {};
		data.matchedUser.problemsSolvedBeatsStats.forEach((entry) => {
		    modifiedProblemsSolvedBeatsStats[entry.difficulty] = entry.percentage;
		});
		let modifiedSubmitStatsGlobal = {};
		data.matchedUser.submitStatsGlobal.acSubmissionNum.forEach((entry) => {
		    modifiedSubmitStatsGlobal[entry.difficulty] = entry.count;
		});
                profiles.push({
                    username: uname,
                    submitCounts: modifiedSubmitStatsGlobal,
                    beatsPercentage: modifiedProblemsSolvedBeatsStats,
                });
                if (allQuestionsCount === null) {
                    allQuestionsCount = data.allQuestionsCount;
                }

                profiles_fetched = profiles_fetched + 1;
                if (profiles_fetched === usernames.length) {
                    // Fetching all usernames done
                    res();
                }
            })
            .catch(err => {
                console.log(err);
            });
    });
});

// sort profiles based on username
profiles.sort((a, b) => {
    return a.username.localeCompare(b.username);
});

const record = {
    date: new Date,
    allQuestionsCount: allQuestionsCount,
    profiles
};

// Read records.json
let records = [];
try {
    records = JSON.parse(fs.readFileSync("../data/records.json"));
} catch (e) {
    console.log("No ../data/records.json found/Failed to parse");
}

records.push(record);

// Write records back to records.json
fs.writeFileSync("../data/records.json", JSON.stringify(records, null, 4));

console.log(record);

// ex: shiftwidth=4 expandtab:
