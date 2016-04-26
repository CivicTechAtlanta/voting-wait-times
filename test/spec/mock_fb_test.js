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

      child2.once('value', function(snapshot) {
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
      list.once('child_added', function(snapshot){
        expect(snapshot.val()).to.equal('one');
        list.once('child_added', function(snapshot){
          expect(snapshot.val()).to.equal('two');
          
          list.once('value', function(snapshot){
            expect(snapshot.val()).to.be.an('object');
            var values = [];
            var data = snapshot.val();
            for(var key in data){
              values.push(data[key]);
            }
            expect(values).to.deep.equal(['one', 'two']);
            done();
          });
        }); 
        list.push().set('two');       
      });
      var res = list.push('one');
      expect(res).to.be.an('object');
      expect(res).to.respondTo('set');
    });

    // it('should allow manipulating items', function(done){

    //   var list = fb.child('list');
    //   list.set({a: 'foo', b: 'bar'});
    //   list.once('value', function(snapshot){
    //     var updates = 0;
    //     list.once('child_added', function(snapshot){
    //       expect(snapshot.val()).to.equal('baz');
    //       updates++;
    //     });
    //     list.once('child_removed', function(snapshot){
    //       expect(snapshot.val()).to.equal('bar');
    //       updates++;
    //     });
    //     list.once('child_changed', function(snapshot){
    //       expect(snapshot.val()).to.equal('oof');
    //       updates++;
    //     });
    //     list.set({a: 'oof', c: 'bar'})
    //     list.once('value', function(snapshot){
    //       expect(snapshot.val()).to.deep.equal({a: 'oof', c: 'bar'});
    //       expect(updates).to.equal(3);
    //       done();
    //     });
    //   });
    // });
  });
});
