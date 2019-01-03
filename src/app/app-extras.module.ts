import {
  NgModule
} from '@angular/core';

import {
  SkyFilterModule
} from './public/modules/filter';

import {
  SkyInfiniteScrollModule
} from './public/modules/infinite-scroll';

import {
  SkyPagingModule
} from './public/modules/paging';

import {
  SkySortModule
} from './public/modules/sort';

import {
  SkyRepeaterModule
} from './public/modules/repeater';

import {
  SkyDropdownModule
} from '@skyux/popovers/modules/dropdown';

import {
  SkyListModule
} from '@skyux/list-builder';

import {
  SkyListViewGridModule
} from '@skyux/list-builder-view-grids';

import {
  SkyGridModule
} from '@skyux/grids';

@NgModule({
  imports: [
    SkyDropdownModule,
    SkyFilterModule,
    SkyInfiniteScrollModule,
    SkyPagingModule,
    SkyRepeaterModule,
    SkySortModule,
    SkyListModule,
    SkyGridModule,
    SkyListViewGridModule
  ],
  exports: [
    SkyDropdownModule,
    SkyFilterModule,
    SkyInfiniteScrollModule,
    SkyPagingModule,
    SkyRepeaterModule,
    SkySortModule,
    SkyListModule,
    SkyGridModule,
    SkyListViewGridModule
  ],
  providers: [],
  entryComponents: []
})
export class AppExtrasModule { }
