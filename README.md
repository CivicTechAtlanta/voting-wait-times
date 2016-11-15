# Voting Wait Times App

This is a project championed by the [New Georgia Project](http://newgeorgiaproject.org/) and hosted by [Code for Atlanta](http://www.codeforatlanta.org/) originally started at [CodeAcross Atlanta 2016](https://nvite.com/CodeAcross/b1aa). 

The goal is to crowd-source wait times at voting precincts.

This application is a static HTML web app using [Firebase](https://firebase.com).

# Project Chat

Our slack channel `#voting-wait-times` on [`codeforatlanta.slack.com`](https://codeforatlanta.slack.com).
Click [here](https://slack.codeforatlanta.org) to join the Code for Atlanta Slack.

## Trello

A list of action items can be found at [https://trello.com/b/kCkLnMTj/voting-wait-times](https://trello.com/b/kCkLnMTj/voting-wait-times)

# Getting started

### Installing

1. [Fork the project](https://github.com/codeforatlanta/voting-wait-times#fork-destination-box)

2. [Install Node.js](https://nodejs.org/en/)

3. Download project and dependencies

commands:

    [sudo] npm install -g gulp bower
    git clone https://github.com/[YOUR-GITHUB-USERNAME]/voting-wait-times.git
    cd voting-wait-times
    npm install
    bower install

### Running

    gulp serve

This gulp task will run the server, open the app in the browser, and automatically reload when changes are made.

### Deployment

The app is hosted on Firebase. [@BrantPadak](https://github.com/BrantPadak) and [@rabidaudio](https://github.com/rabidaudio) currently have access to the Firebase console if you need access.

To deploy, first install the Firebase CLI

    npm i -g firebase-tools

Then simply

    firebase deploy

### TODO

- Fix admin page design
- Add way to look up precincts (search)
- Add link to My Voter page / look up on registration card
- Create View page
- Add Login functions
