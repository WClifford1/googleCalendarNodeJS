## 2hats NodeJS Assessment by William Clifford

## `npm i and npm start`

<br>

### `Description:`
This app is a booking system that uses the google calendar API.<br>
Allows users to view available timeslots and book appointments.<br>
All appointments are 40 minutes long and have fixed times, starting from 9–9:40am, with a 5 minute break between appointments.<br>
Appointments can only be booked during weekdays between 9am and 6pm<br>
Appointments can only be made at least 24 hours in advance.<br>
Appointments cannot be double-booked.<br>
All bookings use UTC time.<br>
<br>

#### `Once the server is running:`

#### `http://localhost:3000/timeslots?year=yyyy&month=mm&day=dd`
Will show all the available timeslots for the day
<br>
<br>

#### `http://localhost:3000/days?year=yyyy&month=mm`
Will show all days of the month that currently have available timeslots
<br>
<br>

#### `http://localhost:3000/book?year=yyyy&month=mm&day=dd&hour=hh&minute=mm`
Will book an appointment by creating a event in the calendar, provided that the timeslot is available.
<br>