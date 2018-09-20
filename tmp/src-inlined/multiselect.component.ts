import { Component, OnInit, NgModule, SimpleChanges, OnChanges, ChangeDetectorRef, AfterViewChecked, ViewEncapsulation, ContentChild, ViewChild, forwardRef, Input, Output, EventEmitter, ElementRef, AfterViewInit, Pipe, PipeTransform } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor, NG_VALIDATORS, Validator, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MyException } from './multiselect.model';
import { DropdownSettings } from './multiselect.interface';
import { ClickOutsideDirective, ScrollDirective, styleDirective, setPosition } from './clickOutside';
import { ListFilterPipe } from './list-filter';
import { Item, Badge, Search, TemplateRenderer } from './menu-item';
// import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

export const DROPDOWN_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AngularMultiSelect),
    multi: true
};
export const DROPDOWN_CONTROL_VALIDATION: any = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => AngularMultiSelect),
    multi: true,
}
const noop = () => {
};

@Component({
    selector: 'angular2-multiselect',
    template: `
      <div class="cuppa-dropdown" (clickOutside)="closeDropdown()">
          <div class="selected-list" #selectedList>
              <div class="c-btn" (click)="toggleDropdown($event)" [ngClass]="{'disabled': settings.disabled}">
                  <span *ngIf="selectedItems?.length == 0">{{settings.text}}</span>
                  <span *ngIf="settings.singleSelection">
                      <span *ngFor="let item of selectedItems;trackBy: trackByFn.bind(this);">
                          {{item[settings.labelKey]}}
                      </span>
                  </span>
                  <div class="c-list" *ngIf="selectedItems?.length > 0 && !settings.singleSelection">
                      <div class="c-token" *ngFor="let item of selectedItems;trackBy: trackByFn.bind(this);let k = index" [hidden]="k > settings.badgeShowLimit-1">
                          <span *ngIf="!badgeTempl" class="c-label">{{item[settings.labelKey]}}</span>
                          <span *ngIf="badgeTempl" class="c-label">
                              <c-templateRenderer [data]="badgeTempl" [item]="item"></c-templateRenderer>
                          </span>
                          <span class="c-remove" (click)="onItemClick(item,k,$event)">
                              <svg width="100%" height="100%" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                  x="0px" y="0px" viewBox="0 0 47.971 47.971" style="enable-background:new 0 0 47.971 47.971;" xml:space="preserve">
                                  <g>
                                      <path d="M28.228,23.986L47.092,5.122c1.172-1.171,1.172-3.071,0-4.242c-1.172-1.172-3.07-1.172-4.242,0L23.986,19.744L5.121,0.88
      		c-1.172-1.172-3.07-1.172-4.242,0c-1.172,1.171-1.172,3.071,0,4.242l18.865,18.864L0.879,42.85c-1.172,1.171-1.172,3.071,0,4.242
      		C1.465,47.677,2.233,47.97,3,47.97s1.535-0.293,2.121-0.879l18.865-18.864L42.85,47.091c0.586,0.586,1.354,0.879,2.121,0.879
      		s1.535-0.293,2.121-0.879c1.172-1.171,1.172-3.071,0-4.242L28.228,23.986z" />
                                  </g>
                              </svg>

                          </span>
                      </div>
                  </div>
                  <span class="countplaceholder" *ngIf="selectedItems?.length > settings.badgeShowLimit">+{{selectedItems?.length - settings.badgeShowLimit }}</span>
                  <span *ngIf="!isActive" class="c-angle-down">
                      <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                          width="100%" height="100%" viewBox="0 0 612 612" style="enable-background:new 0 0 612 612;" xml:space="preserve">
                          <g>
                              <g id="_x31_0_34_">
                                  <g>
                                      <path d="M604.501,134.782c-9.999-10.05-26.222-10.05-36.221,0L306.014,422.558L43.721,134.782
      				c-9.999-10.05-26.223-10.05-36.222,0s-9.999,26.35,0,36.399l279.103,306.241c5.331,5.357,12.422,7.652,19.386,7.296
      				c6.988,0.356,14.055-1.939,19.386-7.296l279.128-306.268C614.5,161.106,614.5,144.832,604.501,134.782z" />
                                  </g>
                              </g>
                          </g>
                      </svg>

                  </span>
                  <span *ngIf="isActive" class="c-angle-up">
                      <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                          width="100%" height="100%" viewBox="0 0 612 612" style="enable-background:new 0 0 612 612;" xml:space="preserve">
                          <g>
                              <g id="_x39__30_">
                                  <g>
                                      <path d="M604.501,440.509L325.398,134.956c-5.331-5.357-12.423-7.627-19.386-7.27c-6.989-0.357-14.056,1.913-19.387,7.27
      				L7.499,440.509c-9.999,10.024-9.999,26.298,0,36.323s26.223,10.024,36.222,0l262.293-287.164L568.28,476.832
      				c9.999,10.024,26.222,10.024,36.221,0C614.5,466.809,614.5,450.534,604.501,440.509z" />
                                  </g>
                              </g>
                          </g>

                      </svg>

                  </span>
              </div>
          </div>
          <div [setPosition]="selectedListHeight?.val" class="dropdown-list" [ngClass]="{'dropdown-list-top': settings.position == 'top'}"
              [hidden]="!isActive">
              <div [ngClass]="{'arrow-up': settings.position == 'bottom', 'arrow-down': settings.position == 'top'}" class="arrow-2"></div>
              <div [ngClass]="{'arrow-up': settings.position == 'bottom', 'arrow-down': settings.position == 'top'}"></div>
              <div class="list-area">
                  <div class="pure-checkbox select-all" *ngIf="settings.enableCheckAll && !settings.singleSelection && !settings.limitSelection"
                      (click)="toggleSelectAll()">
                      <input *ngIf="settings.showCheckbox" type="checkbox" [checked]="isSelectAll" [disabled]="settings.limitSelection == selectedItems?.length"
                      />
                      <label>
                          <span [hidden]="isSelectAll">{{settings.selectAllText}}</span>
                          <span [hidden]="!isSelectAll">{{settings.unSelectAllText}}</span>
                      </label>
                  </div>
                  <div class="list-filter" *ngIf="settings.enableSearchFilter">
                      <span class="c-search">
                          <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                              width="100%" height="100%" viewBox="0 0 615.52 615.52" style="enable-background:new 0 0 615.52 615.52;"
                              xml:space="preserve">
                              <g>
                                  <g>
                                      <g id="Search__x28_and_thou_shall_find_x29_">
                                          <g>
                                              <path d="M602.531,549.736l-184.31-185.368c26.679-37.72,42.528-83.729,42.528-133.548C460.75,103.35,357.997,0,231.258,0
      					C104.518,0,1.765,103.35,1.765,230.82c0,127.47,102.753,230.82,229.493,230.82c49.53,0,95.271-15.944,132.78-42.777
      					l184.31,185.366c7.482,7.521,17.292,11.291,27.102,11.291c9.812,0,19.62-3.77,27.083-11.291
      					C617.496,589.188,617.496,564.777,602.531,549.736z M355.9,319.763l-15.042,21.273L319.7,356.174
      					c-26.083,18.658-56.667,28.526-88.442,28.526c-84.365,0-152.995-69.035-152.995-153.88c0-84.846,68.63-153.88,152.995-153.88
      					s152.996,69.034,152.996,153.88C384.271,262.769,374.462,293.526,355.9,319.763z" />
                                          </g>
                                      </g>
                                  </g>
                              </g>

                          </svg>

                      </span>
                      <input class="c-input" *ngIf="!settings.lazyLoading && !searchTempl" #searchInput type="text" [placeholder]="settings.searchPlaceholderText"
                          [(ngModel)]="filter">
                      <input class="c-input" *ngIf="settings.lazyLoading && !searchTempl" #searchInput type="text" [placeholder]="settings.searchPlaceholderText"
                          (keyup)="filterInfiniteList($event)">
                      <c-templateRenderer *ngIf="searchTempl" [data]="searchTempl" [item]="item"></c-templateRenderer>
                  </div>
                  <ul *ngIf="!settings.groupBy" [style.maxHeight]="settings.maxHeight+'px'" class="lazyContainer">
                      <span *ngIf="itemTempl">
                          <li *ngFor="let item of data | listFilter: filter : settings.searchBy; let i = index;" (click)="onItemClick(item,i,$event)"
                              class="pure-checkbox">
                              <input *ngIf="settings.showCheckbox" type="checkbox" [checked]="isSelected(item)" [disabled]="settings.limitSelection == selectedItems?.length && !isSelected(item)"
                              />
                              <label></label>
                              <c-templateRenderer [data]="itemTempl" [item]="item"></c-templateRenderer>
                          </li>
                      </span>
                      <span *ngIf="!itemTempl && !settings.lazyLoading">
                          <li *ngFor="let item of data | listFilter:filter : settings.searchBy; let i = index;" class="pure-checkbox">
                              <div class="clearfix">
                                  <div class="pull-left" (click)="onItemClick(item,i,$event)">
                                      <input *ngIf="settings.showCheckbox" type="checkbox" [checked]="isSelected(item)" [disabled]="settings.limitSelection == selectedItems?.length && !isSelected(item)" />
                                      <label>{{item[settings.labelKey]}}</label>
                                  </div>
                                  <div class="pull-right" *ngIf="isSelected(item) && isRearrangeable">
                                      <span class="disabled fa fa-chevron-up" *ngIf="i === 0"></span>
                                      <span *ngIf="i > 0" class="fa fa-chevron-up" (click)="onMoveUp(item, i, $event)"></span>
                                      <span class="disabled fa fa-chevron-down" *ngIf="i === data.length - 1 || (i !== (data.length - 1)) && !isSelected(data[i + 1])"></span>
                                      <span class="fa fa-chevron-down" *ngIf="(i !== (data.length - 1)) && isSelected(data[i + 1])" (click)="onMoveDown(item, i, $event)"></span>
                                  </div>
                              </div>
                          </li>
                      </span>
                      <span *ngIf="!itemTempl && settings.lazyLoading">
                          <div [ngStyle]="{'height':totalHeight+'px'}" style="position: relative;">
                              <li *ngFor="let item of chunkArray | listFilter:filter : settings.searchBy; let i = index;" style="position: absolute;width: 100%;" class="pure-checkbox" [styleProp]="chunkIndex[i]">
                                  <div class="clearfix">
                                      <div class="pull-left" (click)="onItemClick(item,i,$event)">
                                          <input *ngIf="settings.showCheckbox" type="checkbox" [checked]="isSelected(item)" [disabled]="settings.limitSelection == selectedItems?.length && !isSelected(item)" />
                                          <label>{{item[settings.labelKey]}}</label>
                                      </div>
                                      <div class="pull-right" *ngIf="isSelected(item) && isRearrangeable">
                                          <span class="disabled fa fa-chevron-up" *ngIf="i === 0"></span>
                                          <span *ngIf="i > 0" class="fa fa-chevron-up" (click)="onMoveUp(item, i, $event)"></span>

                                          <span class="disabled fa fa-chevron-down" *ngIf="(i !== (data.length - 1)) && !isSelected(data[i + 1])"></span>
                                          <span class="fa fa-chevron-down" *ngIf="(i !== (data.length - 1)) && isSelected(data[i + 1])" (click)="onMoveDown(item, i, $event)"></span>
                                      </div>
                                  </div>
                              </li>
                          </div>
                      </span>
                  </ul>
                  <div *ngIf="settings.groupBy" [style.maxHeight]="settings.maxHeight+'px'" style="overflow: auto;">
                      <ul *ngFor="let obj of groupedData ; let i = index;" class="list-grp">
                          <h4 *ngIf="(obj.value | listFilter:filter : settings.searchBy ).length > 0">{{obj.key}}</h4>
                          <span *ngIf="itemTempl">
                              <li *ngFor="let item of obj.value | listFilter:filter : settings.searchBy; let i = index;" (click)="onItemClick(item,i,$event)"
                                  class="pure-checkbox">
                                  <input *ngIf="settings.showCheckbox" type="checkbox" [checked]="isSelected(item)" [disabled]="settings.limitSelection == selectedItems?.length && !isSelected(item)"
                                  />
                                  <label></label>
                                  <c-templateRenderer [data]="itemTempl" [item]="item"></c-templateRenderer>
                              </li>
                          </span>
                          <span *ngIf="!itemTempl">
                              <li *ngFor="let item of obj.value | listFilter:filter : settings.searchBy; let i = index;" class="pure-checkbox">
                                  <div class="clearfix">
                                      <div class="pull-left" (click)="onItemClick(item,i,$event)">
                                          <input *ngIf="settings.showCheckbox" type="checkbox" [checked]="isSelected(item)" [disabled]="settings.limitSelection == selectedItems?.length && !isSelected(item)" />
                                          <label>{{item[settings.labelKey]}}</label>
                                      </div>
                                      <div class="pull-right" *ngIf="isSelected(item) && isRearrangeable">
                                          <span class="disabled fa fa-chevron-up" *ngIf="i === 0"></span>
                                          <span *ngIf="i > 0" class="fa fa-chevron-up" (click)="onMoveUp(item, i, $event)"></span>
                                          <span class="disabled fa fa-chevron-down" *ngIf="(i !== (data.length - 1)) && !isSelected(data[i + 1])"></span>
                                          <span class="fa fa-chevron-down" *ngIf="(i !== (data.length - 1)) && isSelected(data[i + 1])" (click)="onMoveDown(item, i, $event)"></span>
                                      </div>
                                  </div>

                              </li>
                          </span>
                      </ul>
                  </div>
                  <h5 class="list-message" *ngIf="data?.length == 0">{{settings.noDataLabel}}</h5>
              </div>
          </div>
      </div>
    `,
    host: { '[class]': 'defaultSettings.classes' },
    styles: [`
      .cuppa-dropdown{position:relative}.c-btn{display:inline-block;background:#fff;border:1px solid #ccc;border-radius:3px;font-size:14px;color:#333}.c-btn.disabled{background:#ccc}.disabled{color:#ccc}.c-btn:focus{outline:none}.selected-list .c-list{float:left;padding:0px;margin:0px;width:calc(100% - 20px)}.selected-list .c-list .c-token{list-style:none;padding:2px 8px;background:#0079FE;color:#fff;border-radius:2px;margin-right:4px;margin-top:2px;float:left;position:relative;padding-right:25px}.selected-list .c-list .c-token .c-label{display:block;float:left}.selected-list .c-list .c-token .c-remove{position:absolute;right:8px;top:50%;transform:translateY(-50%);width:10px}.selected-list .c-list .c-token .c-remove svg{fill:#fff}.selected-list .fa-angle-down,.selected-list .fa-angle-up{font-size:15pt;position:absolute;right:10px;top:50%;transform:translateY(-50%)}.selected-list .c-angle-down,.selected-list .c-angle-up{width:15px;height:15px;position:absolute;right:10px;top:50%;transform:translateY(-50%);pointer-events:none}.selected-list .c-angle-down svg,.selected-list .c-angle-up svg{fill:#333}.selected-list .countplaceholder{position:absolute;right:30px;top:50%;transform:translateY(-50%)}.selected-list .c-btn{width:100%;box-shadow:0px 1px 5px #959595;padding:10px;cursor:pointer;display:flex;position:relative}.selected-list .c-btn .c-icon{position:absolute;right:5px;top:50%;transform:translateY(-50%)}.dropdown-list{position:absolute;padding-top:14px;width:100%;z-index:9999}.dropdown-list ul{padding:0px;list-style:none;overflow:auto;margin:0px}.dropdown-list ul li{padding:10px 10px;cursor:pointer;text-align:left}.dropdown-list ul li:first-child{padding-top:10px}.dropdown-list ul li:last-child{padding-bottom:10px}.dropdown-list ul li:hover{background:#f5f5f5}.dropdown-list ::-webkit-scrollbar{width:8px}.dropdown-list ::-webkit-scrollbar-thumb{background:#cccccc;border-radius:5px}.dropdown-list ::-webkit-scrollbar-track{background:#f2f2f2}.arrow-up,.arrow-down{width:0;height:0;border-left:13px solid transparent;border-right:13px solid transparent;border-bottom:15px solid #fff;margin-left:15px;position:absolute;top:0}.arrow-down{bottom:-14px;top:unset;transform:rotate(180deg)}.arrow-2{border-bottom:15px solid #ccc;top:-1px}.arrow-down.arrow-2{top:unset;bottom:-16px}.list-area{border:1px solid #ccc;border-radius:3px;background:#fff;margin:0px;box-shadow:0px 1px 5px #959595}.select-all{padding:10px;border-bottom:1px solid #ccc;text-align:left}.list-filter{border-bottom:1px solid #ccc;position:relative;padding-left:35px;height:35px}.list-filter input{border:0px;width:100%;height:100%;padding:0px}.list-filter input:focus{outline:none}.list-filter .c-search{position:absolute;top:9px;left:10px;width:15px;height:15px}.list-filter .c-search svg{fill:#888}.pure-checkbox input[type="checkbox"]{border:0;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}.pure-checkbox input[type="checkbox"]:focus+label:before,.pure-checkbox input[type="checkbox"]:hover+label:before{border-color:#0079FE;background-color:#f2f2f2}.pure-checkbox input[type="checkbox"]:active+label:before{transition-duration:0s}.pure-checkbox input[type="checkbox"]+label{position:relative;padding-left:2em;vertical-align:middle;user-select:none;cursor:pointer;margin:0px;color:#000;font-weight:300}.pure-checkbox input[type="checkbox"]+label:before{box-sizing:content-box;content:'';color:#0079FE;position:absolute;top:50%;left:0;width:14px;height:14px;margin-top:-9px;border:2px solid #0079FE;text-align:center;transition:all 0.4s ease}.pure-checkbox input[type="checkbox"]+label:after{box-sizing:content-box;content:'';background-color:#0079FE;position:absolute;top:50%;left:4px;width:10px;height:10px;margin-top:-5px;transform:scale(0);transform-origin:50%;transition:transform 200ms ease-out}.pure-checkbox input[type="checkbox"]:disabled+label:before{border-color:#cccccc}.pure-checkbox input[type="checkbox"]:disabled:focus+label:before .pure-checkbox input[type="checkbox"]:disabled:hover+label:before{background-color:inherit}.pure-checkbox input[type="checkbox"]:disabled:checked+label:before{background-color:#cccccc}.pure-checkbox input[type="checkbox"]+label:after{background-color:transparent;top:50%;left:4px;width:8px;height:3px;margin-top:-4px;border-style:solid;border-color:#ffffff;border-width:0 0 3px 3px;border-image:none;transform:rotate(-45deg) scale(0)}.pure-checkbox input[type="checkbox"]:checked+label:after{content:'';transform:rotate(-45deg) scale(1);transition:transform 200ms ease-out}.pure-checkbox input[type="radio"]:checked+label:before{background-color:white}.pure-checkbox input[type="radio"]:checked+label:after{transform:scale(1)}.pure-checkbox input[type="radio"]+label:before{border-radius:50%}.pure-checkbox input[type="checkbox"]:checked+label:before{background:#0079FE}.pure-checkbox input[type="checkbox"]:checked+label:after{transform:rotate(-45deg) scale(1)}.list-message{text-align:center;margin:0px;padding:15px 0px;font-size:initial}.list-grp{padding:0 15px !important}.list-grp h4{text-transform:capitalize;margin:15px 0px 0px 0px;font-size:14px;font-weight:700}.list-grp>li{padding-left:15px !important}
    `],
    providers: [DROPDOWN_CONTROL_VALUE_ACCESSOR, DROPDOWN_CONTROL_VALIDATION]
})

