export class Member {



  constructor(public id: string, public name: string) {}

  static JSONtoObject(body): Member {
    return new Member(
      body.id,
      body.name
    );

  }


}
