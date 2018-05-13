import React, { Component } from 'react';
import { FormControl, FormGroup, ControlLabel, Button } from 'react-bootstrap';

import axios from '../../axios-instance';

class NewEmployee extends Component {
  state = {
    employee: {
      firstName: false,
      lastName: false,
      avatar:  true,
      position: 'Employee'
    }
  }

  inputChangedHandler = (event, employeeObjKey) => {
    const employee = {...this.state.employee};
    employee[employeeObjKey] = event.target.value;
    this.setState({employee});
  }

  addEmployeeHandler = event => {
    event.preventDefault();
    const employeeData = {...this.state.employee};
    axios.post('/employees.json', employeeData)
      .then(res => {
        this.props.employeeAdded();
        this.props.closeWindow();
      })
      .catch(error => {
        this.props.errorReport();
      })
  }

  render() {
    return (
      <form onSubmit={this.addEmployeeHandler}>
        <FormGroup>
          <ControlLabel>First Name</ControlLabel>
          <FormControl
            type="text"
            name="firstName"
            onChange={event => this.inputChangedHandler(event, 'firstName')} />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Last Name</ControlLabel>
          <FormControl
            type="text"
            name="lastName"
            onChange={event => this.inputChangedHandler(event, 'lastName')} />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Position</ControlLabel>
          <FormControl
            componentClass='select'
            onChange = {event => this.inputChangedHandler(event, 'position')}>
              <option>Employee</option>
              <option>Supervisor</option>
              <option>Integration specialist</option>
              <option>Support Technician</option>
              <option>Floor Support</option>
              <option>Graphic Designer</option>
          </FormControl>
        </FormGroup>
        <Button type="submit" disabled={!this.state.employee.firstName || !this.state.employee.lastName}>Add Employee</Button>
      </form>
    );
  }
}

export default NewEmployee;
