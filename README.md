# KetoJS

SleeplessInc Discord: https://discord.gg/ywMm7d9w3Z

What is this?
- A simple opinionated template for building quick and dirty web apps using node and express
- A stupidly named repo

What this isn't?
- A full featured framework
- A production ready template
- A template with user authentication (yet...)
- A template for building a native mobile app (yet...)

How do I use this?
- clone the repo
- `npm install`
- `npm run dev` to run the dev server
- `npm run build` to build the client
- `npm run clean` to remove the dist folder
- `npm run build:clean` to build and clean (also resets node_modules folder)

What about production?
- Currently this template assumes that you will be passing the app to a server already running express or something like it. The idea is that an external app will require this app as a module and try to run it. That is why `index.js` exports the express app.
- The dev server just starts the express app on port 3000, but you can pass a port number as an argument to the dev script or extend this system however you like, you are a 
  fantastic developer after all.
