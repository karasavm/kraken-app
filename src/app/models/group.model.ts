
import { Member } from './member.model';
import {Transaction} from './transaction.model';
import {User} from './user.model';
import {getCurrentUser} from "../shared/helper";

export class Group {
  constructor(public id: string,
              public name: string,
              public members: Member[] = [],
              public transactions: Transaction[] = [],
              public users: User[] = [],
              public creator: User = null,
              public updatedAt = null) {

  }

  static JSONtoObject(body): Group {
    return new Group(
      body.id,
      body.name,
      body.members.map(member => Member.JSONtoObject(member)),
      body.transactions.map(transaction => Transaction.JSONtoObject(transaction)),
      body.users,
      body.creator,
      body.updatedAt
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

    for (let i = 0; i < this.members.length; i ++) {
      res[this.members[i].id].debt = Math.round(res[this.members[i].id].debt*10000)/10000;
      if (Math.abs(res[this.members[i].id].debt) < 0.05) {

        delete res[this.members[i].id];
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

  userEmailExists(userEmail: string) {
    return this.users.findIndex(u => u.email === userEmail) !== -1;
  }

  isCreatorsEmail(userEmail : string) {
    return this.creator.email === userEmail;
  }

  getVirtualMembers() {
    return this.members.filter(function (m) {
      return !m.user
    })
  }
  getUserMembers() {
    return this.members.filter(function (m) {
      return m.user
    })
  }

  getCurrentMember() {
    return this.getUserMembers()[
      this.getUserMembers().findIndex(m => getCurrentUser().id === m.user.id)
      ];

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
