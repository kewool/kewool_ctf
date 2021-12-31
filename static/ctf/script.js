let last_data;
let last_solved_list;

function docId(name) {
    return document.getElementById(name);
}

docId("background").addEventListener("click", () => {
    docId("background").classList.remove("active");
    docId("problemPanel").classList.remove("active");
});

docId("problemPanelSolvedChange").addEventListener("click", ()=>{
    docId("problemPanelChallange").classList.remove("active");
    docId("problemPanelSolved").innerText = "";
    docId("problemPanelSolved").classList.add("active");
    fetch("/api/ctf/solved", {
        method:'POST',
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
            "X-CSRFToken": csrfToken
        },
        body:`problemName=${docId("problemPanelTitle").innerText}`
    }).then((res)=>res.json()).then((data)=>{
        data = data["contents"]
        console.log(data)
        for(var user of data){
            div = document.createElement("div");
            solvedUserName = document.createElement("span");
            solvedUserName.classList.add("solvedUserName");
            solvedUserName.innerText = user[0];
            solvedUserDate = document.createElement("span");
            solvedUserDate.classList.add("solvedUserDate");
            solvedUserDate.innerText = user[1];
            div.append(solvedUserName);
            div.append(solvedUserDate);
            docId("problemPanelSolved").append(div);
        }
    })
})

docId("backArrow").addEventListener("click", ()=>{
    docId("problemPanelSolved").classList.remove("active");
    docId("problemPanelChallange").classList.add("active");
})

docId("problemPanelSubmit").addEventListener("click", ()=>{
    fetch("/api/flag/submit", {
        method: 'POST',
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
            "X-CSRFToken": csrfToken
        },
        body: `problemTitle=${docId("problemPanelTitle").innerText}&problemFlag=${docId("problemPanelFlag").value}`
    }).then((res)=>res.json()).then((data)=>{
        if (data["result"] === "correct") {
            docId("problemPanelIncorrect").classList.add("deactive");
            docId("problemPanelFlag").classList.add("deactive");
            docId("problemPanelSubmit").classList.add("deactive");
            docId("problemPanelFlagSolved").classList.remove("deactive");
            docId(docId("problemPanelTitle").innerText).classList.add("solved");
        } else if(data["result"] === "incorrect"){
            docId("problemPanelIncorrect").classList.remove("deactive");
        }
    })
})

function showProblem(problemName) {
    docId("problemPanelSolvedChange").innerText = ""
    docId("problemPanelTitle").innerText = "";
    docId("problemPanelScore").innerText = "";
    docId("problemPanelContents").innerHTML = "";
    docId("problemPanelFile").setAttribute("href", "");
    docId("problemPanelIncorrect").classList.add("deactive")
    docId("problemPanelSolved").classList.remove("active");
    docId("problemPanelChallange").classList.add("active");
    docId("problemPanelFlag").classList.remove("deactive");
    docId("problemPanelSubmit").classList.remove("deactive");
    docId("problemPanelFlagSolved").classList.add("deactive");
    docId("background").classList.add("active");
    docId("problemPanel").classList.add("active");
    fetch("/api/ctf/get", {
        method: 'POST',
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
            "X-CSRFToken": csrfToken
        },
        body: `problemName=${problemName}`
    }).then((res)=>res.json()).then((data)=>{
        data = data["contents"];
        docId("problemPanelSolvedChange").innerText = `${data[3]} Solved`
        docId("problemPanelTitle").innerText = problemName;
        docId("problemPanelScore").innerText = data[0];
        docId("problemPanelContents").innerHTML = data[1];
        docId("problemPanelFile").setAttribute("href", data[2]);
        if(last_solved_list.find(element => element == problemName)){
            docId("problemPanelFlag").classList.add("deactive");
            docId("problemPanelSubmit").classList.add("deactive");
            docId("problemPanelFlagSolved").classList.remove("deactive");
        }
    })

}

fetch("/api/ctf/list", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        "X-CSRFToken": csrfToken
    }
}).then((res) => res.json()).then((data) => {
    last_data = data["contents"];
    last_data.forEach((problem, i) => {
        if(docId(problem[0]) === null){
            let div = document.createElement("div");
            div.id = problem[0];
            div.className = "problemType";
            let p = document.createElement("p");
            p.className = "problemTypeText";
            p.innerText = problem[0];
            div.append(p);
            docId("panel").append(div);
        }
        let problemBox = document.createElement("div");
        problemBox.className = "problemBox";
        problemBox.id = problem[1];
        problemBox.setAttribute("onclick", `showProblem("${problem[1]}")`);
        let problemName = document.createElement("p");
        problemName.innerText = problem[1];
        problemName.className = "problemName";
        problemBox.append(problemName);
        let problemScore = document.createElement("span");
        problemScore.innerText = problem[2];
        problemBox.append(problemScore);
        docId(problem[0]).append(problemBox);
        docId(problem[0])
    })
    last_solved_list = data["solved"];
    data["solved"].map(i => docId(i).classList.add("solved"));
    console.log(data)

});

setInterval(function() {
    fetch("/api/ctf/list", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            "X-CSRFToken": csrfToken
        }
    }).then((res) => res.json()).then((data) => {
        
    });
}, 10000);