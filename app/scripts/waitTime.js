import React from 'react';

function waitTimeToString(time){
  switch(time){
    case 0: return 'GREEN';
    case 1: return 'YELLOW';
    case 2: return 'ORANGE';
    case 4: return 'RED';
  }
}

export default class WaitTime extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
      <div className='wait-time-block'>
        <h3 className='precinct-name'>{this.props.name}</h3>
        <h5 className='wait-time-label'>Wait Time:</h5>
        <span className='wait-time label label-default'>{waitTimeToString(this.props.waitTime)}</span>
        <br/>
        <span className='last-updated-label'>Last Updated: </span>
        <span className='last-updated'>{this.props.lastUpdated.toISOString()}</span>
      </div>
    );
  }
}
