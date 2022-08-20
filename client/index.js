import * as wasm from "../pkg";
import graph_data from "../data/graph_data";
// import * as js_code from "./js_get_chances"; // for BENCHMARKING use only

/**
 *
 * @param {[{"0": string, "1": string, "res": string}]} data
 * @returns {number} Number of finished matches
 */
function get_num_finished_matches(data) {
    let num_finished = 0;
    for (let entry of data) {
        if (/ won /.test(entry['res'])) {
            num_finished += 1;
            continue;
        }
        break;
    }
    return num_finished;
}

/**
 * @returns {{
 *       "CSK": number,
 *       "MI": number,
 *       "RCB": number,
 *       "SRH": number,
 *       "PBKS": number,
 *       "KKR": number,
 *       "DC": number,
 *       "RR": number
 *   }}
 */
function get_latest_chance() {
    let data_arr = [];
    for (let key in graph_data) {
        try {
            parseInt(key);
            data_arr[key] = graph_data[key];
        } catch { }
    }

    return data_arr[data_arr.length-1];
}

/**
 * @returns {number}
 */
function get_latest_min_qualification() {
    let last_pred = 0;  // 0th match
    let latest_min = 0;
    for (const key in graph_data) {
        if (Object.hasOwnProperty.call(graph_data, key)) {
            if( ! /^\d+_min_q$/.test(key) ) continue; 
            let match_num = parseInt(key.substr(0,key.indexOf("_min_q")));

            if( match_num > last_pred ) {
                console.log("Chosing ", key);
                last_pred = match_num;
                latest_min = graph_data[key];
            }
        }
    }

    return latest_min;
}

function initChancesTable() {
    const latest_chances_data = get_latest_chance();

    const scores_arr = [];

    for (const team in latest_chances_data) {
        if (Object.hasOwnProperty.call(latest_chances_data, team)) {
            const percentage = latest_chances_data[team];

            scores_arr.push({ team, percentage });
        }
    }

    // sorted in descending order
    scores_arr.sort((a, b) => b.percentage - a.percentage);

    document.getElementById("chances_table").innerHTML = "";
    // const qualification = document.createElement("strong");
    // qualification.id = "score_table_qualification";
    // qualification.innerText = `Minimum Qualifying Points as of now: ${get_latest_min_qualification()}`;
    // document.getElementById("chances_table").appendChild(qualification);

    const table = document.createElement("table");
    table.id = "score_table_rust";
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");
    const team_name = document.createElement("th");   // team name
    const team_chances = document.createElement("th");   // team chances
    team_name.innerText = "Team";
    team_chances.innerText = "Chances";
    tr.appendChild(team_name);
    tr.appendChild(team_chances);

    thead.appendChild(tr);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    table.appendChild(tbody);

    for (const score of scores_arr) {
        const tr = document.createElement("tr");
        tr.id = `${score.team}_tr`;
        const t_name = document.createElement("td");
        const t_chances = document.createElement("td");

        t_name.innerText = score.team;
        t_chances.innerText = score.percentage;

        tr.appendChild(t_name);
        tr.appendChild(t_chances);

        tbody.appendChild(tr);
    }

    const caption = document.createElement("caption");
    const notice = document.createElement("strong");
    notice.id = "score_table_notice";
    notice.innerText = `Current Situation (ie. 56 league matches tak)`;
    const p = document.createElement("p");
    p.innerText = "Chances of teams qualifying for PlayOffs";

    caption.appendChild(notice);
    caption.appendChild(p);
    table.appendChild(caption);

    document.getElementById("chances_table").appendChild(table);

}

function handleClick(data, extra_matches_to_compute) {
    console.log("Data: ", data);

    let call_time = Date.now();
    const possibilities = wasm.get_chances(JSON.stringify(data), extra_matches_to_compute);
    console.info(`[Rust] Elapsed time: ${(Date.now() - call_time)/1000}s`);

    // call_time = Date.now();
    // const _possibilities = js_code.get_chances(JSON.stringify(data), extra_matches_to_compute);
    // console.info(`[JS] Elapsed time: ${(Date.now() - call_time)/1000}s`);

    console.log("Received from rust: ", possibilities);

    const scores = JSON.parse(possibilities);    // returns Javascript object

    const scores_arr = [];

    for (const key in scores) {
        if (Object.hasOwnProperty.call(scores, key)) {
            if(key == "min_qual")   continue;
            const percentage = scores[key];

            scores_arr.push({ team: key, percentage });
        }
    }

    // sorted in descending order
    scores_arr.sort((a, b) => b.percentage - a.percentage);

    try {
        document.getElementById("score_table_rust").id; // this must cause a failure, if not available

        for (const score of scores_arr) {
            const tr = document.getElementById(`${score.team}_tr`);
            const t_chances = tr.children[1];

            t_chances.innerText = score.percentage;
        }

        document.getElementById("score_table_notice").innerText = `TILL ${extra_matches_to_compute + get_num_finished_matches(data)} Matches`;
    } catch(err) {
        console.error(err);
        initChancesTable();
    }

}

