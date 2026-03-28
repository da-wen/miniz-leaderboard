Help planning a static web page that can be hosted in github pages. This app is about showing best lap times for miniz rc cars. The web page should be generated and should base on nextjs.

The app should have a sidebar with all tracks listed. When the user clicks on that track the page should be opened and show tabs for every racing class. When you cick on a tab, there should be the an expandable element visible where the rules for this racing class are shown. The main content should show the a table of all Drivers and their laptimes for this class.

Data Example for racing data for one class:
[
    {
        "Driver": "Daniel",
        "Car Model": "Rima Raptor Evo",
        "Best Laptime": 8.425,
        "3 Consecutive Laps": 26.459,
        "Updated Best Laptime": 2026-03-27,
        "Updated 3 Consecutive Laps": 2026-03-28
    }
]



Key Features:
- do not start implementing this. Only creating a plan is your job
- left sidebard should be read from files
- global definition of classes should be possible
- no database usage. only files.
- global definition for tracks and assignes classes
- in the end only the data files will be modified and the js code files
- Propse a good data model for not being redundant
- The table should be sortable by: best laptime and 3 consecutive laps.
- The default sorted columns should be defined in the class and track files
- One laptime is required of ["Best Laptime", "3 Consecutive Laps"]
- create a documentation for deploing this to github pages



Tasks:
- create a detailed plan in the folder @.specs/001-basic-app.
- the plan should be splitted into multiple files.
- the sonnet model should understand this and should implement everything later
- use the subagents and skills
- use webfetch for receiving the newest documentations
- check for modern web designs
- checkout a good architecture
- if there is anythin unclear, ask me
- create a documentation
- create a readme file