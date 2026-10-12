# summative_campus-life-planner

# Campus Life Planner

## About
A responsive web app that helps students plan their tasks,durations and events.Each record has a due date ,a duration and a tag and you can search with regex,see stats and set a weekly time cap . Built with vanilla HTML,CSS and Javascript without any frameworks.

**Theme:**Campus Life Planner

## Planned Features 
- Add,edit and delete tasks and events
- Sort by due date,title(A to Z)
- Live regex search with a case-insensitive toggle and highlighted matches
- Dashboard with total tasks,total planned time,top tag,and a last-7-days chart 
- Weekly time cap with live messages for remaining time or going over 
- Save automatically to localStorage 
- JSON import and export with validation 
- Settings for duration units and tags
- Fully keyboard accessible,responsive from phone to desktop

## Data Model
Each record looks like this:

|Field | Description |
|---|---|
| id | Unique label, like rec_0001|
| title | Name of the task or event |
| dueDate | Date in YYY-MM-DD format |
| duration | Time needed,in minutes (up to 2 decimals) 
| tag | Category like Study ,Club, or Personal |
| createdAt | Timestampset once when created |
| updatedAt | Timestamp,cahnges on every edit |

## Settings
- Duration unit: minutes or hours 
- Weekly time cap 
- Editbale tag list
- Case-insensinsitive search google 

## Accessibility Plan 
- Semnatic Landmarks (header,nav,main,section,footer) and a logical heading order
- A skip-to content link
- Visible labels on every input
- Errors and cap messages announced through live regions
- Clearly visible focus styles
- Everything usable with keyboard alone
- Color contrast checked for all text
- Mobile-first layout with breakpoints about 360px,768px, and 1024px 


## Contact
- Github: skemboi-kossy
- Email: s.kemboi@alustudent.com






