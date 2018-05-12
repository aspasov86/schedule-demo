import React, { Component } from 'react';

import { OPTIONS } from '../../helpers/constants';
import './Cell.css'

class Cell extends Component {
  render() {
    let style = ["Cell", "regular"];
    if (this.props.day.monthDay === this.props.today.monthDay && this.props.day.month === this.props.today.month && this.props.day.weekDay === this.props.today.weekDay) {
      style[1] = "today";
    }
    const shift = {
      ...this.props.day,
      id : this.props.employee.id
    }
    const blankCell = (
      <td
        className={style.join(' ')}
        onClick={() => !this.props.disabled ? this.props.pickShift(shift) : null}
        disabled={this.props.disabled}>
        {this.props.day.month} {this.props.day.monthDay}<br/>
        {this.props.employee.lastName}
      </td>
    );
    let shiftCell = null;
    if (this.props.shifts) {
      for (let i = 0; i < this.props.shifts.length; i++) {
        if (this.props.shifts[i].id === this.props.employee.id && this.props.shifts[i].month === this.props.day.month && this.props.shifts[i].monthDay === this.props.day.monthDay && this.props.shifts[i].weekDay === this.props.day.weekDay) {
          shiftCell = (
            <td
              key={this.props.employee.id + this.props.day.month + this.props.day.monthDay + this.props.day.weekDay}
              className={style.join(' ')}>
              <div>{OPTIONS[this.props.shifts[i].startTime]} - {OPTIONS[this.props.shifts[i].endTime]}</div>
            </td>
          );
        }
      }
    }

    return shiftCell ? shiftCell : blankCell;
  }
}

export default Cell;