export class AngularMultiSelect implements OnInit, ControlValueAccessor, OnChanges, Validator, AfterViewChecked {

    @Input()
    data: Array<any>;

    // @Input()
    // settings: DropdownSettings;

    @Input()
    settings: any;

    @Input()
    isRearrangeable = false;

    @Output('onSelect')
    onSelect: EventEmitter<any> = new EventEmitter<any>();

    @Output('onDeSelect')
    onDeSelect: EventEmitter<any> = new EventEmitter<any>();

    @Output('onSelectAll')
    onSelectAll: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();

    @Output('onDeSelectAll')
    onDeSelectAll: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();

    @Output('onOpen')
    onOpen: EventEmitter<any> = new EventEmitter<any>();

    @Output('onClose')
    onClose: EventEmitter<any> = new EventEmitter<any>();

    @Output('onMoveItemUp')
    onMoveItemUp: EventEmitter<any> = new EventEmitter<any>();

    @Output('onMoveItemDown')
    onMoveItemDown: EventEmitter<any> = new EventEmitter<any>();

    @ContentChild(Item) itemTempl: Item;
    @ContentChild(Badge) badgeTempl: Badge;
    @ContentChild(Search) searchTempl: Search;


    @ViewChild('searchInput') searchInput: ElementRef;
    @ViewChild('selectedList') selectedListElem: ElementRef;

