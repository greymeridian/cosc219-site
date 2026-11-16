import { TrailRegistry } from "../lab6/registry.js";
import { TRAIL_DATA } from "../lab6/data.js";
import {
    addTrail,
    findAction,
    isValidTrail,
    makeTrail,
    removeTrail,
    toggleTrail
} from "../lab7/trails.js";
import { renderTrails, summaryText } from "../lab7/render.js";
import { clearTrails, loadTrails, saveTrails } from "../lab7/storage.js";

const searchInput = document.querySelector("#trail-search");
const ratingSelect = document.querySelector("#trail-rating");
const sortSelect = document.querySelector("#trail-sort");
const openOnly = document.querySelector("#open-only");
const resultCount = document.querySelector("#result-count");
const resultList = document.querySelector("#trail-results");
const steepestTrail = document.querySelector("#steepest-trail");

const form = document.querySelector("#add-trail-form");
const nameInput = document.querySelector("#saved-trail-name");
const distanceInput = document.querySelector("#saved-trail-distance");
const trackerError = document.querySelector("#tracker-error");
const trackerSummary = document.querySelector("#tracker-summary");
const savedList = document.querySelector("#saved-trails");
const clearButton = document.querySelector("#clear-saved-trails");

trackerError.setAttribute("tabindex", "-1");

const catalog = TrailRegistry.fromData(TRAILS.map(row => {
    const registryRow = TRAIL_DATA.find(trail => trail.name === row.name);

    if (registryRow && "surface" in registryRow) {
        return { ...row, surface: registryRow.surface };
    }

    return row;
}));

const overview = report(TRAILS);
document.querySelector("#total-trails").textContent = overview.total;
document.querySelector("#open-trails").textContent = overview.open;
document.querySelector("#open-distance").textContent = `${overview.openKm} km`;

let savedTrails = loadTrails();

function showTrackerError(message) {
    trackerError.textContent = message;
    trackerError.focus({ preventScroll: true });
    trackerError.scrollIntoView({ block: "center" });
}

const addAllButton = document.querySelector("#add-all-trails");
const addAllStatus = document.querySelector("#add-all-status");

addAllButton.addEventListener("click", () => {
    addAllStatus.textContent = "";

    let nextTrails = savedTrails;
    let added = 0;

    TRAILS.forEach(row => {
        const normalizedName = row.name.trim().toLowerCase();
        const alreadySaved = nextTrails.some(
            trail => trail.name.trim().toLowerCase() === normalizedName
        );

        if (alreadySaved) {
            return;
        }

        const trail = makeTrail(row.name, row.km);
        trail.closed = row.closed;
        nextTrails = addTrail(nextTrails, trail);
        added++;
    });

    if (added === 0) {
        trackerError.textContent = "";
        addAllStatus.textContent = "All catalog trails are already in your list.";
        return;
    }

    if (saveList(nextTrails)) {
        addAllStatus.textContent = added === 1
            ? "Added 1 trail to your list."
            : `Added ${added} trails to your list.`;
    }
});

function renderSavedTrails() {
    renderTrails(savedTrails, savedList);
    trackerSummary.textContent = summaryText(savedTrails);
    clearButton.disabled = savedTrails.length === 0;
}

function saveList(nextTrails) {
    try {
        saveTrails(nextTrails);
    } catch {
        showTrackerError("Could not save your trail list in this browser.");
        return false;
    }

    savedTrails = nextTrails;
    trackerError.textContent = "";
    renderSavedTrails();
    return true;
}

function saveNewTrail(name, km, closed = false) {
    if (!isValidTrail(name, km)) {
        showTrackerError("Enter a trail name and a distance above zero.");
        return false;
    }

    const normalizedName = name.trim().toLowerCase();
    const existingTrail = savedTrails.find(
        trail => trail.name.trim().toLowerCase() === normalizedName
    );

    if (existingTrail) {
        showTrackerError(`${existingTrail.name} is already in your trail list.`);
        return false;
    }

    const trail = { ...makeTrail(name, km), closed };
    return saveList(addTrail(savedTrails, trail));
}

function renderResults() {
    const search = searchInput.value.trim().toLowerCase();
    const rating = ratingSelect.value;

    let matches = TRAILS.filter(trail =>
        trail.name.toLowerCase().includes(search) &&
        (rating === "" || trail.rating === rating)
    );

    if (openOnly.checked) {
        matches = openTrails(matches);
    }

    if (sortSelect.value === "distance") {
        matches = sortedByDistance(matches);
    }

    const matchingRegistry = new TrailRegistry(
        matches.map(row => catalog.find(row.name))
    );
    const steepest = matchingRegistry.steepest;

    steepestTrail.textContent = steepest
        ? `${steepest.name} (${steepest.steepness} m/km)`
        : "—";

    resultList.textContent = "";

    if (matches.length === 0) {
        resultCount.textContent = "No trails match your filters.";
        return;
    }

    resultCount.textContent = `Showing ${matches.length} of ${TRAILS.length} trails.`;

    matches.forEach(row => {
        const trail = matchingRegistry.find(row.name);
        const item = document.createElement("li");
        const description = document.createElement("div");

        const name = document.createElement("strong");
        name.textContent = trail.name;

        const details = document.createElement("span");
        details.className = "catalog-details";

        const status = row.closed ? "Closed" : "Open";
        const surface = trail.surface ? ` · ${trail.surface}` : "";
        details.textContent = `${trail.km} km · ${trail.rating} · ${status}${surface}`;

        description.append(name, details);

        const saveButton = document.createElement("button");
        saveButton.type = "button";
        saveButton.textContent = "Add";
        saveButton.setAttribute("aria-label", `Add ${trail.name} to my list`);

        saveButton.addEventListener("click", () => {
            saveNewTrail(trail.name, trail.km, row.closed);
        });

        item.append(description, saveButton);
        resultList.appendChild(item);
    });
}

form.addEventListener("submit", event => {
    event.preventDefault();

    if (saveNewTrail(nameInput.value, distanceInput.value)) {
        form.reset();
    }
});

savedList.addEventListener("click", event => {
    const clicked = findAction(event.target);
    if (!clicked) return;

    if (clicked.action === "toggle") {
        saveList(toggleTrail(savedTrails, clicked.id));
    } else if (clicked.action === "delete") {
        saveList(removeTrail(savedTrails, clicked.id));
    }
});

clearButton.addEventListener("click", () => {
    try {
        clearTrails();
    } catch {
        showTrackerError("Could not clear your saved trails in this browser.");
        return;
    }

    savedTrails = [];
    trackerError.textContent = "";
    renderSavedTrails();
});

searchInput.addEventListener("input", renderResults);
ratingSelect.addEventListener("change", renderResults);
sortSelect.addEventListener("change", renderResults);
openOnly.addEventListener("change", renderResults);

renderResults();
renderSavedTrails();