import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService } from '@covalent/core/dialogs';
import { TdMediaService } from '@covalent/core/media';
import { INews, NewsService } from './services/news.service';


@Component({
  selector: 'qs-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  news: INews[];
  filteredNews : INews[];

  constructor(private _titleService: Title,
              private _loadingService: TdLoadingService,
              private _dialogService: TdDialogService,
              private _snackBarService: MatSnackBar,
              private _newsService: NewsService,
              private _changeDetectorRef: ChangeDetectorRef,
              public media: TdMediaService) {
  }

  ngOnInit() {
    this._titleService.setTitle('Covalent Users');
    this.load();
  }

  async load(): Promise<void> {
    try {
      this._loadingService.register('news.list');
      this.news = await this._newsService.query().toPromise();
    } catch (error) {
      this.news = await this._newsService.staticQuery().toPromise();
    } finally {
      this.filteredNews = Object.assign([], this.news);
      this._loadingService.resolve('news.list');
    }
  }

  filterNews(title: string = ''): void {
    this.filteredNews = this.news.filter((newsItem: INews) => {
      return newsItem.title.toLowerCase().indexOf(title.toLowerCase()) > -1;
    });
  }

  delete(id: string): void {
    this._dialogService
      .openConfirm({message: 'Are you sure you want to delete this news item?'})
      .afterClosed().toPromise().then((confirm: boolean) => {
      if (confirm) {
        this._delete(id);
      }
    });
  }

  private async _delete(id: string): Promise<void> {
    try {
      this._loadingService.register('news.list');
      await this._newsService.delete(id).toPromise();
      this.news = this.news.filter((newsItem: INews) => {
        return newsItem.id !== id;
      });
      this.filteredNews = this.filteredNews.filter((newsItem: INews) => {
        return newsItem.id !== id;
      });
      this._snackBarService.open('News items Deleted', 'Ok');
    } catch (error) {
      this._dialogService.openAlert({message: 'There was an error trying to delete the news item'});
    } finally {
      this._loadingService.resolve('news.list');
    }
  }

}
