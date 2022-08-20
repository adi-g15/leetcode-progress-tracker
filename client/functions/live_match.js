const fetch = require("node-fetch");
const HTMLParser = require("fast-html-parser");

// BUG - Read line 17; Scores are not returned
exports.handler = async (event, context) => {
    try {
        const html = await fetch("https://www.iplt20.com/matches/schedule/men")
            .then(res => res.text())
            .catch(err => { throw err; })

        const document = HTMLParser.parse(html);

        const live_matches = document.querySelectorAll(".match-item--live");

        const data = live_matches.map(match => {
            // console.log(match.rawText.trim())
            const score_box = match.querySelector(".match-item__scorebox");
            // BUG - Somehow, .text doesn't have anything in this case
            // console.log(match.querySelector(".match-item__score--a").rawText.trim())
            // console.log(match.querySelector(".match-item__score--b").rawText.trim())

            return {
                team1: match.querySelector(".match-item__team--a").text.trim(),
                team2: match.querySelector(".match-item__team--b").text.trim(),
                scores: [
                    score_box.querySelector(".match-item__score--a").text.trim(),
                    score_box.querySelector(".match-item__score--b").text.trim()
                ],
                timestamp: match.attributes['data-timestamp']   // gmt time
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (err) {
        console.error(err);

        return {statusCode: 500};
    }
}
