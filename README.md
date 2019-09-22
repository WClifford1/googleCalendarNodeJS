## 2hats NodeJS Assessment by William Clifford
### `npm i and npm start:`

<br>

### `Directions:`

All appointments are 40 minutes long and have fixed times, starting from 9–9:40am, with a 5 minute break between appointments
Appointments can only be booked during weekdays from 9 am to 6 pm
Bookings can only be made at least 24 hours in advance
Appointments cannot be booked in the past
All bookings use UTC time
<br>
## `Once the server is running`:
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