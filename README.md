# Campus Life Planner

A simple, pink, responsive web app that helps students plan tasks and events. Each record has a due date, a duration and a tag. You can search with regex, see stats for the last 7 days, and set a weekly time cap. Built with plain HTML, CSS and JavaScript (no frameworks).

**Theme:** Campus Life Planner

## Links
- Live site (GitHub Pages): https://skemboi-kossy.github.io/summative_campus-life-planner/
- Demo video (unlisted): https://youtu.be/MVUzqZ8XkvA

## Features
- Add, edit (inline in the table row) and delete records, with a confirm before deleting
- Sort by due date, title (A to Z) and duration
- Live regex search with a case-insensitive toggle and highlighted matches
- Dashboard: total records, total planned time, top tag, last 7 days, and a 7-day bar chart
- Weekly time cap with a live message (polite when under, assertive when over)
- Units setting: show durations in minutes or hours
- Editable tag list
- Auto-save to localStorage
- JSON export, and JSON import with validation
- Responsive layout (table on larger screens, stacked cards on phones)

## Data Model
Durations are stored in minutes.

| Field | Description |
|---|---|
| id | Unique label, like rec_0001 |
| title | Name of the task or event |
| dueDate | Date in YYYY-MM-DD format |
| duration | Minutes, up to 2 decimals |
| tag | Category like Study, Club or Group-Work |
| createdAt | Timestamp, set once |
| updatedAt | Timestamp, changes on every edit |

Settings (saved separately): unit (minutes or hours), weekly cap in minutes, and the tag list.

## Regex Catalog

### Form validation
| Field | Pattern | Accepts | Rejects |
|---|---|---|---|
| Title | `^\S(?:.*\S)?$` (plus a check for double spaces) | `Lunch with team` | ` Lunch`, `Lunch `, `a  b` |
| Duration | `^(0\|[1-9]\d*)(\.\d{1,2})?$` | `0`, `90`, `1.5` | `01`, `1.234`, `-5` |
| Date | `^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$` (plus a real-date check) | `2024-02-29` | `2026-13-40`, `2026-02-29` |
| Tag | `^[A-Za-z]+(?:[ -][A-Za-z]+)*$` | `Study`, `Group-Work`, `Career Fair` | `Study1`, `-Study` |
| Advanced: repeated word (back-reference) | `\b(\w+)\s+\1\b` | `Read chapter 4` | `the the cat` |

### Search examples
| Pattern | What it finds |
|---|---|
| `study\|club` | Records mentioning study or club |
| `\b\d{2}:\d{2}\b` | Titles with a time like 09:30 |
| `^@tag:\w+` | Filter by tag, for example `@tag:study` |
| `\b(\w+)\s+\1\b` | Titles with a repeated word |

An invalid pattern (for example `(`) does not crash the app. A message says the pattern is not valid yet and all records stay visible. Matches are wrapped in `<mark>`, and the text is escaped first so search can't inject HTML.

## Keyboard Map
| Keys | Action |
|---|---|
| Tab / Shift+Tab | Move forward / backward through links, fields and buttons |
| Tab (first press on load) | Shows the "Skip to main content" link |
| Enter | Follow a menu link, press a button, or submit a form |
| Space | Press a button or toggle the case-insensitive checkbox |
| Arrow Up / Down | Change the Sort by and Units selects |
| Enter on Edit | Turns the row into inputs and moves focus to the title |
| Enter on Save / Cancel | Saves or cancels the row edit |

## Accessibility Notes
- Semantic landmarks (header, nav, main, section, footer) and a logical heading order (h1, h2, h3)
- Skip-to-content link
- Every input has a visible label, and errors are linked with `aria-describedby`
- Errors have the word "Error:" as well as color, and invalid fields use `aria-invalid`
- Live regions (`role="status"`) announce saved, deleted and search messages
- The cap message switches between `aria-live="polite"` (under) and `"assertive"` (over)
- The chart has a text summary in its `aria-label`
- Clearly visible focus outline on all interactive elements
- Buttons and inputs are at least 44px tall on touch screens
- Animations are turned off for users who prefer reduced motion
- Dark text on light backgrounds, with the pink accent chosen for contrast
- Mobile-first layout with breakpoints at about 360px, 768px and 1024px

## How to Run
The app uses ES modules, so open it through a server (double-clicking `index.html` will not work).
1. Open the project folder in VS Code.
2. Install the Live Server extension.
3. Right-click `index.html` and choose **Open with Live Server**.

## How to Run Tests
1. Right-click `tests.html` and choose **Open with Live Server**.
2. The page lists each test as PASS or FAIL and shows a total, for example "23 of 23 tests passed".

The tests cover the validators (title, duration, date, tag, repeated word), the safe regex compiler, and the highlight function.

## Seed Data
`seed.json` holds 12 records, including a leap day (2024-02-29), a very small duration (0.25), a very large one (1440), a time in a title (`Standup 09:30`), a repeated word, and tags with hyphens and spaces. It loads the first time the app runs.

## Import and Export
- Export downloads all records as a JSON file.
- Import accepts a JSON array. Each record must have a unique id, a valid title, dueDate, numeric duration, a valid tag, and both timestamps. If anything is wrong, nothing is imported and a message names the problem.

## Project Structure
```
index.html
tests.html
seed.json
styles/main.css
scripts/main.js        (events and start-up)
scripts/state.js       (data, sorting, search filter, stats)
scripts/ui.js          (drawing the page)
scripts/storage.js     (localStorage and import/export checks)
scripts/search.js      (safe regex compiler and highlight)
scripts/validators.js  (regex rules)
```

## Contact
- GitHub: https://github.com/skemboi-kossy
- Email: s.kemboi@alustudent.com