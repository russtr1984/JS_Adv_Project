window.addEventListener("load", function () {
    var urlFirstPage = 'https://swapi.dev/api/people/';
    var ul = document.getElementById("list-people");
    var buttons = document.querySelector(".buttons");
    getJson(urlFirstPage).then(function() {
        buttons.classList.remove("hide");
    });
    var prev, next, currentData;
    var btnPrev = document.getElementById("btnPrev");
    var btnNext = document.getElementById("btnNext");
    var btnClose = document.getElementById("btnClose");
    var popUp = document.querySelector(".pop-up");
    var infoTable = document.querySelector(".info-table");
    btnPrev.addEventListener("click", function () {
        if (prev) {
            getJson(prev);
        }
    });
    btnNext.addEventListener("click", function () {
        if (next) {
            getJson(next);
        }
    });
    ul.addEventListener("click", function (e) {
        var target = e && e.target;
        if (target.tagName !== 'LI') {
            return
        }
        clickLiHandler(target);
    });
    btnClose.addEventListener("click", function () {
        popUp.classList.toggle("hide");
    });
    function fillList(data) {
        ul.innerHTML = '';
        prev = data.previous;
        next = data.next;
        currentData = data;
        for (var i = 0; i < data.results.length; i++) {
            var el = document.createElement("li");
            el.innerHTML = data.results[i].name;
            el.index = i;
            ul.appendChild(el);
        }
    }
    function getJson(url) {
        url = correctUrl(url);
        ul.innerHTML = `<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;
        return fetch(url).then(function (response) {
            return response.json();
        })
            .then(function (data) {
                fillList(data);
            })
            .catch(function (error) {
                console.error(error);
            });
    }
    function correctUrl(url) {
        return url.replace('http://', 'https://');
    }
    function clickLiHandler(element) {
        var person = currentData.results[element.index];
        infoTable.innerHTML = `<div class="lds-roller show-loader-center"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;
        var txt = `<table border="1" cellpadding="5"><thead><tr><th colspan="2">${person.name}</th></tr></thead>`;
        txt += `<tbody><tr><td>Gender</td><td>${person.gender}</td></tr>`;
        txt += `<tr><td>Birth year</td><td>${person.birth_year}</td></tr>`;
        fetch(correctUrl(person.homeworld)).then(function (response) {
            return response.json();
        })
            .then(function (data) {
                txt += `<tr><td>Planet</td><td>${data.name}</td></tr>`;
                txt += `<tr><td>Films</td><td><ul>`;
                var arrJobs = [];
                for (let i = 0; i < person.films.length; i++) {
                    arrJobs[i] = fetch(correctUrl(person.films[i])).then(function (response) {
                        return response.json();
                    })
                }
                var results = Promise.all(arrJobs);
                results.then(function (arrObjects) {
                    for (var obj of arrObjects) {
                        txt += `<li>${obj.title}</li>`;
                    }
                    txt += `</ul></td></tr><tr><td>Species</td><td><ul>`;
                    arrJobs = [];
                    for (let i = 0; i < person.species.length; i++) {
                        arrJobs[i] = fetch(correctUrl(person.species[i])).then(function (response) {
                            return response.json();
                        })
                    }
                    var results = Promise.all(arrJobs);
                    results.then(function (arrObjects) {
                        for (var obj of arrObjects) {
                            txt += `<li>${obj.name}</li>`;
                        }
                        txt += `</ul></td></tr></tbody></table>`;
                        infoTable.innerHTML = txt;
                    })
                });
            })

        if (popUp.classList.contains("hide")) {
            popUp.classList.remove("hide");
        }
    }
});