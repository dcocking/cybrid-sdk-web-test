"use strict";(self.webpackChunkdemo=self.webpackChunkdemo||[]).push([["src_demo_modules_demo-viewer_demo-viewer_module_ts"],{5404:(B,C,i)=>{i.r(C),i.d(C,{DemoViewerModule:()=>U});var g=i(6895),u=i(4931),c=i(4006),v=i(7579),d=i(2722),m=i(8505),h=i(9386),S=i(8842),$=i(422),e=i(4650);let b=(()=>{class o{constructor(){this.route=new v.x,this.route$=this.route.asObservable()}updateRoute(t){this.route.next(t)}}return o.\u0275fac=function(t){return new(t||o)},o.\u0275prov=e.Yz7({token:o,factory:o.\u0275fac,providedIn:"root"}),o})();var w=i(1679),V=i(7769),y=i(9549),G=i(4385),O=i(3238),R=i(266);function P(o,s){if(1&o&&(e.TgZ(0,"mat-option",7),e._uU(1),e.qZA()),2&o){const t=s.$implicit,n=e.oxw();e.Q6J("value",t)("disabled",n.isDisabled(t))("matTooltip",n.getTooltip(t)),e.xp6(1),e.hij(" ",t," ")}}function F(o,s){if(1&o&&(e.TgZ(0,"mat-option",8),e._uU(1),e.qZA()),2&o){const t=s.$implicit;e.Q6J("value",t),e.xp6(1),e.hij(" ",t," ")}}let L=(()=>{class o{constructor(t,n,r,a,l,p){this.demoViewerService=t,this.activatedRoute=n,this.configService=r,this.authService=a,this.location=l,this.router=p,this.languageList=h.gT.SUPPORTED_LOCALES,this.componentList=h.gT.COMPONENTS_PLAID,this.languageGroup=new c.cw({language:new c.NI(h.gT.DEFAULT_CONFIG.locale)}),this.componentGroup=new c.cw({component:new c.NI(this.activatedRoute.snapshot)}),this.message="",this.config=h.gT.DEFAULT_CONFIG,this.unsubscribe$=new v.x,this.configService.config$.pipe((0,d.R)(this.unsubscribe$)).subscribe(f=>this.config=f),console.log(`demo-viewer: ${this.location.path(!0)}`)}ngOnInit(){this.initComponentGroup(),this.initLanguageGroup()}isBackstopped(){return this.config.features.includes($.mS.FeaturesEnum.BackstoppedFundingSource)}getTooltip(t){return"account-details"==t?"Disabled: Navigate via account-list":this.authService.customer==S.N.credentials.publicCustomerGuid&&"identity-verification"==t?"Disabled: Sign in as a private user to access":this.isBackstopped()&&this.isDisabled(t)?"Component is unavailable to backstopped banks":""}isDisabled(t){return"account-details"==t||this.authService.customer==S.N.credentials.publicCustomerGuid&&"identity-verification"==t||!!this.isBackstopped()&&!h.gT.COMPONENTS_BACKSTOPPED.includes(t)}initComponentGroup(){this.componentGroup.get("component")?.valueChanges.pipe((0,d.R)(this.unsubscribe$),(0,m.b)(t=>this.router.navigate([`demo/${t}`]))).subscribe(),this.demoViewerService.route$.pipe((0,m.b)(t=>this.componentGroup.get("component")?.patchValue(t,{emitEvent:!1,onlySelf:!0}))).subscribe()}initLanguageGroup(){this.languageGroup.get("language")?.valueChanges.pipe((0,d.R)(this.unsubscribe$),(0,m.b)(t=>this.configService.setConfig({...this.config,locale:t}))).subscribe()}}return o.\u0275fac=function(t){return new(t||o)(e.Y36(b),e.Y36(u.gz),e.Y36(w.E),e.Y36(V.e),e.Y36(g.Ye),e.Y36(u.F0))},o.\u0275cmp=e.Xpm({type:o,selectors:[["app-sdk"]],decls:14,vars:4,consts:[[1,"controls"],[3,"formGroup"],["appearance","outline"],["id","component","formControlName","component"],["id","option","matTooltipPosition","before",3,"value","disabled","matTooltip",4,"ngFor","ngForOf"],["formControlName","language"],[3,"value",4,"ngFor","ngForOf"],["id","option","matTooltipPosition","before",3,"value","disabled","matTooltip"],[3,"value"]],template:function(t,n){1&t&&(e.TgZ(0,"div",0),e.ynx(1,1),e.TgZ(2,"mat-form-field",2)(3,"mat-label"),e._uU(4,"Component"),e.qZA(),e.TgZ(5,"mat-select",3),e.YNc(6,P,2,4,"mat-option",4),e.qZA()(),e.BQk(),e.ynx(7,1),e.TgZ(8,"mat-form-field",2)(9,"mat-label"),e._uU(10,"Language"),e.qZA(),e.TgZ(11,"mat-select",5),e.YNc(12,F,2,2,"mat-option",6),e.qZA()(),e.BQk(),e.qZA(),e._UZ(13,"router-outlet")),2&t&&(e.xp6(1),e.Q6J("formGroup",n.componentGroup),e.xp6(5),e.Q6J("ngForOf",n.componentList),e.xp6(1),e.Q6J("formGroup",n.languageGroup),e.xp6(5),e.Q6J("ngForOf",n.languageList))},dependencies:[g.sg,u.lC,c.JJ,c.JL,c.sg,c.u,y.KE,y.hX,G.gD,O.ey,R.gM],styles:[".controls[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;margin-left:-1rem}.controls[_ngcontent-%COMP%]   mat-form-field[_ngcontent-%COMP%]{flex:1;margin-left:1rem}"]}),o})();var N=i(4707),D=i(9841),x=i(5698),Y=i(4004);const Z=["outlet"],A=[{path:"",component:L,children:[{path:":id",component:(()=>{class o{constructor(t,n,r,a,l){this.demoViewerService=t,this.activatedRoute=n,this.configService=r,this._renderer2=a,this.location=l,this.sdk=new N.t(1),this.sdk$=this.sdk.asObservable().pipe(),this.auth=window.localStorage.getItem("customer"),this.unsubscribe$=new v.x}ngAfterViewInit(){(0,D.a)([this.activatedRoute.params,this.configService.config]).pipe((0,x.q)(1),(0,Y.U)(t=>{const[n,r]=t,a=this._renderer2.createElement("cybrid-app");this._renderer2.setProperty(a,"auth",this.auth),this._renderer2.setProperty(a,"config",r),this._renderer2.setProperty(a,"component",n.id),console.log(`demo-details: ${this.location.path(!0)}`);const l=new URLSearchParams(window.location.search);return console.log(`demo details window: ${l}`),this.location.replaceState(`demo/${n.id+l}`),this._renderer2.listen(a,"eventLog",p=>{console.log(p.detail);const f=p.detail;if("ROUTING_END"===f.code){const T=f.data.default;this.demoViewerService.updateRoute(T),this.location.replaceState(`demo/${T+l}`)}}),this._renderer2.listen(a,"errorLog",p=>console.error(p.detail)),this._renderer2.appendChild(this.outlet?.nativeElement,a),a}),(0,m.b)(t=>this.sdk.next(t))).subscribe(),(0,D.a)([this.activatedRoute.params,this.sdk$]).pipe((0,d.R)(this.unsubscribe$),(0,m.b)(t=>{const[n,r]=t;this._renderer2.setProperty(r,"component",n.id)})).subscribe(),(0,D.a)([this.configService.config,this.sdk$]).pipe((0,d.R)(this.unsubscribe$),(0,m.b)(t=>{const[n,r]=t;this._renderer2.setProperty(r,"config",n)})).subscribe()}ngOnDestroy(){this.unsubscribe$.next(""),this.unsubscribe$.complete()}}return o.\u0275fac=function(t){return new(t||o)(e.Y36(b),e.Y36(u.gz),e.Y36(w.E),e.Y36(e.Qsj),e.Y36(g.Ye))},o.\u0275cmp=e.Xpm({type:o,selectors:[["app-demo-component"]],viewQuery:function(t,n){if(1&t&&e.Gf(Z,5),2&t){let r;e.iGM(r=e.CRH())&&(n.outlet=r.first)}},decls:2,vars:0,consts:[["outlet",""]],template:function(t,n){1&t&&e._UZ(0,"div",null,0)}}),o})()}]}];let E=(()=>{class o{}return o.\u0275fac=function(t){return new(t||o)},o.\u0275mod=e.oAB({type:o}),o.\u0275inj=e.cJS({imports:[u.Bz.forChild(A),u.Bz]}),o})();var M=i(962);let U=(()=>{class o{}return o.\u0275fac=function(t){return new(t||o)},o.\u0275mod=e.oAB({type:o}),o.\u0275inj=e.cJS({providers:[b],imports:[g.ez,E,c.UX,M.q]}),o})()}}]);