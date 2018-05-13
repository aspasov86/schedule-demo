import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import './App.css';
import Schedule from './containers/Schedule/Schedule';
import getCalendar from './helpers/calendar';
import getCurrentWeek from './helpers/currentWeek';

class App extends Component {
  year = new Date().getFullYear();

  state = {
    currentWeekNo: getCurrentWeek(getCalendar(this.year))
  }

  render() {
    console.log(this.state.currentWeekNo);
    return (
      <BrowserRouter>
        <div className="App">
          <Switch>
            <Route path="/:id" render={() => <Schedule currentWeekNo={this.state.currentWeekNo} />} />
            <Redirect from="/" to={"/" + this.state.currentWeekNo} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
