import { Component } from '@angular/core';
import { ChecklistService } from './services/checklist.service';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar } from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  storage: any;
  constructor(private checklistService: ChecklistService) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.checklistService.load();
    SplashScreen.hide().catch((err) => {
      console.warn(err);
    });
    StatusBar.setBackgroundColor({ color: '#2dd36f' }).catch((err) => {
      console.warn(err);
    });
  }
}