    public selectedItems: Array<any>;
    public isActive: boolean = false;
    public isSelectAll: boolean = false;
    public groupedData: Array<any>;
    filter: any;
    public chunkArray: any[];
    public scrollTop: any;
    public chunkIndex: any[] = [];
    public cachedItems: any[] = [];
    public totalRows: any;
    public itemHeight: any = 41.6;
    public screenItemsLen: any;
    public cachedItemsLen: any;
    public totalHeight: any;
    public scroller: any;
    public maxBuffer: any;
    public lastScrolled: any;
    public lastRepaintY: any;
    public selectedListHeight: any;

    defaultSettings: DropdownSettings = {
        singleSelection: false,
        text: 'Select',
        enableCheckAll: true,
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableSearchFilter: false,
        searchBy: [],
        maxHeight: 300,
        badgeShowLimit: 999999999999,
        classes: '',
        disabled: false,
        searchPlaceholderText: 'Search',
        showCheckbox: true,
        noDataLabel: 'No Data Available',
        searchAutofocus: true,
        lazyLoading: false,
        labelKey: 'itemName',
        primaryKey: 'id',
        position: 'bottom'
    }
    public parseError: boolean;
    constructor(public _elementRef: ElementRef, private cdr: ChangeDetectorRef) {

    }
    ngOnInit() {
        this.settings = Object.assign(this.defaultSettings, this.settings);
        if (this.settings.groupBy) {
            this.groupedData = this.transformData(this.data, this.settings.groupBy);
        }
        this.totalRows = (this.data && this.data.length);
        this.cachedItems = this.data;
        this.screenItemsLen = Math.ceil(this.settings.maxHeight / this.itemHeight);
        this.cachedItemsLen = this.screenItemsLen * 3;
        this.totalHeight = this.itemHeight * this.totalRows;
        this.maxBuffer = this.screenItemsLen * this.itemHeight;
        this.lastScrolled = 0;
        this.renderChunk(0, this.cachedItemsLen / 2);
        if (this.settings.position == 'top') {
            setTimeout(() => {
                this.selectedListHeight = { val: 0 };
                this.selectedListHeight.val = this.selectedListElem.nativeElement.clientHeight;
            });
        }

    }
    ngOnChanges(changes: SimpleChanges) {
        if (changes.data && !changes.data.firstChange) {
            if (this.settings.groupBy) {
                this.groupedData = this.transformData(this.data, this.settings.groupBy);
                if (this.data.length == 0) {
                    this.selectedItems = [];
                }
            }
        }
        if (changes.settings && !changes.settings.firstChange) {
            this.settings = Object.assign(this.defaultSettings, this.settings);
        }
    }
    ngDoCheck() {
        if (this.selectedItems) {
            if (this.selectedItems.length == 0 || this.data.length == 0 || this.selectedItems.length < this.data.length) {
                this.isSelectAll = false;
            }
        }
    }
    ngAfterViewInit() {
        if (this.settings.lazyLoading) {
            this._elementRef.nativeElement.getElementsByClassName("lazyContainer")[0].addEventListener('scroll', this.onScroll.bind(this));
        }
    }
    ngAfterViewChecked() {
        if (this.selectedListElem.nativeElement.clientHeight && this.settings.position == 'top' && this.selectedListHeight) {
            this.selectedListHeight.val = this.selectedListElem.nativeElement.clientHeight;
            this.cdr.detectChanges();
        }
    }
    onItemClick(item: any, index: number, evt: Event) {
        if (this.settings.disabled) {
            return false;
        }

        let found = this.isSelected(item);
        let limit = this.selectedItems.length < this.settings.limitSelection ? true : false;

        if (!found) {
            if (this.settings.limitSelection) {
                if (limit) {
                    this.addSelected(item, index);
                    item.index = index;
                    this.onSelect.emit(item);
                }
            }
            else {
                this.addSelected(item, index);
                item.index = index;
                this.onSelect.emit(item);
            }

        }
        else {
            this.removeSelected(item, index);
            item.index = index;
            this.onDeSelect.emit(item);
        }
        if (this.isSelectAll || this.data.length > this.selectedItems.length) {
            this.isSelectAll = false;
        }
        if (this.data.length == this.selectedItems.length) {
            this.isSelectAll = true;
        }
    }
    onMoveUp(item: any, index: number, evt: Event) {
        evt.stopPropagation();
        this.rearrangeItems(this.data, index, index - 1);
        this.onMoveItemUp.emit(this.data);
    }
    onMoveDown(item: any, index: number, evt: Event) {
        evt.stopPropagation();
        this.rearrangeItems(this.data, index, index + 1);
        this.onMoveItemDown.emit(this.data);
    }
    rearrangeItems(data: any, fromIndex: number, toIndex: number) {
        this.isActive = true;
        const element = data[fromIndex];
        data.splice(fromIndex, 1);
        data.splice(toIndex, 0, element);
        this.data = data;
    }

