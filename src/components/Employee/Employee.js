import React from 'react';
import { Media } from 'react-bootstrap';

const employee = props => {
  return (
      <th>
        <Media>
          <Media.Left>
            <img
              style={{
                border: '1px solid black',
                borderRadius: '5px'}}
              src={props.employee.avatar}
              alt="myAvatar"/>
          </Media.Left>
          <Media.Body style={{width: 'inherit'}}>
            <Media.Heading>{props.employee.firstName} {props.employee.lastName}</Media.Heading>
            <p>({props.employee.position})</p>
          </Media.Body>
        </Media>
      </th>
  );
}

export default employee;
