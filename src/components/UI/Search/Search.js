import React from 'react';
import { FormGroup, FormControl } from 'react-bootstrap';

const search = props => {
  const options = props.employees ? props.employees.map(employee => {
    return (
      <option
        key={employee.id}
        value={employee.firstName + " " + employee.lastName} />
    );}) : null;
  return (
    <div>
      <FormGroup>
        <FormControl
          type="text"
          name="employee"
          list="employees"
          placeholder="Filter per Employee"
          onChange={props.filter}/>
        <datalist id="employees">
          {options}
        </datalist>
      </FormGroup>
    </div>
  );
}

export default search;

// <input
//   type="text"
//   name="employee"
//   list="employees"
//   placeholder="Filter per Employee"
//   onChange={props.filter}/>
// <datalist id="employees">
//   {options}
// </datalist>
