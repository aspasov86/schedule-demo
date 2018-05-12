import React, { Component } from 'react';

import './Schedule.css';
import { DAYS, MONTHS } from '../../helpers/constants';
import getCalendar from '../../helpers/calendar';
import getCurrentWeekNo from '../../helpers/currentWeek';
import Cell from '../Cell/Cell';
import avatarImg from '../../assets/images/avatar.png';
import Modal from '../../components/UI/Modal/Modal';
import Aux from '../../hoc/Aux/Auxiliary';
import NewEmployee from '../NewEmployee/NewEmployee';
import axios from '../../axios-instance';
import Employee from '../../components/Employee/Employee';
import AddShift from '../AddShift/AddShift';

class Schedule extends Component {
  year = new Date().getFullYear();

  state = {
    calendar: getCalendar(this.year),
    currentWeekNo: getCurrentWeekNo(getCalendar(this.year)),
    currentDay: {
      weekDay: DAYS[new Date().getDay()],
      monthDay: new Date().getDate(),
      month: MONTHS[new Date().getMonth()]
    },
    employees: null,
    addingEmployee: false,
    employeeAdded: false,
    error: false,
    pickingShift: false,
    shift: null,
    shiftAdded: false,
    allShifts: null
  }

  componentDidMount() {
    //getting employees
    axios.get('/employees.json')
      .then(res => {
        const employees = [];
        for (let key in res.data) {
          employees.push({
            id : key,
            firstName: res.data[key].firstName,
            lastName: res.data[key].lastName,
            avatar: res.data[key].avatar ? avatarImg : null,
            position: res.data[key].position
          });
        }
        this.setState({employees});
      })
      .catch(err => {
        this.setState({error: true});
      })
    //getting shifts
    this.setState({shiftAdded: false});
    axios.get('/shifts.json')
      .then(res => {
        const allShifts = [];
        for (let key in res.data) {
          allShifts.push({...res.data[key]});
          this.setState({allShifts});
        }
      })
      .catch(err => {
        this.setState({error: true});
      });
  }

  componentDidUpdate() {
    //ajax for employees
    if (this.state.employeeAdded) {
      this.setState({employeeAdded: false});
      axios.get('/employees.json')
        .then(res => {
          const employees = [];
          for (let key in res.data) {
            employees.push({
              id : key,
              firstName: res.data[key].firstName,
              lastName: res.data[key].lastName,
              avatar: res.data[key].avatar ? avatarImg : null,
              position: res.data[key].position
            });
          }
          this.setState({employees});
        })
        .catch(err => {
          this.setState({error: true});
        })
    }
    //ajax for shifts
    if (this.state.shiftAdded) {
      this.setState({shiftAdded: false});
      axios.get('/shifts.json')
        .then(res => {
          const allShifts = [];
          for (let key in res.data) {
            allShifts.push({...res.data[key]});
            this.setState({allShifts});
          }
        })
        .catch(err => {
          this.setState({error: true});
        });
    }
  }

  goBackHandler = () => {
    const weekBefore = this.state.currentWeekNo - 1;
    this.setState({ currentWeekNo: weekBefore});
  }

  goForwardHandler = () => {
    const weekForward = this.state.currentWeekNo + 1;
    this.setState({ currentWeekNo: weekForward});
  }

  addingEmployeeWindowHandler = () => {
    this.setState({addingEmployee: true})
  }

  closeWindowHandler = () => {
    this.setState({addingEmployee: false, error: false, pickingShift: false});
  }

  pickShiftHandler = (shift) => {
    this.setState({pickingShift: true, shift});
  }

  employeeIsAdded = () => {
    this.setState({employeeAdded: true});
  }

  shiftIsAdded = () => {
    this.setState({shiftAdded: true});
  }

  render() {
    const currentWeek = this.state.calendar[this.state.currentWeekNo];
    const theadDays = currentWeek.map(day => {
      if (day.monthDay === this.state.currentDay.monthDay && day.month === this.state.currentDay.month && day.weekDay === this.state.currentDay.weekDay) {
        return (
          <th
            className="topRow"
            key={day.monthDay + day.weekDay + day.month}
            style={{color: 'red'}}>
            {day.weekDay}, {day.month} {day.monthDay}
          </th>
        );
      } else {
        return (
          <th
            className="topRow"
            key={day.monthDay + day.weekDay + day.month}>
            {day.weekDay}, {day.month} {day.monthDay}
          </th>
        );
      }
    })
    const cells = this.state.employees ? this.state.employees.map(employee => {
      return (
        <tr key={employee.firstName + employee.lastName}>
            <Employee employee={employee} />
          {currentWeek.map(day => (
            <Cell
              key={day.monthDay + day.weekDay + day.month}
              day={day}
              today={this.state.currentDay}
              employee={employee}
              pickShift={this.pickShiftHandler}
              disabled={this.state.addingEmployee || this.state.pickingShift}
              shifts={this.state.allShifts}/>
          ))}
        </tr>
      );
    }) : null;

    //handling errors with the Modal
    let modal = this.state.error ? (
      <Modal
        closeWindow={this.closeWindowHandler}
        error>
        Network error...
      </Modal>
    ) : null;
    //adding Employees with Modal
    if (this.state.addingEmployee && !this.state.error) {
        modal = (
          <Modal closeWindow={this.closeWindowHandler}>
            Adding a new Employee...
            <NewEmployee
              closeWindow={this.closeWindowHandler}
              employeeAdded={this.employeeIsAdded}/>
          </Modal>
        );
      } else if (this.state.pickingShift) {
        modal = (
          <Modal closeWindow={this.closeWindowHandler}>
            Creating a Shift for {this.state.shift.weekDay}, {this.state.shift.month} {this.state.shift.monthDay}...
            <AddShift
              shift={this.state.shift}
              shiftAdded={this.shiftIsAdded}
              closeWindow={this.closeWindowHandler}/>
          </Modal>
        );
      }

    return (
      <Aux>
      <table className="Schedule">
        <thead>
          <tr>
            <th className="topRow">
              <p>
                {currentWeek[0].month} {currentWeek[0].monthDay}, {this.year} -
                {currentWeek[currentWeek.length-1].month} {currentWeek[currentWeek.length-1].monthDay}, {this.year}
              </p>
              <button onClick={this.goBackHandler} disabled={this.state.currentWeekNo < 1}> - </button>
              <button onClick={this.goForwardHandler} disabled={this.state.currentWeekNo > 51}> + </button>
            </th>
            {theadDays}
          </tr>
        </thead>
        <tbody>
        {cells}
          <tr>
            <th>
            <button
              onClick={this.addingEmployeeWindowHandler}
              disabled={this.state.addingEmployee}>Add Employee</button>
            </th>
          </tr>
        </tbody>
      </table>
        {modal}
      </Aux>
    );
  }
}

export default Schedule;
