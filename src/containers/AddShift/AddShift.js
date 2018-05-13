import React, { Component } from 'react';
import { FormControl, FormGroup, ControlLabel, Button } from 'react-bootstrap';

import { OPTIONS } from '../../helpers/constants';
import axios from '../../axios-instance';


class AddShift extends Component {
  state = {
    from : OPTIONS,
    to : OPTIONS,
    shiftName: '',
    start: 0,
    finish: 1,
    newShift: null
  }

  adjustFinishTimeOptions(indexTo) {
    let timeTo = [];
    for (let i = indexTo; i < OPTIONS.length; i++) {
      timeTo.push(OPTIONS[i]);
    }
    for (let i = 0; i < indexTo - 1; i++) {
      timeTo.push(OPTIONS[i]);
    }
    return timeTo;
  }

  shiftStartsAtHandler = event => {
    //adjisting the "finish" time first as it can't be the same as start
    let startAsNumber = parseInt(event.target.value, 10);
    let indexTo = startAsNumber + 1;
    let to = this.adjustFinishTimeOptions(indexTo);
    //fixing the options and updating the time of the shift
    this.setState({to, start: startAsNumber, finish: indexTo});
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
        this.props.closeWindow();
        this.props.reportError();
      });
  }

  render() {
    let optionsFrom = this.state.from.map(opt => {
      return (
        <option
          key={opt.option + opt.value}
          value={opt.value}>{opt.option}</option>
      );
    })
    let optionsTo = this.state.to.map(opt => {
      return (
        <option
          key={opt.option + opt.value}
          value={opt.value}>{opt.option}</option>
      );
    })

    return(
      <form onSubmit={this.createNewShift}>
        <FormGroup>
          <ControlLabel>Shift Name</ControlLabel>{' '}
          <FormControl
            type='text'
            name="shiftName"
            onChange={this.changeShiftName}/>
        </FormGroup>{' '}
        <FormGroup>
          <ControlLabel>Select start and end time</ControlLabel>
          <FormControl
            componentClass='select'
            onChange={this.shiftStartsAtHandler}
            defaultValue={this.state.start}>{optionsFrom}</FormControl>
          <FormControl
            componentClass='select'
            onChange={this.shiftFinishesAtHandler}
            value={this.state.finish}>{optionsTo}</FormControl>
        </FormGroup>
        <Button type="submit">Create Shift</Button>
      </form>
    );
  }
}

export default AddShift;
