## 2hats NodeJS Assessment by William Clifford
### `to run the server`
## `npm i and npm start:`

<br>

### `Description:`
App is a booking system that uses the google calendar API
Allows users to view available timeslots and book appointments.
All appointments are 40 minutes long and have fixed times, starting from 9–9:40am, with a 5 minute break between appointments.
Appointments can only be booked during weekdays between 9am and 6pm
Bookings can only be made at least 24 hours in advance.
All bookings use UTC time.
<br>
## `Once the server is running:`
<br>
## `http://localhost:3000/timeslots?year=yyyy&month=mm&day=dd`
Will show all the available timeslots of the day
<br>
<br>
## `http://localhost:3000/days?year=yyyy&month=mm`
Will show all days of the month that currently have available timeslots
<br>
<br>
## `http://localhost:3000/book?year=yyyy&month=mm&day=dd&hour=hh&minute=mm`
Will create a event in the calendar providing that the timeslot is available and is not taken
<br>