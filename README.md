## Overview
This web application is meant to serve as a platform for users to create and manage their events. Having run into issues with coordinating events and planning pickup sports games with friends, we decided to create this application to help users like us coordinate event planning. It currently allows users to create events (pickup sports games, watch parties, community gathering, etc), view all the events, and delete events.

The vision for this application centers around 3 core entities:
  1. Events:
  Events will be the primary entity in the application and the core focal point. Events will have a title, description, start and end time, location, and type (this can also be expanded later). Events will also have a creator and a list of attendees.An event can be public (anyone on the application can register to attend) or private (only the creator and invited users can register to attend). An event can be in-person or virtual, based on the creator's preference. An event can also be cancelled, in which case it will be removed from the list of events. 
  The application will allow users to view all the events and filter them by date, location, and type. 
  2. Users:
  Users will be the secondary entity in the application and will be used to track the creator and attendees of events. Users will have a username, email, and password. The application will allow users to invite their friends and family to their events, and also allow users to join events created by others. Users can create many events and also join many events. 
  3. Predictions:
  Additionally, we want to allow users to engage in friendly wagers with one another by enabling users to place predictions on anything related to an event. For example, if an event is a Super Bowl watch party, users can place predicitons on things like final score, MVP, yardage for a player, etc. Users will not be able to exchange money for their prediciotns in the application, but it is meant to serve as a way to engage users if they wish to do so. Users will be able to view the predictions of other users and also vote on their predictions. 
  This will work by giving the event creator an option to toggle on the prediction feature for their event. If this is enabled, the creator can create topics that useres can place predictions on.
Future Considerations:
  1. Security & Profiles:
  Currently, any user can delete any event. By implementing the profiles feature fully, we will be able to ensure that only an admin of the event can delete or alter details.
  2. Customizable Event Pages:
  Would allow the user to click on an event to learn more information about the format, formality, of the event along with any other details.
  3. Predictions:
  Allow users to make predictions on results of event (if it is a game of some kind)


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

3. Run MongoDB
  MacOS: brew services start mongodb/brew/mongodb-community
    - This will start MongoDB as a background process
    - Connect to this instance via the MongoDB Compass application
    - To stop it, run: brew services stop mongodb/brew/mongodb-community
  Windows: not needed as its a background process

4. Run the server
  ```bash
  npm run start
  ```
  - Server will seed the database if there is no data in the database

5. Visit backend server at http://localhost:8080/ to view the server

6. Install dependencies for the client
  ```bash
  cd client
  npm install
  ```

7. Run the client
  ```bash
  npm run dev
  ```

8. Visit http://localhost:5173/ to view the application
  ```bash
  /: to see all events
  /login: to sign in
  /register: to create an account
  /profile: to view your own events
  /create: to create a new event
  /delete: to delete an event
  ```

### Authentication
The homepage stays public so anyone can browse events without logging in.
Creating events, joining events, and deleting events now require a signed-in account.
Each user has their own profile data, including events they created and events they joined.

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

## Reflection
For A2, we really aimed to get a minimum viable product out there. As a result, users can now add, remove, and view events from a real database. 

Something our group particularly struggled with in this assignment was version control. In the previous lab, we all simply committed the code to main and took turns submitting. For this lab, we ensured that we were committing code to branches and then merging them to the main branch - resembling a more professional and clean co-development experience. This proved to be problematic as we had to often resolve merge conflicts and issues like forgetting to remove our node_modules folder before committing code. To combat this issue - we simply added node_modules to our repository's gitignore. 

Thanks to the previous lab, we were all very familiar with MongoDB and Mongoose, and were easily able to make our logic work on a real database instead of using a json file. We were also familiar with error handling needed to handle edge cases for working with our new database. 