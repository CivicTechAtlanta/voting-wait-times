import Events from 'events';

let data = JSON.parse(window.localStorage.mockFB || "null") || {};

const dataChangeEmitter = new Events.EventEmitter();

console.log("data init", data);

function set(inKeys, value){
  console.log("set", inKeys, value);
  if(inKeys.length === 0){
    dataChangeEmitter.emit('__root', '', value);
    window.localStorage.mockFB = JSON.stringify(value);
    console.log("after", window.localStorage.mockFB);
    return;
  }
  const keys = inKeys.slice(0); //copy
  let subdata = data;
  const lastKey = keys.pop();
  for(let i = 0; i < keys.length; i++){
    const key = keys[i];
    console.log("set>", i, key, subdata);
    if(!subdata[key]){
      subdata[key] = {};
    }
    subdata = subdata[key];
  }
  subdata[lastKey] = value;
  const path = keys.join('/');
  dataChangeEmitter.emit(path, path, value);
  window.localStorage.mockFB = JSON.stringify(data);
  console.log("after", window.localStorage.mockFB);
}

function get(keys){
  if(keys.length === 0){
    console.log("getRoot", keys, data);
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
  return subdata[lastKey] || null;
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
    return this.value;
  }
}

export default class MockFirebase extends Events.EventEmitter {
  constructor(url){
    console.log("new mock", url);
    super();
    this.url = url;
    this.keys = url.replace(/https?:\/\//, '').split('/').filter( p => { return p && p.length > 0; });
    let path = '';
    dataChangeEmitter.on('__root', this.onChange);
    for(let i = 0; i < this.keys.length; i++){
      const key = this.keys[i];
      path += '/' + key;
      console.log('addingChangeListener', path);
      dataChangeEmitter.on(path, this.onChange); // listen to parent changes
    }
    this.onChange = this.onChange.bind(this);
    console.log("created mock", this);
  }
  cloneKeys(){
    return this.keys.slice(0);
  }
  on(event, callback){
    super.on(event, callback);
    this.onChange();
  }
  onChange(){
    this.emit('value', new Snapshot(get(this.cloneKeys())));
  }
  child(name){
    return new MockFirebase(this.url + '/' + name);
  }
  set(value){
    console.log('call set', value);
    set(this.cloneKeys(), value);
  }
  push(item){
    const val = get(this.cloneKeys()) || {};
    val[generateKey()] = item;
    set(this.cloneKeys(), val);
    this.emit('item_added', new Snapshot(item)); //TODO other item events
  }
  remove(key){
    const subkeys = this.cloneKeys();
    if(key){
      subkeys.push(key);
    }
    set(subkeys, null);
  }
}

