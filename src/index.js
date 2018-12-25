
export default class NoBackend{
	constructor(){
      if (this.self===null) {
          this.self = this;
          console.log('Not singleton!')
      }
      return this.self;
    }
    db(options) {
         return function(req,res) {
             console.log(options)
         }
    }
    files(options)  {
        return function(req,res) {
            console.log(options)
        }
    }
    auth(options)  {
        return function(req,res) {
            console.log(options)
        }
    }

};
