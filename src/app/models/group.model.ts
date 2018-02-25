
import { Member } from './member.model';
import {Transaction} from './transaction.model';
import {User} from './user.model';

export class Group {
  constructor(public id: string,
              public name: string,
              public members: Member[] = [],
              public transactions: Transaction[] = [],
              public users: User[] = [],
              public creator: User = null) {

  }

  static JSONtoObject(body): Group {
    return new Group(
      body.id,
      body.name,
      body.members.map(member => Member.JSONtoObject(member)),
      body.transactions.map(transaction => Transaction.JSONtoObject(transaction)),
      body.users,
      body.creator
    );

  }

  calcDebts() {

    // init result
    const res = {};
    for (let i = 0; i < this.members.length; i ++) {
      res[this.members[i].id] = {
        debt: 0,
        expenses: 0
      };
    }

    for (let i = 0; i < this.transactions.length; i ++) {
      const debts = this.transactions[i].calcDebts();
      if (debts === null) {continue; }
      for (let j = 0; j < this.members.length; j ++) {
        if (debts[this.members[j].id]) {
          res[this.members[j].id].debt += debts[this.members[j].id].debt;
          res[this.members[j].id].expenses += debts[this.members[j].id].expenses;
        }

      }
    }
    return res;
  }


  getMemberById(id: string) {
    return this.members.find(m => m.id === id);
  }

  memberNameExist(memberName: string) {
    return this.members.findIndex(m => m.name === memberName) !== -1;


  }
}

// export interface Group {
//   id: string;
//   name: string;
//   members: any[];
//   transactions: any[];
//   users: any[];
// }


// var memberSchema = new mongoose.Schema({
//   name: String
// });
//
// var groupSchema = new mongoose.Schema({
//   name: {type: String, default: "Unnamed", required:[true, "Name can't be black"]},
//   users: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
//   creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
//   members: [memberSchema],
//   transactions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Transaction'}]
// }, {timestamps: true});
