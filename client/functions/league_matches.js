const { parse_matches_from_scrollbar } = require("./all_matches");
const TBC_TEAM_NAME = "TBC";

/**
 *
 * NOTE - It basically gets the list of ALL MATCHES, and filters out on basis of:
 *
 * 1. Team 1 or Team 2 is not decided
 * 2. Date is not decided
 *
 * If any of these is true, we consider it a league match
 *
 * BUG - Maan lo mai final ke time is API ko call kiya, to since the dates of all match + team names decided, it will basically return ALL MATCHES
 *       If you have any idea regarding this, please do help, and open an issue on github
 *
 * @param {*} event
 * @param {*} context
 *
 * @returns {Array}
 */
exports.handler = async (event, context) => {
    try {
        const all_matches = parse_matches_from_scrollbar();
        const league_matches = (await all_matches).filter(match => (
            // match['date'] !== null &&    // date is not decided for some league matches in ipl too
            match['0'] !== TBC_TEAM_NAME &&
            match['1'] !== TBC_TEAM_NAME
        ));

        return {
            statusCode: 200,
            body: JSON.stringify(league_matches)
        }
    } catch(err) {
        console.error(err);

        return {statusCode: 500}
    }
}
