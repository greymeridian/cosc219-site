# BrewQuest

## M1 Project Proposal

**COSC 219 · Ronny Lorette 300294189, Felipe Rebello 300378630**

## What the application does

BrewQuest is a client-side web application that helps users discover breweries by name, city, or province using live data from Open Brewery DB. Users can filter results by brewery type, save a wishlist, and record visits with personal ratings and tasting notes that persist between visits.

## Who would use it and why

BrewQuest is for craft-beer enthusiasts and travellers who want to discover breweries and remember places they have visited. We will initially focus on Canadian breweries, including Kelowna.

## API and evidence

We will use **Open Brewery DB**, a free public API that requires no API key and has an open-source implementation.

- [API documentation](https://api.openbrewerydb.org/docs/)
- [Source code](https://github.com/openbrewerydb/openbrewerydb-laravel-api)

## Browser and `fetch` verification
**Ronny ran this request in a browser URL field:**

```
https://api.openbrewerydb.org/v1/breweries/search?query=%7Bkelowna%7D
```

It returned seven Kelowna records. An excerpt from the first returned record, formatted for readability, was:œ

```
{
    "id": "04bfc73f-b592-472a-ac7e-773a14709da3",
    "name": "Granville Island Brewing",
    "brewery_type": "brewpub",
    "address_1": "1125 Richter Street",
    "address_2": null,
    "address_3": null,
    "city": "Kelowna",
    "state_province": "British Columbia"
```

**Ronny then ran this request in a browser console to double check browser functionality:**

```
fetch("https://api.openbrewerydb.org/v1/breweries/search?query=kelowna")
  .then(response => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  })
  .then(data => console.log(JSON.stringify(data, null, 2)))
  .catch(console.error);
```
The request successfully returned the same seven Kelowna records. An excerpt from the result is as follows:

```
{
  "id": "1dd232f4-7a7d-4f6e-a417-08a34e861985",
  "name": "Kettle River Brewing Co.",
  "brewery_type": "brewpub",
  "address_1": "731 Baillie Avenue",
  "city": "Kelowna",
  "state_province": "British Columbia",
  "country": "Canada"
}
```
Other returned records included Granville Island Brewing and Freddy’s Brewpub, confirming browser access and local coverage.

## Rough interface sketch

```
BREWQUEST          Discover | Wishlist | Journal
------------------------------------------------
Search [____________]  Province [All v]
Brewery type [All v]                    [Search]
[Loading / results / no matches / error + retry]
------------------------------------------------
BREWERY NAME                     City, Province
Type · Address
[Save to wishlist] [Mark visited]
------------------------------------------------
Journal: Brewery · Rating [1–5] · Notes [_______]
```

On phones, controls and cards will stack vertically. Navigation and controls will use accessible links, buttons, and labelled inputs.

## Scope and hardest requirement

We will use HTML, CSS, and JavaScript modules, with `localStorage` for wishlists and journal entries. Maps, accounts, and shared reviews are outside the initial scope.

We expect **full keyboard operation and an accessibility audit with no critical failures** to be the hardest requirement, particularly preserving sensible focus and announcing updated results. We will test keyboard navigation, visible focus, labels, contrast, and automated accessibility checks. The app will adapt to phones and laptops and display loading, empty, loaded, and error states.

## Division of work

**Ronny:** API requests, search, filtering, and brewery details.
**Felipe:** Wishlist, visit journal, ratings, notes, and persistence.
**Together:** Code review, integration, responsive design, accessibility testing, documentation, GitHub Pages deployment, and the demo. Both partners will write HTML, CSS, and JavaScript within their features.