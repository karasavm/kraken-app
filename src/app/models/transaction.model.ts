import {Member} from './member.model';
import {Payment} from './payments.model';



export class Transaction {

  static JSONtoObject(body): Transaction {

    return new Transaction(body.id, body.name, body.payments, body.createdAt, body.type);

  };

  static transferToPayments(from: string, to: string, amount: number) {
    const payments = [];

    payments.push({member: from, amount: amount, debt: 0});
    payments.push({member: to, amount: 0, debt: amount});
    return payments;
  }

  static paymentsToTransfer(payments: any[]) {
    if (payments.length === 0) {
      return {
        from: '',
        to: '',
        amount: null
      }
    }
    if (payments[0].debt === 0) {
      // from
      return {
        from: payments[0].member,
        amount: payments[0].amount,
        to: payments[1].member
      }
    } else {
      return {
        from: payments[1].member,
        amount: payments[0].debt,
        to: payments[0].member
      };
    }
  }

  constructor(public id: string,
              public name: string,
              public payments: Payment[],
              public createdAt: string,
              public type: string) {

  }

  calcTotalAmount() {
    let sum = 0;
    for (let i = 0; i < this.payments.length; i++) {
      sum += this.payments[i].amount;
    }

    return sum;
  }

  calcDebts() {
    console.log(this.name, this.payments.length)
    if (this.payments.length === 0) {
      return null;
    }

    const res = {};

    let amountSum = 0;

    let manualNum = 0;
    let manualSum = 0;

    for (let i = 0; i < this.payments.length; i++) {
      amountSum += this.payments[i].amount;

      // manual headerButton
      if (this.payments[i].debt >= 0) {
        manualSum += this.payments[i].debt;
        manualNum ++;
      }
    }


    let autoValue = 0;
    if ( (this.payments.length - manualNum) > 0 ) {
      autoValue = (amountSum - manualSum) / (this.payments.length - manualNum);
    }


    for (let i = 0; i < this.payments.length; i++) {
      let debt, expenses;

      if (this.payments[i].debt >= 0) {
        debt = this.payments[i].amount - this.payments[i].debt;
        expenses = this.payments[i].debt;
      } else {
        debt = this.payments[i].amount - autoValue;
        expenses = autoValue;
      }

      res[this.payments[i].member] = {
        debt:  debt,
        expenses: expenses
      };
    }

    return res;

  }




}
// var paymentSchema = new mongoose.Schema({
//   member: {type: mongoose.Schema.Types.ObjectId, required: [true, "can't be blank"]},
//   amount: {
//     type: Number,
//     default: 0,
//     validate: {
//       validator: function(v) {return v >= 0;},
//       message: "can't be negative"
//     }
//   },
//   debt: {
//     type: Number,
//     default: -1,
//     validate: {
//       validator: function(v) {return v>=0 || v==-1;},
//       message: "must be positive or 0 or -1"
//     }
//   }
//   // votes: [voteSchema]
// });
//
//
// var typeEnums = ["general", "byFor", "give"];
// // Document schema for polls
// var TransactionSchema = new mongoose.Schema({
//   title: { type: String, required: [true, "can't be blank"]},
//   //group: {type: mongoose.Sche ma.Types.ObjectId, ref: 'Group'},
//   payments: [paymentSchema],
//   type: {type: String, enum: {values: typeEnums,message: "must be on of ["+typeEnums+"]"}, required: [true, "can't be blank"]}
//
// }, {timestamps: true});
