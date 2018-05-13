import React, { Component } from 'react';

import { OPTIONS } from '../../helpers/constants';
import './Cell.css'

class Cell extends Component {
  render() {
    let style = "Cell";
    if (this.props.day.monthDay === this.props.today.monthDay && this.props.day.month === this.props.today.month && this.props.day.weekDay === this.props.today.weekDay) {
      style = "today";
    }

    let cellColorPosition = null;
    switch (this.props.employee.position) {
      case ('Employee'):
        cellColorPosition = "#E0B0FF";
        break;
      case ('Supervisor'):
        cellColorPosition = "#EBDDE2";
        break;
      case ('Integration specialist'):
        cellColorPosition = "#ECE5B6";
        break;
      case ('Support Technician'):
        cellColorPosition = "#F5F5DC";
        break;
      case ('Floor Support'):
        cellColorPosition = "#99C68E";
        break;
      case ('Graphic Designer'):
        cellColorPosition = "#ffb380";
        break;
      default:
        cellColorPosition = null;
    }


    const shift = {
      ...this.props.day,
      id : this.props.employee.id
    }
    const blankCell = (
      <td
        className={style}
        style={{background: cellColorPosition}}
        onClick={() => !this.props.disabled ? this.props.pickShift(shift) : null}>
      </td>
    );

    let shiftCell = null;
    if (this.props.shifts) {
      for (let i = 0; i < this.props.shifts.length; i++) {
        if (this.props.shifts[i].id === this.props.employee.id && this.props.shifts[i].month === this.props.day.month && this.props.shifts[i].monthDay === this.props.day.monthDay && this.props.shifts[i].weekDay === this.props.day.weekDay) {
          shiftCell = (
            <td
              key={this.props.employee.id + this.props.day.month + this.props.day.monthDay + this.props.day.weekDay}
              className={style}
              style={{background: cellColorPosition}}
              onClick={() => !this.props.disabled ? this.props.checkingShiftDetails(this.props.shifts[i]) : null}>
              <div>{OPTIONS[this.props.shifts[i].startTime].option} - {OPTIONS[this.props.shifts[i].endTime].option}</div>
            </td>
          );
        }
      }
    }
    return shiftCell ? shiftCell : blankCell;
  }
}

export default Cell;
