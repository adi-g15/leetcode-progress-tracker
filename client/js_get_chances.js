const { max } = require("underscore");

let total_iterations = 0;
const team_names = ["CSK", "MI", "RCB", "SRH", "PBKS", "KKR", "DC", "RR"];

/**
 *
 * @param {[number]} arr
 */
function max_element(arr) {
    const current_maximum = max(arr);
    return {
        current_maximum,
        max_index: arr.indexOf(current_maximum)
    }
}

class IplScoreBoard {
    // total_possibilities: number;
    // total_qualifications: number[];
    // scores: number[];
    constructor() {
        this.total_possibilities = 0;
        this.total_qualifications = [0, 0, 0, 0, 0, 0, 0, 0];
        this.scores = [0, 0, 0, 0, 0, 0, 0, 0];
    }

    /**
     *
     * @param {number} team_index
     */
    team_winning(team_index) {
        this.scores[team_index] += 1;
    }

    /**
     *
     * @param {number} team_index
     */
    team_losing(team_index) {
        this.scores[team_index] -= 1;
    }
}

class IplLeagueMatch {
    // team1: string;
    // team2: string;
    // winner: string | null;
    /**
     *
     * @param {string} team1
     * @param {string} team2
     * @param {string | null} winner
     */
    constructor(team1, team2, winner) {
        this.team1 = team1;
        this.team2 = team2;
        this.winner = winner;
    }
}

/**
 *
 * @param {[IplLeagueMatch]} matches
 * @param {number} index
 * @param {IplScoreBoard} points_table
 * @param {[Set]} all_pos_bucket
 **/
function recurse(matches, index, points_table, all_pos_bucket) {
    total_iterations += 1;

    if (index % 10 === 0) {
        if (all_pos_bucket[index / 10].add(points_table.scores) == false) {
            return; // no need to recurse further; this path already tried
        }
    }

    if (index == matches.length) {
        // league matches complete (`after` the last match)
        points_table.total_possibilities += 1;

        let original_scores = [[0, 0], [0, 0], [0, 0], [0, 0]]; // original top 4 scores and indices

        // COME HERE
        let max1 = max_element(points_table.scores);
        original_scores[0] = [max1.current_maximum, max1.max_index];
        points_table.scores[max1.max_index] = 0;

        let max2 = max_element(points_table.scores);
        original_scores[1] = [max2.current_maximum, max2.max_index];
        points_table.scores[max2.max_index] = 0;

        let max3 = max_element(points_table.scores);
        original_scores[1] = [max3.current_maximum, max3.max_index];
        points_table.scores[max3.max_index] = 0;

        let max4 = max_element(points_table.scores);
        original_scores[1] = [max4.current_maximum, max4.max_index];
        points_table.scores[max4.max_index] = 0;

        // we got the 4th lowest score from top
        const lowest_qualifying_score = max4.current_maximum;

        // restore original values
        for (let org of original_scores) {
            points_table.scores[org[1]] = org[0];
        }

        // chose which teams qualified
        for (let i = 0; i < 8; ++i) {
            if (points_table.scores[i] >= lowest_qualifying_score) {
                points_table.total_qualifications[i] += 1;
            }
        }

        return;
    }

    if (matches[index].winner === null) {
        points_table.team_winning(team_names.indexOf(matches[index].team1));
        recurse(matches, index + 1, points_table, all_pos_bucket);

        points_table.team_losing(team_names.indexOf(matches[index].team1));
        points_table.team_winning(team_names.indexOf(matches[index].team2));
        recurse(matches, index + 1, points_table, all_pos_bucket);
        points_table.team_losing(team_names.indexOf(matches[index].team2));
    } else {
        points_table.team_winning(team_names.indexOf(matches[index].winner));
        recurse(matches, index + 1, points_table, all_pos_bucket);
    }
}

/**
 *
 * @param {[{"0": string, "1": string, "res": string}]} json
 *
 * @returns {[IplLeagueMatch]}
 */
function get_league_matches(json) {
    return json.filter((entry) => entry['0'] !== "TBC" && entry['1'] !== "TBC").map((entry) => {
        const res = entry['res'];
        return {
            team1: entry['0'],
            team2: entry['1'],
            winner: res !== null ? res.includes("won") ? res.substr(0, res.indexOf(' won')) : null: null
        };
    })
}

/**
 *
 * @param {[IplLeagueMatch]} matches /**league_matches /
 * @param {boolean} force_find_till_end
 * @param {number} extra_matches_to_compute
 */
function chance_calculator(matches, force_find_till_end, extra_matches_to_compute) {
    total_iterations = 0;

    let points_table = new IplScoreBoard();
    let all_pos_bucket = [
        new Set(),
        new Set(),
        new Set(),
        new Set(),
        new Set(),
        new Set(),
        new Set(),
        new Set(),
        new Set(),
        new Set()
    ];

    let finished_matches_count = 0;
    for (let i of matches) {
        if (i.winner === null) {
            break;
        }

        finished_matches_count += 1;
    }

    console.log("[JS] Already finished matches: ", finished_matches_count);

    let end_index = 0;
    if (force_find_till_end) {
        end_index = matches.length;
    } else {
        end_index = Math.min(finished_matches_count + extra_matches_to_compute, matches.length)
    };

    recurse(
        matches.slice(0, end_index),
        0,
        points_table,
        all_pos_bucket,
    );

    console.log("[JS] Till {} matches;", end_index);
    console.log("[JS] Total Iterations: {}", total_iterations);
    console.log("[JS] Qualify Possiblities: ", points_table.total_qualifications.map((total_qualified, i) => ({
        team: team_names[i],
        qualify: 100 * ((total_qualified) / points_table.total_possibilities)
    })));
    console.log("[JS] Points Table: ", points_table);
    console.log("[JS] Sum: ", points_table.total_qualifications.reduce((acc,val) => acc+val));

    let final_possibilities = new Map();

    let i = 0;
    for (let total_qualified of points_table.total_qualifications) {
        let team_enum = team_names[i];

        final_possibilities.set(
            team_enum,
            100 * (total_qualified / points_table.total_possibilities),
        );
        i += 1;
    }

    return final_possibilities;
}

/**
* @param {string} json_string
* @param {number} extra_matches_to_compute
* @returns {string}
*/
export function get_chances(json_string, extra_matches_to_compute) {

    let compute_for_whole_ipl = extra_matches_to_compute == -1;

    if (extra_matches_to_compute < 0) {
        extra_matches_to_compute = 0;   // to make it valid
    }

    let json = JSON.parse(json_string);

    const league = get_league_matches(json);
    let scores = chance_calculator(
        league,
        compute_for_whole_ipl,
        extra_matches_to_compute  // invariant: it is always >= 0, as when it's less than 0 is already handled
    );

    let final_json = {};

    for (let score of scores) {
        final_json[score[0]] = score[1];
    }

    return JSON.stringify(final_json);
}
