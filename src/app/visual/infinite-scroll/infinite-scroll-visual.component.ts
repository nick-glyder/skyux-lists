import {
  Component, OnInit
} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

let nextListId = 0;

@Component({
  selector: 'infinite-scroll-visual',
  templateUrl: './infinite-scroll-visual.component.html'
})
export class InfiniteScrollVisualComponent implements OnInit {
  public listItems = new BehaviorSubject<any[]>([]);
  public listHasMore = true;
  private _listItems: any[] = [];

  public ngOnInit(): void {
    this.addListData();
  }

  public onListScrollEnd(): void {
    if (this.listHasMore) {
      this.addListData();
    }
  }

  public turnOn() {
    this.listHasMore = true;
  }

  private addListData(): void {
    this.mockListRemote().then((result: any) => {
      this._listItems = this._listItems.concat(result.data);
      this.listItems.next(this._listItems);
      this.listHasMore = result.hasMore;
    });
  }

  private mockListRemote(): Promise<any> {
    const data: any[] = [];

    for (let i = 0; i < 8; i++) {
      data.push({
        name: `List item #${++nextListId}`
      });
    }

    // Simulate async request.
    return new Promise((resolve: any) => {
      setTimeout(() => {
        resolve({
          data,
          hasMore: (nextListId < 50)
        });
      }, 1000);
    });
  }
}
