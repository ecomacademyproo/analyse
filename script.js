// === ÉCRAN D'ACCUEIL ===
function startGroum() {
    document.getElementById("welcome-screen").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
}



// === TABLE DES TAUX GROUM PAR MOT-CLÉ ===
const keywordRates = {
    "produit": 30,
    "digitaux": 30,
    "digital": 30,

    "ia": 19.99,
    "intelligence": 19.99,

    "dropshipping": 6,

    "tiktok": 7,

    "whatsapp": 18,

    "bot": 22.8
};


// === MATRICE DES PAYS ===
const countryData = {
    "France": { power: 9, conv: 2.5 },
    "Belgique": { power: 8, conv: 3 },
    "Luxembourg": { power: 10, conv: 4 },
    "Allemagne": { power: 8, conv: 2.7 },
    "Suisse": { power: 10, conv: 4.2 },
    "Italie": { power: 7, conv: 2.3 },
    "Espagne": { power: 7, conv: 2.5 },
    "Cameroun": { power: 6, conv: 1.8 },
    "Côte d’Ivoire": { power: 7, conv: 2.1 },
    "Burkina Faso": { power: 5, conv: 1.5 },
    "Mali": { power: 5, conv: 1.4 },
    "Sénégal": { power: 7, conv: 2 },
    "États-Unis": { power: 10, conv: 3 },
    "Royaume-Uni": { power: 9, conv: 2.7 },
    "RDC": { power: 6, conv: 1.7 }
};



// === DÉTECTION DES MOTS-CLÉS ===
function detectKeywords(text) {
    text = text.toLowerCase();
    let found = [];

    for (let key in keywordRates) {
        if (text.includes(key)) {
            found.push(keywordRates[key]);
        }
    }

    return found;
}



// === CALCUL GROUM ===
let chart;

function runGroum() {

    let idea = document.getElementById("ideaInput").value.toLowerCase();
    let budget = parseFloat(document.getElementById("budgetInput").value);
    let country = document.getElementById("countryInput").value;

    if (!idea || !budget || !country) {
        alert("Remplis bien les 3 champs poto !");
        return;
    }

    // POPUP CHARGEMENT
    document.getElementById("loadingPopup").style.display = "flex";

    setTimeout(() => {

        document.getElementById("loadingPopup").style.display = "none";

        // VISITEURS
        let visiteurs = budget * 25;
        document.getElementById("visiteurs").innerText = visiteurs;

        // DETECTION DES MOTS-CLÉS
        let detected = detectKeywords(idea);
        let avgRate = detected.length > 0
            ? detected.reduce((a, b) => a + b, 0) / detected.length
            : 5;

        // AJOUT PAYS
        let countryConv = countryData[country].conv;

        // conversion finale
        let finalConv = (avgRate + countryConv) / 2;
        document.getElementById("conversion").innerText = finalConv.toFixed(2) + "%";

        // ACHATS
        let achats = Math.round(visiteurs * (finalConv / 100));
        document.getElementById("achats").innerText = achats;

        // SCORE GLOBAL GROUM
        let score = Math.round(
            (avgRate / 10) * 40 +
            countryData[country].power * 4 +
            (finalConv * 2)
        );

        if (score > 100) score = 100;

        document.getElementById("scoreFinal").innerText = score + "/100";

        // VERDICT
        let verdict = "";

        if (score >= 85) verdict = "🔥 EXCELLENT — LANCE IMMÉDIATEMENT";
        else if (score >= 70) verdict = "🟩 TRÈS BON — FORT POTENTIEL";
        else if (score >= 50) verdict = "🟨 MOYEN — PEUT MARCHER AVEC OPTIMISATION";
        else verdict = "🟥 FAIBLE — IDÉE RISQUÉE";

        document.getElementById("verdict").innerText = verdict;

        // RADAR CHART
        let ctx = document.getElementById("chartGroum");

        let dataRadar = [
            avgRate / 2,
            countryData[country].power,
            finalConv / 5,
            achats > 0 ? 10 : 2,
            visiteurs > 200 ? 8 : 4
        ];

        if (chart) chart.destroy();

        chart = new Chart(ctx, {
            type: "radar",
            data: {
                labels: [
                    "Potentiel",
                    "Puissance Pays",
                    "Conversion",
                    "Rentabilité",
                    "Trafic"
                ],
                datasets: [{
                    label: "Analyse GROUM",
                    data: dataRadar,
                    backgroundColor: "rgba(255,215,0,0.3)",
                    borderColor: "gold",
                    borderWidth: 2,
                    pointBackgroundColor: "gold"
                }]
            },
            options: {
                scales: {
                    r: {
                        grid: { color: "#444" },
                        angleLines: { color: "#666" },
                        ticks: { color: "white" }
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: "white" }
                    }
                }
            }
        });

        document.getElementById("results").style.display = "block";

    }, 1800);
}
