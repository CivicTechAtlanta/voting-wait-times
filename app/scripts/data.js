// import Firebase from 'firebase';



// class DataSource  {
//   constructor(){
//     // this.fb = new Firebase('https://.firebaseio.com');
//     // this.fb.child('.info/connected').on('value', snapshot => {
//     //   if(!snapshot.val()){
//     //     console.warn('No connection, falling back to local storage');
//     //     // const state = window.localStorage[pageId];
//     //     // if(state){
//     //     //   render(JSON.parse(state));
//     //     // }else{
//     //     //   render([]);
//     //     // }
//     //   }else{
//     //     console.log('connected to Firebase');
//     //   }
//     // });
//     // this.db = this.fb.child('states');
//     // this.db.on('value', snapshot => {
//     //   const val = snapshot.val();
//     //   if(val){
//     //     this.emit('changed', val);
//     //   }
//     // });
//   }
//   addAllPrecintListener(callback){

//   }

//   // addPrecinctListener(state, precint, callback){
//   //   const precinctNode = this.db.child('states').child('state').child('precincts').child(precint);
//   //   let cb = (snapshot => {
//   //     const data = snapshot.val();
//   //     if(data){
//   //       callback(data);
//   //     }
//   //   });
//   //   this._listeners.push(callback, cb);
//   //   precinctNode.on('value', cb);
//   // }
//   // removePrecinctListener(precint, callback){
//   //   const precinctNode = this.db.child('states').child('state').child('precincts').child(precint);
//   //   precinctNode.off('value', this._listeners[callback]);
//   // }

//   save(states){
//     window.localStorage.states = JSON.stringify(states);
//   }
//   load(){
//     let data = [];
//     if(window.localStorage.states){
//       data = JSON.parse(window.localStorage.states);
//     }else{
//       save(data);
//     }
//     return data
//   }
// }

// // addListener('event', func)
// // removeListener('event', func)

// // Admin -> cares about all data (event: 'change')
// // Wait page -> cares about one precint (event: 'change:[precintId]')

// // '/states/:state/precincts/:id' => {
// //   id: 'XYZ',
// //   state: 'GA',
// //   county: 'Fulton',
// //   location: '1234 Main St',
// //   waitTimes: [{
// //     id: 0,
// //     sender: 'xxxx',
// //     waitTime: 3,
// //     timestamp: '2016-04-26T17:06:55.650Z'
// //   }]
// // }


