

export class User {
  constructor(public id: string,
              public name: string,
              public email: string,
              public token: string = '') {}

  static JSONtoObject(body): User {

    return new User(
      body.id,
      body.name,
      body.email
    );

  }



}


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
