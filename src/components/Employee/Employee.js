import React from 'react';

import './Employee.css';

const employee = props => {
  return (
      <th>
        <img src={props.employee.avatar} alt="myAvatar"/>
        {props.employee.firstName} {props.employee.lastName} <br/>
        <span>({props.employee.position})</span>
      </th>
  );
}

export default employee;
