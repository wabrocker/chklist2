import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, IonList } from '@ionic/angular';
import { ChecklistService } from '../services/checklist.service';
import { Checklist } from '../interfaces/checklist';
import { ChecklistItem } from '../interfaces/checklist-item';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.page.html',
  styleUrls: ['./checklist.page.scss'],
})
export class ChecklistPage implements OnInit, OnDestroy {
  @ViewChild(IonList, { static: false }) slidingList: IonList;
  public checklist: Checklist = {
    id: '',
    title: '',
    ionicon: '',
    items: [],
  };
  private checklistSubscription: Subscription;
  constructor(
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private checklistService: ChecklistService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.checklistSubscription = this.checklistService.getChecklist(id).subscribe((checklist) => {
      this.checklist = checklist;
    });
  }

  ngOnDestroy() {
    if (this.checklistSubscription !== null) {
      this.checklistSubscription.unsubscribe();
    }
  }

  async addItem(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Add Item',
      message: 'Enter the name of the task for this checklist below:',
      inputs: [ {
        type: 'text',
          name: 'name',
        }, ],
      buttons: [ {
        text: 'Cancel',
      }, {
        text: 'Save',
        handler: (data) => { this.checklistService.addItemToChecklist(this.checklist.id, data.name);
        }, },
      ],
    });
    alert.present();
  }

  async renameItem(item: ChecklistItem): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Rename Item',
      message: 'Enter the new name of the task for this checklist below:',
      inputs: [ {
        type: 'text',
        name: 'name'
      }, ],
      buttons: [ {
        text: 'Cancel',
      }, {
        text: 'Save',
        handler: (data) => {
          this.checklistService.updateItemInChecklist(this.checklist.id, item.id, data.name);
          this.slidingList.closeSlidingItems();
        },
      }, ],
    });
    alert.present();
  }

  async resetItemIcon(item: ChecklistItem): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Rename Item',
      message: `Enter the new name of the Icon for this item below: (vs ${item.ionicon})`,
      inputs: [ {
        type: 'text',
        name: 'iname'
      }, ],
      buttons: [ {
        text: 'Cancel',
      }, {
        text: 'Save',
        handler: (data) => {
          this.checklistService.updateItemIconInChecklist(this.checklist.id, item.id, data.iname);
          this.slidingList.closeSlidingItems();
        },
      }, ],
    });
    alert.present();
  }

  async removeItem(item: ChecklistItem): Promise<void> {
    await this.slidingList.closeSlidingItems();
    this.checklistService.removeItemFromChecklist(this.checklist.id, item.id);
  }

  toggleItem(item: ChecklistItem): void {
    this.checklistService.setItemStatus(this.checklist.id, item.id, !item.checked);
  }

  restartList(): void {
    this.checklistService.resetItemStatusForChecklist(this.checklist.id);
  }
}
