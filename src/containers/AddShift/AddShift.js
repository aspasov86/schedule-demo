import React, { Component } from 'react';

import { OPTIONS } from '../../helpers/constants';
import axios from '../../axios-instance';


class AddShift extends Component {
  state = {
    from : [],
    to : [],
    shiftName: '',
    start: 32,
    finish: 64,
    newShift: null
  }

  componentWillMount() {
    let arr = this.generateOptionsValues(0, 0);
    this.setState({from: arr[0], to: arr[1]});
  }

  generateOptionsValues(indexFrom, indexTo) {
    let timeFrom = [];
    let timeTo = [];
    for (let i = indexFrom; i < OPTIONS.length; i++) {
        timeFrom.push(OPTIONS[i]);
    }
    for (let i = indexTo; i < OPTIONS.length; i++) {
      timeTo.push(OPTIONS[i]);
    }
    for (let i = 0; i < indexTo - 1; i++) {
      timeTo.push(OPTIONS[i])
    }
    return [timeFrom, timeTo];
  }

  shiftStartsAtHandler = event => {
    //adjisting the "finish" time first as it can't be the same as start
    let startAsNumber = parseInt(event.target.value, 10);
    let indexTo = startAsNumber + 1;
    let arr = this.generateOptionsValues(0, indexTo);
    //fixing the options and updating the time of the shift
    this.setState({from: arr[0], to: arr[1], start: startAsNumber, finish: indexTo});
  }

  shiftFinishesAtHandler = event => {
    let finishAsNumber = parseInt(event.target.value, 10);
    this.setState({finish: finishAsNumber});
  }

  changeShiftName = event => {
    this.setState({shiftName: event.target.value});
  }

  createNewShift = event => {
    event.preventDefault();
    const newShift = {
      ...this.props.shift,
      shiftName: this.state.shiftName,
      startTime: this.state.start,
      endTime: this.state.finish
    }
    this.setState({newShift: newShift});
    axios.post('/shifts.json', newShift)
      .then(res => {
        this.props.shiftAdded();
        this.props.closeWindow();
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    let optionsFrom = this.state.from.map((opt, i) => {
      return (
        <option
          key={opt + i}
          value={i}>{opt}</option>
      );
    })
    let optionsTo = this.state.to.map((opt, i) => {
      return (
        <option
          key={opt + i}
          value={i}>{opt}</option>
      );
    })

    return(
      <form onSubmit={this.createNewShift}>
        <input
          type='text'
          name="shiftName"
          placeholder="Shift name"
          onChange={this.changeShiftName}/><br/>
        <select
          onChange={this.shiftStartsAtHandler}
          defaultValue={this.state.start}>{optionsFrom}</select>
        <select
          onChange={this.shiftFinishesAtHandler}
          defaultValue={this.state.finish}>{optionsTo}</select><br/>
        <button>Create shift</button>
      </form>
    );
  }
}

export default AddShift;
