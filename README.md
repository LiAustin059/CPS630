## Overview
This web application is meant to serve as a platform for users to create and manage their events. Having run into issues with coordinating events and planning pickup sports games with friends, we decided to create this application to help users like us coordinate event planning. It currently allows users to create events (pickup sports games, watch parties, community gathering, etc), view all the events, and delete events.

The vision for this aplplcaitoin centers around 3 core entities:
  1. Events
  Events will be the primary entity in the application and the core focal point. Events will have a title, description, start and end time, location, and type (this can also be expanded later). Events will also have a creator and a list of attendees.An event can be public (anyone on the application can register to attend) or private (only the creator and invited users can register to attend). An event can be in-person or virtual, based on the creator's preference. An event can also be cancelled, in which case it will be removed from the list of events. 
  The application will allow users to view all the events and filter them by date, location, and type. 
  2. Users
  Users will be the secondary entity in the application and will be used to track the creator and attendees of events. Users will have a username, email, and password. The application will allow users to invite their friends and family to their events, and also allow users to join events created by others. Users can create many events and also join many events. 
  3. Predictions
  Additionally, we want to allow users to engage in friendly wagers with one another by enabling users to place predictions on anything related to an event. For example, if an event is a Super Bowl watch party, users can place predicitons on things like final score, MVP, yardage for a player, etc. Users will not be able to exchange money for their prediciotns in the application, but it is meant to serve as a way to engage users if they wish to do so. Users will be able to view the predictions of other users and also vote on their predictions. 
  This will work by giving the event creator an option to toggle on the prediction feature for their event. If this is enabled, the creator can create topics that useres can place predictions on. 

## Documentation
1. Clone the repository
  ```bash
  git clone https://github.com/LiAustin059/CPS630.git
  cd CPS630
  ```

2. Install dependencies for the server
  ```bash
  cd server
  npm install
  ```

3. Run the server
  ```bash
  npm run dev
  ```

4. Visit http://localhost:3000/view-events to view the application
  ```bash
  /view-events: to see all events
  /create-event: to create a new event
  /delete-event: to delete an event
  ```

## Reflection
Provide a brief overview of the submitted content, and any challenges and/or successes you had.
Having not used vanilla HTML in a while, it was weird to not have inline CSS (like with Tailwind) or not have to use frameworks like React or Vue. Additionally, not using component libraries like Shadcn to bootstrap the UI meant that the UI was not as polished as it could be but this is understandble as this is part 1 of the entire project and somethign that can be polished in the future. 

A challenge we faced was communication between all group members and ensuring that we are able to work on tasks together. Particularly, we had instances where 2 members worked on the same file and this caused Git conflicts that had to be resolved. While this was not a challenge as the codebase is small, it will become a challenge as the codebase grows. So we need to find a way to better communicate and coordinate our work and also ensure that all members are working with the latest changes. 

Another challenge we faced was figuring out how to architect the aplication to ensure that it runs with minimal commmands. Usually when you have a Javascript framework for the frotnend, you are able to run the application using "npm run dev" after installing dependendcies. However, with this application, since we are using vanilla HTML, we had to find a way to serve up the HTML files using a better method than having the users open the HTML files directly in their browser. We eventually landed on serving the HTML files from the server itself. This was achieved by the 3 GET endpoints in server.js: GET /view-events, GET /create-event, and GET /delete-event. These endpoints on the server return the HTML files from the client folder. This means that all a user has to do is run "npm install" in the server folder and then "npm run dev" to run the server. 


We have submitted the server.js file, events.json file and the client folder containing the html files. 

### server.js
This is the primary server file and the entry point for the backend server. 

It uses Express.js to create a server and provides the following endpoints:
  - GET /view-events
    - This endpoint returns the get.html file which contains all the current events stored in the events.json file.
  - GET /api/events
    - This endpoint returns the events in the events.json file as a JSON response.
  - GET /create-event
    - This endpoint returns the create.html file which allows users to create new events.
  - POST /api/events
    - This endpoint creates a new event and adds it to the events.json file.
  - GET /delete-event
    - This endpoint returns the delete.html file which allows users to delete events.
  - DELETE /api/events/:id
    - This endpoint deletes an event from the events.json file.

### events.json
This file contains the events that are stored in the server (acts as a temporary database). It is a JSON file that contains an array of events, where each event has the following properties:
  - id
  - eventName
  - eventLocation
  - eventDate
This is the file used in server.js to store and retrieve events.

### client
This directory contains the client-side files for the application. It contains the following files:
  - get.html
  - create.html
  - delete.html
  - style.css
These files are used to display the events and allow users to create and delete events.