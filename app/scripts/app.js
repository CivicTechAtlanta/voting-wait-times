import React from 'react';

import WaitTime from './waitTime';

export default class App extends React.Component {
  constructor(props){
    super(props);

  }
  render(){
    return (
      <div>
        <WaitTime name='name' waitTime='red' lastUpdated={new Date()} />
        <hr />
        <div className="jumbotron">
        </div>
      </div>
    );
  }
}

/*
      <!--<div class="header">
        <ul class="nav nav-pills pull-right">
          <li class="active"><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
        <h3 class="text-muted">Voting Wait Times</h3>
      </div> -->

          <h1>Polling Station Wait Times</h1>

            <form className="user-form">
              <p>Select whether you are:</p>
              <button className="btn btn-primary" role="button">A Volunteer</button>
              <button className="btn btn-primary" role="button">A Voter (non-volunteer)</button>
           </form>

          <div className="col-md-4 col-md-4 col-md-4 col-xs-12">
              <input type="text" className="text email-field" autocomplete="off" placeholder="Enter your email" required/>
              <input type="text" className="text precinct-field" maxlength="3" autocomplete="off" placeholder="Your precinct #" required/>
              <input type="text" className="text state-field" maxlength="2" autocomplete="off" placeholder="Your state" required/>
          </div>

          <p className="lead">Select the button that reflects the approximate wait time at this polling station right now.</p>
          <button type="New Game" className="btn btn-primary btn-wait" wait="0" role="button">No Line (whoo hoo!)</button>
          <button type="New Game" className="btn btn-success btn-wait" wait="1" role="button">Small Line (Less than 10 min)</button>
          <button type="New Game" className="btn btn-info btn-wait" wait="2" role="button">Medium Line (10-45 min)</button>
          <button type="New Game" className="btn btn-warning btn-wait" wait="3" role="button">Long Line (Over 45 min)</button>
          <button type="New Game" className="btn btn-danger btn-panic" role="button">Panic, help!</button>
*/
