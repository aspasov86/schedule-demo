import React, { Component } from 'react';
import axios from '../../axios-instance';

class NewEmployee extends Component {
  state = {
    employee: {
      firstName: '',
      lastName: '',
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
        console.log(error);
      })
  }

  render() {
    return (
      <form onSubmit={this.addEmployeeHandler}>
        <input
          type="text"
          name="firstName"
          placeholder="Your First Name"
          onChange={event => this.inputChangedHandler(event, 'firstName')} />
        <input
          type="text"
          name="lastName"
          placeholder="Your Last Name"
          onChange={event => this.inputChangedHandler(event, 'lastName')} />
        <select onChange = {event => this.inputChangedHandler(event, 'position')}>
          <option>Employee</option>
          <option>Supervisor</option>
          <option>Integration specialist</option>
          <option>Support Technician</option>
          <option>Floor Support</option>
          <option>Graphic Designer</option>
        </select><br/>
        <button>Add Employee</button>
      </form>
    );
  }
}

export default NewEmployee;
