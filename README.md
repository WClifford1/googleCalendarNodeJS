## 2hats NodeJS Assessment by William Clifford

## `npm i and node .`

### `Description:`
This app is an appointment booking system that uses the Google Calendar API.<br>
Users access the API to view available timeslots and book appointments.<br>
All appointments are 40 minutes long and have fixed times, starting from 9–9:40am, with a 5 minute break between appointments.<br>
Appointments can only be booked during weekdays between 9am and 6pm<br>
Appointments can only be made at least 24 hours in advance.<br>
Appointments cannot be double-booked.<br>
All appointments use UTC time.<br>

#### `Once the server is running:`

#### `GET http://localhost:3000/timeslots?year=yyyy&month=mm&day=dd`
Displays all available timeslots for the day
<br>

#### `GET http://localhost:3000/days?year=yyyy&month=mm`
Displays weather or not all days of the month currently have available timeslots
<br>

#### `POST http://localhost:3000/book?year=yyyy&month=mm&day=dd&hour=hh&minute=mm`
Books an appointment by creating an event in the calendar, provided that the timeslot is available.