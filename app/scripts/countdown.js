import React from 'react';

export default class Countdown extends React.Component {
  constructor(props){
    super(props);
    this.state = {secondsElapsed: 0};
    this.tick = this.tick.bind(this);
  }
  tick(){
    if(this.props.running){
      this.setState({secondsElapsed: this.state.secondsElapsed + 1});
    }
  }
  reset(){
    this.setState({secondsElapsed: 0});
  }
  componentDidMount(){
    this.interval = setInterval(this.tick, 1000);
  }
  componentWillUnmount(){
    clearInterval(this.interval);
  }
  render(){
    if(!this.props.running){
      return null;
    }
    const remaining = this.props.start - this.state.secondsElapsed;
    if(remaining < 0){
      return (
        <div className="timer overtime">Out of time!</div>
      );
    }else if(remaining <= 5){
      return (
        <div className="timer closetime">Remaining: {remaining}</div>
      );
    }else {
      return (
        <div className="timer">Remaining: {remaining}</div>
      );
    }
  }
}
