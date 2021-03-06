import {
  fakeAsync,
  inject,
  TestBed,
  tick,
  async
} from '@angular/core/testing';

import { SkyLogService } from '@skyux/core/modules/log/log.service';
import { SkyRepeaterFixturesModule } from './fixtures/repeater-fixtures.module';
import { RepeaterTestComponent } from './fixtures/repeater.component.fixture';

import {
  expect
} from '@skyux-sdk/testing';

describe('Repeater item component', () => {
  class MockLogService {
    public warn(message: any) { }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyRepeaterFixturesModule],
      providers: [
        {
          provide: SkyLogService,
          useClass: MockLogService
        }
      ]
    });
  });

  it(
    'should default expand mode to "none" when no expand mode is specified',
    fakeAsync(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      let cmp: RepeaterTestComponent = fixture.componentInstance;
      cmp.expandMode = undefined;

      fixture.detectChanges();

      tick();

      expect(cmp.repeater.expandMode).toBe('none');
    })
  );

  it('should have aria-control set pointed at content', fakeAsync(() => {
    let fixture = TestBed.createComponent(RepeaterTestComponent);
    let el = fixture.nativeElement;

    fixture.detectChanges();
    tick();

    expect(el.querySelector('sky-chevron').getAttribute('aria-controls'))
      .toBe(el.querySelector('.sky-repeater-item-content').getAttribute('id'));
  }));

  it('should be accessible', async(() => {
    let fixture = TestBed.createComponent(RepeaterTestComponent);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));

  describe('with expand mode of "single"', () => {
    it('should collapse other items when an item is expanded', fakeAsync(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      let cmp: RepeaterTestComponent = fixture.componentInstance;

      cmp.expandMode = 'single';
      fixture.detectChanges();

      tick();

      let repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isExpanded).toBe(true);
      expect(repeaterItems[1].isExpanded).toBeFalsy();
      expect(repeaterItems[2].isExpanded).toBeFalsy();

      repeaterItems[1].isExpanded = true;

      fixture.detectChanges();

      tick();

      repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isExpanded).toBeFalsy();
      expect(repeaterItems[1].isExpanded).toBe(true);
      expect(repeaterItems[2].isExpanded).toBeFalsy();
    }));

    it('should collapse other items when a new expanded item is added', fakeAsync(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      let cmp: RepeaterTestComponent = fixture.componentInstance;

      cmp.expandMode = 'single';
      cmp.removeLastItem = true;

      fixture.detectChanges();

      tick();

      let repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isExpanded).toBe(true);
      expect(repeaterItems[1].isExpanded).toBe(false);

      cmp.removeLastItem = false;
      cmp.lastItemExpanded = true;

      fixture.detectChanges();

      tick();

      repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isExpanded).toBe(false);
      expect(repeaterItems[1].isExpanded).toBe(false);
      expect(repeaterItems[2].isExpanded).toBe(true);
    }));

    it('should toggle its collapsed state when an item\'s header is clicked', fakeAsync(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      let cmp: RepeaterTestComponent = fixture.componentInstance;
      let el = fixture.nativeElement;

      cmp.expandMode = 'single';
      fixture.detectChanges();
      tick();

      let repeaterItems = cmp.repeater.items.toArray();
      expect(repeaterItems[0].isExpanded).toBe(true);
      expect(el.querySelector('sky-chevron').getAttribute('aria-expanded')).toBe('true');

      el.querySelectorAll('.sky-repeater-item-title').item(0).click();
      fixture.detectChanges();
      tick();

      repeaterItems = cmp.repeater.items.toArray();
      expect(repeaterItems[0].isExpanded).toBe(false);
      expect(el.querySelector('sky-chevron').getAttribute('aria-expanded')).toBe('false');
    }));

    it('should toggle its collapsed state when an item\'s chevron is clicked', fakeAsync(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      let cmp: RepeaterTestComponent = fixture.componentInstance;
      let el = fixture.nativeElement;

      cmp.expandMode = 'single';

      fixture.detectChanges();

      tick();

      let repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isExpanded).toBe(true);

      el.querySelectorAll('.sky-chevron').item(0).click();

      fixture.detectChanges();

      tick();

      repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isExpanded).toBe(false);
    }));

    it('should select items based on input', fakeAsync(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      let cmp: RepeaterTestComponent = fixture.componentInstance;
      cmp.expandMode = 'single';
      cmp.lastItemSelected = true;

      fixture.detectChanges();
      tick();

      let repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isSelected).toBe(false);
      expect(repeaterItems[1].isSelected).toBe(false);
      expect(repeaterItems[2].isSelected).toBe(true);
    }));

    it('should be accessible', async(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      fixture.detectChanges();
      fixture.componentInstance.expandMode = 'single';
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
    }));
  });

  describe('with expand mode of "multiple"', () => {
    it('should not collapse other items when an item is expanded', fakeAsync(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      let cmp: RepeaterTestComponent = fixture.componentInstance;

      cmp.expandMode = 'multiple';

      fixture.detectChanges();
      tick();

      let repeaterItems = cmp.repeater.items.toArray();

      repeaterItems[0].isExpanded = true;
      repeaterItems[1].isExpanded = false;
      repeaterItems[2].isExpanded = false;

      fixture.detectChanges();

      repeaterItems[1].isExpanded = true;

      tick();

      repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isExpanded).toBe(true);
      expect(repeaterItems[1].isExpanded).toBe(true);
      expect(repeaterItems[2].isExpanded).toBe(false);
    }));

    it('should toggle its collapsed state when an item\'s header is clicked', fakeAsync(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      let cmp: RepeaterTestComponent = fixture.componentInstance;
      let el = fixture.nativeElement;

      cmp.expandMode = 'multiple';

      fixture.detectChanges();

      tick();

      let repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isExpanded).toBe(true);

      el.querySelectorAll('.sky-repeater-item-title').item(0).click();

      fixture.detectChanges();

      tick();

      repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isExpanded).toBe(false);
    }));

    it('should toggle its collapsed state when an item\'s chevron is clicked', fakeAsync(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      let cmp: RepeaterTestComponent = fixture.componentInstance;
      let el = fixture.nativeElement;

      cmp.expandMode = 'multiple';

      fixture.detectChanges();

      tick();

      let repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isExpanded).toBe(true);

      el.querySelectorAll('.sky-chevron').item(0).click();

      fixture.detectChanges();

      tick();

      repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isExpanded).toBe(false);
    }));

    it('should select items based on input', fakeAsync(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      let cmp: RepeaterTestComponent = fixture.componentInstance;
      cmp.expandMode = 'multiple';
      cmp.lastItemSelected = true;

      fixture.detectChanges();
      tick();

      let repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isSelected).toBe(false);
      expect(repeaterItems[1].isSelected).toBe(false);
      expect(repeaterItems[2].isSelected).toBe(true);
    }));

    it('should be accessible', async(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      fixture.detectChanges();
      fixture.componentInstance.expandMode = 'multiple';
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
    }));
  });

  describe('with expand mode of "none"', () => {
    it(
      'should not allow items to be collapsed',
      fakeAsync(
        inject([SkyLogService], (mockLogService: MockLogService) => {
          let fixture = TestBed.createComponent(RepeaterTestComponent);
          let cmp: RepeaterTestComponent = fixture.componentInstance;

          cmp.expandMode = 'none';

          fixture.detectChanges();
          tick();

          let item = cmp.repeater.items.first;

          expect(item.isExpanded).toBe(true);

          let warnSpy = spyOn(mockLogService, 'warn');

          item.isExpanded = false;

          fixture.detectChanges();
          tick();

          item = cmp.repeater.items.first;

          expect(warnSpy).toHaveBeenCalled();

          expect(item.isExpanded).toBe(true);
        })
    ));

    it('should hide each item\'s chevron button', fakeAsync(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      let cmp: RepeaterTestComponent = fixture.componentInstance;
      let el = fixture.nativeElement as Element;

      fixture.detectChanges();

      cmp.expandMode = 'none';
      fixture.detectChanges();

      tick();

      let chevronEls = el.querySelectorAll('.sky-repeater-item-chevron');

      expect(chevronEls.length).toBe(3);

      for (let i = 0, n = chevronEls.length; i < n; i++) {
        let chevronEl = chevronEls.item(i);
        expect(getComputedStyle(chevronEl).getPropertyValue('display')).toBe('none');
      }
    }));

    it(
      'should expand all items when mode was previously set to "single" or "multiple"',
      fakeAsync(() => {
        let fixture = TestBed.createComponent(RepeaterTestComponent);
        let cmp: RepeaterTestComponent = fixture.componentInstance;

        cmp.expandMode = 'multiple';

        fixture.detectChanges();
        tick();

        let repeaterItems = cmp.repeater.items.toArray();

        for (let repeaterItem of repeaterItems) {
          repeaterItem.isExpanded = false;
        }

        fixture.detectChanges();
        tick();

        cmp.expandMode = 'none';

        fixture.detectChanges();
        tick();

        repeaterItems = cmp.repeater.items.toArray();

        for (let repeaterItem of repeaterItems) {
          expect(repeaterItem.isExpanded).toBe(true);
        }
      })
    );

    it('should not toggle its collapsed state when an item\'s header is clicked', fakeAsync(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      let cmp: RepeaterTestComponent = fixture.componentInstance;
      let el = fixture.nativeElement;

      cmp.expandMode = 'none';

      fixture.detectChanges();

      tick();

      let repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isExpanded).toBe(true);

      el.querySelectorAll('.sky-repeater-item-title').item(0).click();

      fixture.detectChanges();

      tick();

      repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isExpanded).toBe(true);
    }));

    it('should select items based on input', fakeAsync(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      let cmp: RepeaterTestComponent = fixture.componentInstance;
      cmp.expandMode = 'none';
      cmp.lastItemSelected = true;

      fixture.detectChanges();
      tick();

      let repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isSelected).toBe(false);
      expect(repeaterItems[1].isSelected).toBe(false);
      expect(repeaterItems[2].isSelected).toBe(true);
    }));

    it('should be accessible', async(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      fixture.detectChanges();
      fixture.componentInstance.expandMode = 'none';
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
    }));
  });

  describe('with selectability "true"', () => {
    it('should add selected css class when selected', fakeAsync(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      let cmp: RepeaterTestComponent = fixture.componentInstance;
      let el = fixture.nativeElement;

      fixture.detectChanges();

      tick();

      cmp.repeater.items.forEach(item => item.selectable = true);

      let selectedItemsEl = el.querySelectorAll('.sky-repeater-item-selected') as NodeList;
      expect(selectedItemsEl.length).toBe(0);

      // select first item
      const repeaterItems = cmp.repeater.items.toArray();
      repeaterItems[0].updateIsSelected({source: undefined, checked: true});

      fixture.detectChanges();

      tick();

      expect(repeaterItems[0].isSelected).toBe(true);
      expect(repeaterItems[1].isSelected).toBe(false);
      expect(repeaterItems[2].isSelected).toBe(false);

      selectedItemsEl = el.querySelectorAll('.sky-repeater-item-selected');
      expect(selectedItemsEl.length).toBe(1);
    }));

    it('should be accessible', async(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      fixture.detectChanges();
      fixture.componentInstance.repeater.items.forEach(item => item.selectable = true);

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
    }));
  });
});
