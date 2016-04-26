import MockFirebase from '../../app/scripts/mock_firebase';

window.MockFirebase = MockFirebase;

describe('MockFirebase', function(){

  var fb;

  before(function() {
    window.localStorage.mockFB = null; //clear
    fb = new MockFirebase('https://myapp.firebaseapp.com');
  });

  after(function() {
    fb.removeAllListeners();
    window.localStorage.mockFB = null; //clear
  });

  describe('init', function(){

    it('should start empty', function(done) {
      fb.once('value', function(snapshot) {
        console.log('gotValue', snapshot);
        expect(snapshot.val()).to.equal(null);
        done();
      });
    });

  });

  describe('Root ops', function() {
    it('should let data be saved', function(done) {

      var val = 'meow!';

      fb.once('value', function(snapshot) {
        expect(snapshot.val()).to.equal(null);

        fb.set(val);

        fb.once('value', function(snapshot) {
          expect(snapshot.val()).to.equal(val);
          done();
        });
      });

    });
  });

  describe('nested ops', function(){
    it('should update nested operations', function(done){

      var child1 = fb.child('child1');
      var child2 = child1.child('child2');

      child2.once('value', function(snapshot){
        expect(snapshot.val()).to.equal(null);

        fb.set({child1: {child2: 'yay'}});

        child2.once('value', function(snapshot){
          expect(snapshot.val()).to.equal('yay');
          done();
        });
      });
    });
  });

  describe('arrays', function(){
    it('should allow adding items', function(done){

      var list = fb.child('list');
      list.once('item_added', function(snapshot){
        expect(snapshot.val()).to.equal('one');
        list.once('item_added', function(snapshot){
          expect(snapshot.val()).to.equal('two');
          
          list.once('value', function(snapshot){
            // expect(snapshot.val()).to.be.an(Object);
            var values = [];
            var data = snapshot.val();
            for(var i = 0; i<data.length; i++){
              values.push(data[i]);
            }
            expect(snapshot.val()).to.equal({a: 'one', b: 'two'});
            // var values = snapshot.val().map(function(e,i,a){ return e; });
            expect(values).to.equal(['one', 'two']);
            done();
          });

        }); 
        list.push('two');       
      });
      list.push('one');
    });
  });
});
