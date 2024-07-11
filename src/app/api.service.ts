import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';

const path = 'http://localhost:3000/api';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  conversationId = '';
  constructor(private http: HttpClient) {}

  sendAIQuestion(message: string) {
    console.log('before', this.conversationId);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Conversation-Id': this.conversationId || '',
    });
    return this.http
      .post(`${path}/ask`, { message }, { headers, observe: 'response' })
      .pipe(
        tap((res) => {
          this.conversationId = res.headers.get('X-Conversation-Id') || '';
        }),
        map((response) => response.body)
      );
  }

  getConversationList(count: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.get(`${path}/conversations/${count}`, { headers });
  }
}
