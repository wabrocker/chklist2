import { Component, ViewChild, OnInit } from '@angular/core';
import { AlertController, IonList, IonContent, NavController } from '@ionic/angular';
import { ChecklistService } from '../services/checklist.service';
import { Checklist } from '../interfaces/checklist';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild(IonList, { static: false }) slidingList: IonList;
  @ViewChild(IonContent, { static: false }) contentArea: IonContent;

  public checklists: Checklist[] = [];

  constructor(
    private checklistService: ChecklistService,
    private alertCtrl: AlertController,
    private storage: Storage,
    private navCtrl: NavController
  ) {}

  async ngOnInit() {
    const introPreviouslyShown = await this.storage.get('introShown');
    this.checklistService.getChecklists().subscribe((checklists) => {
      this.checklists = checklists;
    });
  }

  async addChecklist(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'New Checklist',
      message: 'Enter the name of your new checklist below:',
      inputs: [ {
        type: 'text',
        name: 'name',
      }, ],
      buttons: [{
        text: 'Cancel',
      }, {
        text: 'Save',
        handler: async (data) => {
          await this.checklistService.createChecklist(data.name);
          this.contentArea.scrollToBottom(300);
        },
      }, ],
    });
    alert.present();
  }

  async renameChecklist(checklist: Checklist): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Rename Checklist',
      message: 'Enter the new name of this checklist below:',
      inputs: [
        {
          type: 'text',
          name: 'name',
        }, ],
      buttons: [ {
        text: 'Cancel',
      }, {
        text: 'Save',
        handler: async (data) => {
          await this.checklistService.updateChecklist(checklist.id, data.name);
          this.slidingList.closeSlidingItems();
        }, }, ],
    });
    alert.present();
  }

  async resetChecklistIcon(checklist: Checklist): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Reset Checklist Icon',
      message: `Enter the new name of the icon for this checklist below: (vs ${checklist.ionicon})`,
      inputs: [
        {
          type: 'text',
          name: 'name',
        }, ],
      buttons: [ {
        text: 'Cancel',
      }, {
        text: 'Save',
        handler: async (data) => {
          await this.checklistService.updateChecklistIcon(checklist.id, data.name);
          this.slidingList.closeSlidingItems();
        }, }, ],
    });
    alert.present();
  }

  async removeChecklist(checklist: Checklist): Promise<void> {
    await this.slidingList.closeSlidingItems();
    this.checklistService.removeChecklist(checklist.id);
  }
}
