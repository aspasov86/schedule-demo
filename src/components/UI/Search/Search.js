import React from 'react';

const search = props => {
  const options = props.employees ? props.employees.map(employee => {
    return (
      <option
        key={employee.id}
        value={employee.firstName + " " + employee.lastName} />
    );}) : null;
  return (
    <div>
      <input
        type="text"
        name="employee"
        list="employees"
        placeholder="Filter per Employee"
        onChange={props.filter}/>
      <datalist id="employees">
        {options}
      </datalist>
    </div>
  );
}

export default search;
