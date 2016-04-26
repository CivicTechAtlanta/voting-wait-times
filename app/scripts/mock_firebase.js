import Events from 'events';
import _ from 'lodash';

let data = JSON.parse(window.localStorage.mockFB || "null") || {};

const dataChangeEmitter = new Events.EventEmitter();

function set(keys, value){
  console.log("set", keys, value);
  if(value === undefined){
    value = null;
  }
  if(keys.length === 0){
    dataChangeEmitter.emit('__root', value);
    window.localStorage.mockFB = JSON.stringify(value);
    return;
  }
  let subdata = data;
  const lastKey = keys.pop();
  for(let i = 0; i < keys.length; i++){
    const key = keys[i];
    if(!subdata[key]){
      subdata[key] = {};
    }
    subdata = subdata[key];
  }
  const prevValue = _.merge({}, subdata[lastKey]);
  const wasObject = typeof(subdata[lastKey]) === 'object';
  const isObject = typeof(value) === 'object';

  subdata[lastKey] = value;
  window.localStorage.mockFB = JSON.stringify(data);
  const path = keys.join('/');

  if(wasObject || isObject){
    const prevKeys = wasObject ? _.keys(prevValue) : [];
    const newKeys = isObject ? _.keys(value) : [];
    const addedKeys = _.without(newKeys, prevKeys);
    const removedKeys = _.without(prevKeys, newKeys);
    const changedKeys = _.filter(_.xor(prevKeys, newKeys), function(key){
      return !_.isEqual(value[key], prevValue[key]);
    });

    console.log('set ->', prevValue, value, addedKeys, removedKeys, changedKeys);

    dataChangeEmitter.emit('add:' + path, addedKeys, value);
    dataChangeEmitter.emit('remove:' + path, removedKeys, prevValue);
    dataChangeEmitter.emit('change:' + path, changedKeys, value);
  }

  dataChangeEmitter.emit(path, value);
  console.log("after set", data, value);
}

function get(keys){
  if(keys.length === 0){
    return data;
  }
  let subdata = data;
  const lastKey = keys.pop();
  for(let i = 0; i < keys.length; i++){
    const key = keys[i];
    if(subdata[key] === null || subdata[key] === undefined){
      return null;
    }
    subdata = subdata[key];
  }
  console.log("get", keys, lastKey, subdata[lastKey]);
  return (subdata[lastKey] === undefined ? null : subdata[lastKey]);
}

function generateKey(){
  return (new Date()).getTime().toString();
}


class Snapshot {
  constructor(value){
    this.value = value;
    this.val = this.val.bind(this);
  }
  val(){
    return this.value === undefined ? null : this.value;
  }
}

//TODO: handle auth methods, online/offline simulation, priority, transactions, child_moved

export default class MockFirebase extends Events.EventEmitter {
  constructor(url){
    super();
    this.keys = url.replace(/https?:\/\//, '').split('/').filter( p => { return p && p.length > 0; });
    let path = '';
    dataChangeEmitter.on('__root', (newVal) => {
      this.emit('value', new Snapshot(newVal));
    });
    this.keys.forEach(key => {
      path += '/' + key;
      // listen to parent changes
      dataChangeEmitter.on(path, (newVal) => {
        this.emit('value', new Snapshot(newVal));
      });
    });
    // dataChangeEmitter.on('add:', path, (addedKeys, value) => {
    //   _.forEach(addedKeys, function(key){
    //     this.emit('child_added', new Snapshot(val[key])); //TODO prev child key
    //   });
    // });
    // dataChangeEmitter.on('remove:', path, (removedKeys, oldValue) => {
    //   _.forEach(removedKeys, function(key){
    //     this.emit('child_removed', new Snapshot(oldValue[key]));
    //   });
    // });
    // dataChangeEmitter.on('change:', path, (changedKeys, value) => {
    //   _.forEach(changedKeys, function(key){
    //     this.emit('child_changed', new Snapshot(val[key]));
    //   });
    // });
  }
  cloneKeys(){
    return this.keys.slice(0);
  }
  on(event, callback){
    super.on(event, callback);
    this.emit('value', new Snapshot(get(this.cloneKeys())));
  }
  child(name){
    return new MockFirebase(this.toString() + '/' + name);
  }
  parent(){
    const parentKeys = cloneKeys();
    parentKeys.pop();
    return new MockFirebase(parentKeys.join('/'));
  }
  root(){
    return new Firebase(this.keys[0]);
  }
  name(){
    if(this.keys.length < 2){
      return null;
    }
    return this.cloneKeys().pop();
  }
  key(){
    return this.name();
  }
  toString(){
    return this.keys.join('/');
  }
  set(value, callback){
    console.log('call set', value);
    set(this.cloneKeys(), value);
    if(callback){
      callback(null);
    }
  }
  update(value, callback){
    set(this.cloneKeys(), _.merge({}, get(this.cloneKeys()), value));
    if(callback){
      callback(null);
    }
  }
  push(item, callback){
    const child = this.child(generateKey());
    if(item){
      child.set(item, callback);
    }else if(callback){
      callback(null);
    }
    return child;
  }
  remove(callback){
    this.set(null);
    if(callback){
      callback(null);
    }
  }
}

