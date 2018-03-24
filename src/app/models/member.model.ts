import {User} from "./user.model";

export class Member {



  constructor(public id: string, public name: string, public user: User) {}

  static JSONtoObject(body): Member {
    return new Member(
      body.id,
      body.name,
      User.JSONtoObject(body.user)
    );

  }


}