    public validate(c: FormControl): any {
        return null;
    }
    private onTouchedCallback: (_: any) => void = noop;
    private onChangeCallback: (_: any) => void = noop;

    writeValue(value: any) {
        if (value !== undefined && value !== null) {
            if (this.settings.singleSelection) {
                try {

                    if (value.length > 1) {
                        this.selectedItems = [value[0]];
                        throw new MyException(404, { "msg": "Single Selection Mode, Selected Items cannot have more than one item." });
                    }
                    else {
                        this.selectedItems = value;
                    }
                }
                catch (e) {
                    console.error(e.body.msg);
                }

            }
            else {
                if (this.settings.limitSelection) {
                    this.selectedItems = value.splice(0, this.settings.limitSelection);
                }
                else {
                    this.selectedItems = value;
                }
                if (this.selectedItems.length === this.data.length && this.data.length > 0) {
                    this.isSelectAll = true;
                }
            }
        } else {
            this.selectedItems = [];
        }
    }

    //From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    //From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }
    trackByFn(index: number, item: any) {
        return item[this.settings.primaryKey];
    }
    isSelected(clickedItem: any) {
        let found = false;
        this.selectedItems && this.selectedItems.forEach(item => {
            if (clickedItem[this.settings.primaryKey] === item[this.settings.primaryKey]) {
                found = true;
            }
        });
        return found;
    }
    addSelected(item: any, index: number) {
        if (this.settings.singleSelection) {
            this.selectedItems = [];
            this.selectedItems.push(item);
            this.closeDropdown();
        }
        else {
            this.selectedItems.push(item);
        }
        if (this.isRearrangeable) {
            this.rearrangeItems(this.data, index, 0);
        }
        this.onChangeCallback(this.selectedItems);
        this.onTouchedCallback(this.selectedItems);
    }
    removeSelected(clickedItem: any, index: number) {
        this.selectedItems && this.selectedItems.forEach(item => {
            if (clickedItem[this.settings.primaryKey] === item[this.settings.primaryKey]) {
                this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
            }
        });
        if (this.isRearrangeable) {
            this.rearrangeItems(this.data, index, this.data.length - 1);
        }
        this.onChangeCallback(this.selectedItems);
        this.onTouchedCallback(this.selectedItems);
    }
    toggleDropdown(evt: any) {
        if (this.settings.disabled) {
            return false;
        }
        this.isActive = !this.isActive;
        if (this.isActive) {
            if (this.settings.searchAutofocus && this.settings.enableSearchFilter && !this.searchTempl) {
                setTimeout(() => {
                    this.searchInput.nativeElement.focus();
                }, 0);
            }
            this.onOpen.emit(true);
        }
        else {
            this.onClose.emit(false);
        }
        evt.preventDefault();
    }
    closeDropdown() {
        if (this.searchInput && this.settings.lazyLoading) {
            this.searchInput.nativeElement.value = "";
            this.data = [];
            this.data = this.cachedItems;
            this.totalHeight = this.itemHeight * this.data.length;
            this.totalRows = this.data.length;
            this.updateView(this.scrollTop);
        }
        if (this.searchInput) {
            this.searchInput.nativeElement.value = "";
        }
        this.filter = "";
        this.isActive = false;
        this.onClose.emit(false);
    }
    toggleSelectAll() {
        if (!this.isSelectAll) {
            this.selectedItems = [];
            this.selectedItems = this.data.slice();
            this.isSelectAll = true;
            this.onChangeCallback(this.selectedItems);
            this.onTouchedCallback(this.selectedItems);

            this.onSelectAll.emit(this.selectedItems);
        }
        else {
            this.selectedItems = [];
            this.isSelectAll = false;
            this.onChangeCallback(this.selectedItems);
            this.onTouchedCallback(this.selectedItems);

            this.onDeSelectAll.emit(this.selectedItems);
        }
    }
    transformData(arr: Array<any>, field: any): Array<any> {
        const groupedObj: any = arr.reduce((prev: any, cur: any) => {
            if (!prev[cur[field]]) {
                prev[cur[field]] = [cur];
            } else {
                prev[cur[field]].push(cur);
            }
            return prev;
        }, {});
        const tempArr: any = [];
        Object.keys(groupedObj).map(function (x) {
            tempArr.push({ key: x, value: groupedObj[x] });
        });
        return tempArr;
    }
    renderChunk(fromPos: any, howMany: any) {
        this.chunkArray = [];
        this.chunkIndex = [];
        var finalItem = fromPos + howMany;
        if (finalItem > this.totalRows)
            finalItem = this.totalRows;

        for (var i = fromPos; i < finalItem; i++) {
            this.chunkIndex.push((i * this.itemHeight) + 'px');
            this.chunkArray.push(this.data[i]);
        }
    }
    public onScroll(e: any) {
        this.scrollTop = e.target.scrollTop;
        this.updateView(this.scrollTop);

    }
    public updateView(scrollTop: any) {
        var scrollPos = scrollTop ? scrollTop : 0;
        var first = (scrollPos / this.itemHeight) - this.screenItemsLen;
        var firstTemp = "" + first;
        first = parseInt(firstTemp) < 0 ? 0 : parseInt(firstTemp);
        this.renderChunk(first, this.cachedItemsLen);
        this.lastRepaintY = scrollPos;
    }
    public filterInfiniteList(evt: any) {
        var filteredElems: Array<any> = [];
        this.data = this.cachedItems.slice();
        if (evt.target.value.toString() != '') {
            this.data.filter(function (el: any) {
                for (var prop in el) {
                    if (el[prop].toString().toLowerCase().indexOf(evt.target.value.toString().toLowerCase()) >= 0) {
                        filteredElems.push(el);
                        break;
                    }
                }
            });
            //this.cachedItems = this.data;
            this.totalHeight = this.itemHeight * filteredElems.length;
            this.totalRows = filteredElems.length;
            this.data = [];
            this.data = filteredElems;
            this.updateView(this.scrollTop);
        }
        else if (evt.target.value.toString() == '' && this.cachedItems.length > 0) {
            this.data = [];
            this.data = this.cachedItems;
            this.totalHeight = this.itemHeight * this.data.length;
            this.totalRows = this.data.length;
            this.updateView(this.scrollTop);
        }
    }
}

@NgModule({
    imports: [CommonModule, FormsModule],
    declarations: [AngularMultiSelect, ClickOutsideDirective, ScrollDirective, styleDirective, ListFilterPipe, Item, TemplateRenderer, Badge, Search, setPosition],
    exports: [AngularMultiSelect, ClickOutsideDirective, ScrollDirective, styleDirective, ListFilterPipe, Item, TemplateRenderer, Badge, Search, setPosition]
})
export class AngularMultiSelectModule { }
