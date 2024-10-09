# prp_calendar

## What is this?
This repository is part of a dev application for Purple RP. Its a quick demonstration
of what I can build in a few hours (approximately 4 hours spent on this). The idea for
demonstrating an events calendar was suggested by Labat; props to him for the suggestion.

**Note**: This was built this way due to not having access to any PRP resources. An actual
PRP implementation of this (which I hope to work on!) should be built 100% using PRP's
standard systems and tooling, such as being launched by the PRP phone asset and fitting
all of PRP's design standards.

In terms of features I implemented:
* Calendar UI
    * Month View (default)
    * Week View
    * Day View
* Event Creation
    * Including Click-n-Drag Day/Hour Time Blocks
* Event Editing
* Event Deletion
* Auth Checks
* Server-Side Event Persistence

Before building any further features, I wanted to check in with the PRP Dev team about applying.
If brought onto the team, I would rebuild this to ensure its using PRP's standard systems and
tooling. PRP's cohesive, polished design is one of its many strengths, so anything I build would
need to respect that.

## Demonstration
You can watch a video walkthrough [here](https://youtu.be/T3iazzZYSqg).

## What was my approach?

### Event Persistence
Considering this is just a demo, I am persisting the events in a server-side table. For an actual
production resource, we must instead use a cloud-hosted database like Postgres (or whatever the PRP
dev team's preference is). Managing cloud infra is something I have a lot of experience with and is
something I'd be happy to help on.

### NUI
For the NUI side of things, I think React is great for its ecosystem and long-term maintainability,
so I started with a lightweight, standard React/FiveM boilerplate blueprint that many people use.
This was mostly the VisibilityProvider and hooks to get me from 0-to-1 ASAP. I'm assuming PRP has its
own React tooling that the Dev team prefers to use, which I could adapt this resource to use.

Long-term, we might want to consider deploying this React app to some cloud computing service instead
of keeping it within resource code, though there pros/cons tradeoffs to consider

## Thanks!
Thank you for checking this out. I hope this was able to showcase what I'm able to do with a few hours,
and I'd love to contribute to Purple!