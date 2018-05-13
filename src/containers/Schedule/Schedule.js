import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';

// import './Schedule.css';
import { DAYS, MONTHS } from '../../helpers/constants';
import getCalendar from '../../helpers/calendar';
import Cell from '../Cell/Cell';
import avatarImg from '../../assets/images/avatar.png';
import Modal from '../../components/UI/Modal/Modal';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import NewEmployee from '../NewEmployee/NewEmployee';
import axios from '../../axios-instance';
import Employee from '../../components/Employee/Employee';
import AddShift from '../AddShift/AddShift';
import Search from '../../components/UI/Search/Search';
import ShiftDetails from '../ShiftDetails/ShiftDetails';

class Schedule extends Component {
  year = new Date().getFullYear();

  state = {
    calendar: getCalendar(this.year),
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
    allShifts: null,
    checkingShiftDetails: false,
    shiftInDetail: null,
    filterByEmployee: null
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
        this.reportError();
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
        this.reportError();
      });
  }

  filterByEmployeeHandler = event => {
    const string = event.target.value.split(" ");
    const firstName = string[0];
    const lastName = string[1];
    const employees = [...this.state.employees];
    let match = false;
    for (let i = 0; i < employees.length; i++) {
      if (employees[i].firstName === firstName && employees[i].lastName === lastName) {
          match = true;
        this.setState({filterByEmployee: employees[i]});
      }
    }
    if (!match) {
      this.setState({filterByEmployee: null});
    }
  }

  componentDidUpdate() {
    //ajax for updating employee list
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
    }
    //ajax for updating shifts
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
    }
  }

  reportError = () => {
    this.setState({error: true});
  }

  goBackHandler = id => {
    const weekBefore = id - 1;
    this.props.history.push('/' + weekBefore);
  }

  goForwardHandler = id => {
    const weekForward = id + 1;
    this.props.history.push('/' + weekForward);
  }

  addingEmployeeWindowHandler = () => {
    this.setState({addingEmployee: true})
  }

  closeWindowHandler = () => {
    this.setState({addingEmployee: false, error: false, pickingShift: false, checkingShiftDetails: false});
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

  checkingShiftDetailsHandler = (shift) => {
    this.setState({checkingShiftDetails: true, shiftInDetail: shift});
  }

  render() {
    const schedules = this.state.calendar.map((currentWeek, index) => {
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
      let cells = null;
      if (this.state.filterByEmployee) {
        let filter = this.state.filterByEmployee;
        cells = (
          <tr key={filter.firstName + filter.lastName}>
              <Employee employee={filter} />
            {currentWeek.map(day => (
              <Cell
                key={day.monthDay + day.weekDay + day.month}
                day={day}
                today={this.state.currentDay}
                employee={filter}
                pickShift={this.pickShiftHandler}
                disabled={this.state.addingEmployee || this.state.pickingShift}
                shifts={this.state.allShifts}
                checkingShiftDetails={this.checkingShiftDetailsHandler}/>
            ))}
          </tr>
        );
      } else if (this.state.employees) {
        cells = this.state.employees.map(employee => {
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
                            shifts={this.state.allShifts}
                            checkingShiftDetails={this.checkingShiftDetailsHandler}/>
                        ))}
                      </tr>
                    );
                  })
                };

      //handling errors with the Modal
      let modal = this.state.error ? (
        <Modal
          closeWindow={this.closeWindowHandler}
          error>
          Network error...
        </Modal>
      ) : null;
      //adding Employees with Modal
      if (this.state.addingEmployee && !this.state.error && !this.state.pickingShift && !this.state.checkingShiftDetails) {
          modal = (
            <Modal closeWindow={this.closeWindowHandler}>
              Adding a new Employee...
              <NewEmployee
                closeWindow={this.closeWindowHandler}
                employeeAdded={this.employeeIsAdded}
                reportError={this.reportError}/>
            </Modal>
          );
          //creating shifts with modal
        } else if (this.state.pickingShift) {
          modal = (
            <Modal closeWindow={this.closeWindowHandler}>
              Creating a Shift for {this.state.shift.weekDay}, {this.state.shift.month} {this.state.shift.monthDay}...
              <AddShift
                shift={this.state.shift}
                shiftAdded={this.shiftIsAdded}
                closeWindow={this.closeWindowHandler}
                reportError={this.reportError}/>
            </Modal>
          );
          //checking out the shift details with modal
        } else if (this.state.checkingShiftDetails) {
          modal = (
            <Modal closeWindow={this.closeWindowHandler}>
              <h4>Shift Details</h4>
              <ShiftDetails
                shift={this.state.shiftInDetail}
                shifts={this.state.allShifts}
                employees={this.state.employees}/>
            </Modal>
          );
        }

      return (
        <Aux>
        <Table responsive bordered condensed hover striped>
          <thead>
            <tr>
              <th className="topRow">
                <p>
                  {currentWeek[0].month} {currentWeek[0].monthDay}, {this.year} -
                  {currentWeek[currentWeek.length-1].month} {currentWeek[currentWeek.length-1].monthDay}, {this.year}
                </p>
                <Search
                  employees={this.state.employees}
                  filter={this.filterByEmployeeHandler}/>
                <Button onClick={() => this.goBackHandler(index)} disabled={this.props.currentWeekNo < 1}> &#60;= </Button>
                <Button onClick={() => this.goForwardHandler(index)} disabled={this.props.currentWeekNo > 51}> =&#62; </Button>
              </th>
              {theadDays}
            </tr>
          </thead>
          <tbody>
          {cells}
            <tr>
              <th colSpan={currentWeek.length + 1}>
              <Button
                onClick={this.addingEmployeeWindowHandler}
                disabled={this.state.addingEmployee}>Add Employee</Button>
              </th>
            </tr>
          </tbody>
        </Table>
          {modal}
        </Aux>
      );
    })

    return schedules[this.props.match.params.id];
  }
}

export default withRouter(Schedule);