async function fetchData() {
    return fetch("/.netlify/functions/league_matches")
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            else throw Error("Couldn't fetch data");
        })
        .then(matches => {
            console.log("Got the data: ", matches.length);
            if (!Array.isArray(matches)) throw new Error("Received JSON is not an Array");

            return matches.map(match => ({  // we don't want the venue and date fields
                '0': match['0'],
                '1': match['1'],
                res: match['res']
            }));
        })
        .catch(err => {console.error(err)})
}

fetchData()
    .then(json_obj => json_obj)
    .catch(err => {
        console.error("Fetch failed: ", err);
        alert("Unable to get latest match data... Refresh karke dekhe 😟");
    })
    .then(data => {
        window.ipl_json_data = data;

        document.getElementById("extra_num").value = `${Math.min(18 + get_num_finished_matches(window.ipl_json_data), 56)}`;
    })

const matches_form = document.querySelector("#num_matches_form");
matches_form.addEventListener("submit", (event) => {
    event.preventDefault();

    return new Promise((resolve, reject) => {
        let num_match = 30;

        try {
            num_match = parseInt(document.getElementById("extra_num").value)
        } catch { }

        handleClick(window.ipl_json_data, num_match - get_num_finished_matches(window.ipl_json_data));
        resolve();
    }).then(() => {});
})

function plotData() {
    let data_arr = [];
    for (let key in graph_data) {
        try {
            parseInt(key);
            data_arr[key] = graph_data[key];
        } catch { }
    }

    console.log("Plotting Data; Total rows in graph_data (data keys only): ", data_arr);

    let x_arr = data_arr.map((_, i) => i);
    let csk_arr = data_arr.map((entry) => entry['CSK']);
    let rr_arr = data_arr.map((entry) => entry['RR']);
    let mi_arr = data_arr.map((entry) => entry['MI']);
    let dd_arr = data_arr.map((entry) => entry['DC']);
    let pbks_arr = data_arr.map((entry) => entry['PBKS']);
    let rcb_arr = data_arr.map((entry) => entry['RCB']);
    let srh_arr = data_arr.map((entry) => entry['SRH']);
    let kkr_arr = data_arr.map((entry) => entry['KKR']);

    Plotly.newPlot(
        'trends_graph',
        [{
            x: x_arr,
            y: csk_arr,
            name: "CSK",
            line: {
                color: 'rgb(255, 255, 60)',
                width: 2
            }
        }, {
            x: x_arr,
            y: rr_arr,
            name: "RR",
            line: {
                color: 'rgb(37, 74, 165)',
                width: 2
            }
        }, {
            x: x_arr,
            y: mi_arr,
            name: "MI",
            line: {
                color: 'rgb(0, 75, 150)',
                width: 2
            }
        }, {
            x: x_arr,
            y: dd_arr,
            name: "DC",
            line: {
                color: 'rgb(239, 27, 35)',
                width: 2
            }
        }, {
            x: x_arr,
            y: pbks_arr,
            name: "PBKS",
            line: {
                color: 'rgb(237, 27, 36)',
                width: 2
            }
        }, {
            x: x_arr,
            y: rcb_arr,
            name: "RCB",
            line: {
                color: 'rgb(43, 42, 41)',
                width: 2
            }
        }, {
            x: x_arr,
            y: srh_arr,
            name: "SRH",
            line: {
                color: 'rgb(255, 130, 42)',
                width: 2
            }
        }, {
            x: x_arr,
            y: kkr_arr,
            name: "KKR",
            line: {
                color: 'rgb(46, 8, 84)',
                width: 2
            }
        }],
        {
            title: "Trend of Qualification Chances of teams for Playoffs",
            // margin: { t: 40 },
            // height: '80%',
            // width: '100%',
            xaxis: {
                title: "Number of finished matches",
                // showgrid: false,
                // zeroline: false
            },
            yaxis: {
              title: 'Qualification chances',
            //   showline: false,
                zeroline: true
            }
        }
    );
}

initChancesTable();
plotData();
document.getElementById("source_code").innerHTML = `<strong>Source Code:</strong> <a href="https://github.com/adi-g15/ipl_pred" aria-label="Star adi-g15/ipl_pred on GitHub">https://github.com/adi-g15/ipl_pred</a>`;

