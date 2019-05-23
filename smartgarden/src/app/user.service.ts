import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  uri = 'http://localhost:5000';

  constructor(private http: HttpClient) { }

  registerUser(username, password) {
    const obj = {
      username: username,
      password: password
    };
    console.log(obj);
    this.http.post(`${this.uri}/register`, obj)
        .subscribe(res => console.log('Register Done'));
  }
  loginUser(username, password) {
    const obj = {
      username: username,
      password: password
    };
    console.log(obj);
    this.http.post(`${this.uri}/login`, obj)
        .subscribe(res => console.log('Login Done'));
  }
}