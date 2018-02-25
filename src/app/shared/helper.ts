import {User} from "../models/user.model";

export function unnull(v) {
  if (typeof v === 'undefined') {
    return 0;
  }
  return v;
}


export function nulling(v) {
  if (v === 0) {
    return null;
  }

  return v;
}

export function isCurrentUser(user: User) {

  return getCurrentUser().email === user.email;
}




export function getCurrentUser() {
  // given a payload object of { username: 'bob', userid: 1, email: 'bob@example.com' }

  const token = localStorage.getItem('token');

  if (token){
    const tokenParts = token.split('.');
    const encodedPayload = tokenParts[1];
    const rawPayload = atob(encodedPayload);
    const user = JSON.parse(rawPayload);

    return User.JSONtoObject(user);
  }

  return null;
}

