import {Variable} from "resource:///com/github/Aylur/ags/variable.js";
import Service from "resource:///com/github/Aylur/ags/service.js";

class StackState extends Variable {
  static {
    Service.register(this, {
    }, {
    });
  }

  /** @type string[] */
  items = [];

  /**
  * @param {string} value
  * @constructor
  */
  constructor(value) {
    super(value);
  }

  next(){
    const index = this.items.indexOf(this.value) + 1;
    this.value = this.items[index % (this.items.length)];
  }
  prev(){
    const index = this.items.indexOf(this.value) - 1 + this.items.length;
    this.value = this.items[index % (this.items.length)];
  }
}

export default StackState;
