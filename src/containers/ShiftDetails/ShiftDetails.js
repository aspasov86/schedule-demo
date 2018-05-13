import React from 'react';
import { OPTIONS } from '../../helpers/constants';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

const shiftDetails = props => {

  let matchShifts = [];
  let employeesList = [];
  for (let i = 0; i < props.shifts.length; i++) {
    if (props.shifts[i].startTime === props.shift.startTime && props.shifts[i].endTime === props.shift.endTime && props.shifts[i].month === props.shift.month && props.shifts[i].monthDay === props.shift.monthDay) {
      matchShifts.push(props.shifts[i]);
    }
  }
  if (matchShifts) {
    for (let i = 0; i < props.employees.length; i++) {
      for (let u = 0; u < matchShifts.length; u++) {
        if (props.employees[i].id === matchShifts[u].id) {
          employeesList.push(`${props.employees[i].firstName} ${props.employees[i].lastName}`);
        }
      }
    }
  }
  return (
    <div>
      <ListGroup>
        <ListGroupItem bsStyle="info">Shift Name: {props.shift.shiftName ? props.shift.shiftName : "[blank]"}</ListGroupItem>
        <ListGroupItem bsStyle="success">for {props.shift.weekDay}, {props.shift.month} {props.shift.monthDay}</ListGroupItem>
        <ListGroupItem bsStyle="info">Shift starts at: {OPTIONS[props.shift.startTime].option}</ListGroupItem>
        <ListGroupItem bsStyle="info">Shift ends at: {OPTIONS[props.shift.endTime].option}</ListGroupItem>
        <ListGroupItem bsStyle="success">
          Employees working this shift:
          <ul>
            {employeesList.map(emp => <li key={emp}>{emp}</li>)}
          </ul>
        </ListGroupItem>
      </ListGroup>
    </div>
  );
}

export default shiftDetails;
