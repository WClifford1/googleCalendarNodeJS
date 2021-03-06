## Google Calendar API Booking System

### Description:

Appointment booking system which uses the Google Calendar API.<br>
Appointments are 40 minutes long and have fixed times, starting from 9–9:40am, with a 5 minute break between appointments.<br>
Appointments can only be booked during weekdays between 9am and 6pm<br>
Appointments can only be made at least 24 hours in advance.<br>
Appointments cannot be double-booked.<br>
All appointments are in UTC time.<br>

### Directions:

Step 1: go to https://developers.google.com/calendar/quickstart/nodejs, select 'Enable the Google Calendar API' and click 'Download Client Configuration'. This will download credentials.json - save this into the project directory

<p align="center">
    <img src="./screenshots/screenshot1.png" width="45%" />
    <img src="./screenshots/screenshot2.png" width="45%" />
</p>

Step 2: npm i and node .<br>

Step 3: Click on the link in the console to authorize the app to use the Google Calendar API for your credentials.<br>

#### `GET http://localhost:3000/timeslots?year=yyyy&month=mm&day=dd`

Displays all available timeslots for the day

#### `GET http://localhost:3000/days?year=yyyy&month=mm`

Displays weather or not all days of the month currently have available timeslots

<p align="center">
    <img src="./screenshots/screenshot3.png" width="45%" />
    <img src="./screenshots/screenshot4.png" width="45%" />
</p>

#### `POST http://localhost:3000/book?year=yyyy&month=mm&day=dd&hour=hh&minute=mm`

Books an appointment by creating an event in the calendar, provided that the timeslot is available. The booking will now be in your Google Calendar.

<p align="center">
    <img src="./screenshots/screenshot5.png" />
</p>
<p align="center">
    <img src="./screenshots/screenshot6.png" />
</p>
