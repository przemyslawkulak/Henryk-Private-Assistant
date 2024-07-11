// src/app/app.component.ts
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Observable, of, Subscription, switchMap, tap } from 'rxjs';
import { AudioService } from './audio-service.service';
import { ApiService } from './api.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { Message } from '@prisma/client';
const defaultInputText = '';
// `przejrzyj liste obiadów i wybierz losowo jedną zupę, jedno danie z makaronem, jedno z kaszą, jedno z ryżem, jedno z ziemniakami, dodatkowo jedno danie wege i jedno z rybą
// wypisz te obiady. Wyklucz z losowania dania które były oznaczone przed 30 marca 2024`;
//'zrób listę obiadów na kolejny tydzień';
//'Dodaj do listy zakupów pomidory, 2 sery i 4 wędliny'
// 'Oto przepis na pieczone pulpety z suszonymi pomidorami oraz lista składników: ### Składniki: - 500 g mielonego mięsa (np. wieprzowego, wołowego lub z indyka) - 1 jajko - 1 mała cebula, drobno posiekana - 1 ząbek czosnku, drobno posiekany - 50 g suszonych pomidorów w oleju, drobno posiekanych - 3 łyżki bułki tartej - 2 łyżki posiekanej świeżej pietruszki - 1 łyżeczka suszonego oregano - Sól i pieprz do smaku - 2 łyżki oliwy z oliwek (do posmarowania pulpetów) ### Opcjonalnie (do sosu): - 400 g passaty pomidorowej lub pomidorów z puszki - 1 łyżka koncentratu pomidorowego - 1 łyżeczka cukru - Sól i pieprz do smaku - Kilka listków świeżej bazylii ### Przygotowanie: 1. Rozgrzej piekarnik do 200°C (góra-dół). 2. W dużej misce wymieszaj mielone mięso, jajko, cebulę, czosnek, suszone pomidory, bułkę tartą, pietruszkę i oregano. Dopraw solą i pieprzem do smaku. 3. Z masy mięsnej formuj małe kuleczki (pulpety) i układaj je na blasze wyłożonej papierem do pieczenia. 4. Posmaruj pulpety oliwą z oliwek za pomocą pędzelka. 5. Piecz pulpety w rozgrzanym piekarniku przez około 20-25 minut, aż będą złociste i dobrze upieczone. ### Przygotowanie sosu (opcjonalnie): 1. W rondlu podgrzej passatę pomidorową lub pomidory z puszki. 2. Dodaj koncentrat pomidorowy, cukier, sól i pieprz. Gotuj na małym ogniu przez około 10-15 minut, aż sos zgęstnieje. 3. Dodaj listki bazylii i wymieszaj. ### Serwowanie: Pulpety podawaj na ciepło, polane sosem pomidorowym, z ulubionymi dodatkami, np. makaronem, ryżem lub pieczywem. Smacznego! Znajdź podobny przepis';
// 'znajdz przepis na paella mixta i wyświetl jego składniki';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    FormsModule,
    CommonModule,
    MarkdownModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatTooltipModule,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  conversationHistoryCount = 15;
  response = 'initial';
  isRecording = false;
  private onStopSubscription: Subscription;

  messages: string[] = ['Henryk: Ask me anything'];
  userInput: string = defaultInputText || '';
  conversations: Observable<Message[]> = of([]);
  drawerOpen: boolean = false;

  constructor(
    private audioService: AudioService,
    private apiService: ApiService,
    private cd: ChangeDetectorRef
  ) {
    this.onStopSubscription = this.audioService.onStop
      .pipe(
        switchMap((blob) => {
          return this.audioService.sendAudio(blob);
        })
      )
      .pipe(
        tap((res: { text: string }) => {
          this.upgradeChat(res.text);
        })
      )
      .pipe(
        switchMap((res: { text: string }) => {
          console.log(res);
          return this.apiService.sendAIQuestion(res.text);
        })
      )
      .subscribe({
        next: (response: any) => {
          console.log(response);
          this.upgradeChat(response.answer);
        },
        error: (error) => {
          console.error('Error sending audio', error);
        },
      });
  }

  ngOnInit(): void {
    this.conversations = this.apiService.getConversationList(
      this.conversationHistoryCount
    );
  }

  ngOnDestroy() {
    this.onStopSubscription.unsubscribe();
  }

  toggleRecording() {
    if (!this.isRecording) {
      this.audioService.startRecording();
      this.isRecording = true;
    } else {
      this.isRecording = false;

      this.audioService.stopRecording();
    }
  }

  sendMessage() {
    if (this.userInput.trim()) {
      this.messages.push('Ja: ' + this.userInput);
      this.apiService
        .sendAIQuestion(this.userInput)
        .subscribe((response: any) => {
          console.log(response);
          this.upgradeChat(response.answer);
        });
      this.userInput = defaultInputText || '';
    }
  }

  toggleDrawer() {
    this.drawerOpen = !this.drawerOpen;
  }

  upgradeChat(response: string) {
    this.messages.push('Henryk: ' + response);
    this.conversations = this.apiService.getConversationList(
      this.conversationHistoryCount
    );
    this.cd.detectChanges();
  }

  loadMoreConversations() {
    this.conversationHistoryCount = this.conversationHistoryCount + 15;
    this.conversations = this.apiService.getConversationList(
      this.conversationHistoryCount
    );
  }
}
