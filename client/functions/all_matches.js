const fetch = require("node-fetch");
const HTMLParser = require("fast-html-parser");

async function parse_matches_from_scrollbar() {
    const html = await fetch("https://www.iplt20.com/matches/schedule/men")
                    .then(res => res.text())
                    .catch(err => { throw err; })

    const document = HTMLParser.parse(html);

    const matches = [];
    const date_nodes = document.querySelectorAll(".match-scroller__date");
    const nodes = document.querySelectorAll(".match-scroller__item");
    nodes.forEach((outer_node, i) => {
        const node = outer_node.querySelector(".match-item__content");
        let venue = outer_node.querySelector(".match-item__venue")
        if(venue) {
            venue = venue.text.trim();
        }
        let res = outer_node.querySelector(".match-item__summary")
        if (res) {
            res = res.text.trim();

            res = res.replace("Chennai Super Kings", "CSK");
            res = res.replace("Royal Challengers Bangalore", "RCB");
            res = res.replace("Delhi Capitals", "DC");
            res = res.replace("Kolkata Knight Riders", "KKR");
            res = res.replace("Punjab Kings", "PBKS");
            res = res.replace("Mumbai Indians", "MI");
            res = res.replace("Rajasthan Royals", "RR");
            res = res.replace("Sunrisers Hyderabad", "SRH");
        }

        matches.push({
            '0': node.querySelector('.match-item__team--a .match-item__team-name').text.trim(),
            '1': node.querySelector('.match-item__team--b .match-item__team-name').text.trim(),
            res,
            venue,
            date: (date_nodes[i]) ? [
                date_nodes[i].querySelector('.match-scroller__day').text.trim(),
                date_nodes[i].querySelector('.match-scroller__month').text.trim()
            ].join(' '): null
        });
    });

    return matches;
}

const old_api = async (event, context) => {
    const html = await fetch("https://www.iplt20.com/matches/schedule/men")
                        .then(res => res.text())
                        .catch(err => { throw err; })

    const $ = cheerio.load(html);
    const fixture_div_styles = ".fixture"
    const abbrev_team_name_styles = ".fixture__team-name--abbrv"

    let nodes = $(fixture_div_styles).toArray()

    const matches = nodes.map((_,node) => {
        const teams = []
        let d = node.children(abbrev_team_name_styles)
        d.forEach(team_node => {
            teams.push(team_node.innerText);
        })
        return {
            '0': teams[0],
            '1': teams[1],
            'time': time
        };
    })

    return matches;
}

exports.parse_matches_from_scrollbar = parse_matches_from_scrollbar;
exports.handler = async (event, context) => {
    try{
        const matches = await parse_matches_from_scrollbar();

        return {
            statusCode: 200,
            body: JSON.stringify(matches)
        }
    } catch(err) {
        console.error(err);

        return {statusCode: 500};
    }
};
