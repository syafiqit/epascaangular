import { Component, OnInit } from '@angular/core';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { DashboardTabungServiceProxy, TabungServiceProxy } from '@app/shared/proxy/service-proxies';

am4core.useTheme(am4themes_animated);

@Component({
	selector: 'app-muka-halaman-tabung',
	templateUrl: './muka-halaman-tabung.component.html'
})
export class MukaHalamanTabungComponent implements OnInit {

	public isCollapsed = false;
	public isCollapsedGraph = false;
  chooseFromDate = false;
	tarikhMula: NgbDateStruct;
  tarikhTamat: NgbDateStruct;
	today = this.calendar.getToday();
  readonly DELIMITER = '-';

  funds: any;
  year: string;
  filterTabung: number;
  filterYear: number;
  filterFromDate: string;
  filterToDate: string;
  filterFromSkb: number;
  filterToSkb: number;

  overallTotal: number;
  expendTotal: number;
  dependTotal: number;
  netTotal: number;
  arrayYear:any[];
  nama_tabung: string;

  pieTanggunganBelanja: any[];
  graphBayaranSkb: any[];
  graphBayaranTerus: any[];

  filterMonth: string;
  jumlah_keseluruhan: number;
  jumlah_perbelanjaan_semasa: number;
  jumlah_tanggungan: number;

	constructor(
    private calendar: NgbCalendar,
    private _tabungServiceProxy: TabungServiceProxy,
    private _dashboardTabungServiceProxy: DashboardTabungServiceProxy
  ) { }

	ngOnInit(): void {
    this.getTabung();
    this.getTotalCard();
    this.tabungCard();
	  this.generateArrayOfYears()
  }

	ngAfterViewInit() {
    am4core.useTheme(am4themes_animated);
    am4core.addLicense('CH265473272');
    am4core.addLicense('MP265473272');

    this.pieTanggungan();
    this.skbGraph();
    this.terusGraph();
	}

  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day : null;
  }

  toModelSKB(date: NgbDateStruct | null): number | null {
    return date ? date.month : null;
  }

  getTotalCard(){
    this._tabungServiceProxy.getTotalTabungCard(this.filterMonth).subscribe((result) => {
      this.jumlah_keseluruhan = result.jumlah_keseluruhan;
      this.jumlah_perbelanjaan_semasa = result.jumlah_perbelanjaan_semasa;
      this.jumlah_tanggungan = result.jumlah_tanggungan;
    });
  }

  tabungCard() {
    if(this.tarikhMula){
      this.filterFromDate = this.toModel(this.tarikhMula);
    }

    if(this.tarikhTamat){
      this.filterToDate = this.toModel(this.tarikhTamat);
    }

    this._dashboardTabungServiceProxy.getTotalTabungCard(
      this.filterTabung ?? undefined,
      this.filterYear ?? undefined,
      this.filterFromDate,
      this.filterToDate
    ).subscribe((result)=>{
      this.nama_tabung = result.nama_tabung;
      this.overallTotal = result.jumlah_keseluruhan;
      this.expendTotal = result.jumlah_perbelanjaan_semasa;
      this.dependTotal = result.jumlah_tanggungan;
      this.netTotal = result.jumlah_bersih;
    });
  }

  pieTanggungan() {
    if(this.tarikhMula){
      this.filterFromDate = this.toModel(this.tarikhMula);
    }

    if(this.tarikhTamat){
      this.filterToDate = this.toModel(this.tarikhTamat);
    }

    this._dashboardTabungServiceProxy.getBelanjaTanggunganByTabung(
      this.filterTabung ?? undefined,
      this.filterYear ?? undefined,
      this.filterFromDate,
      this.filterToDate
    ).subscribe((result) => {
      let stringData = JSON.stringify(result.tabung);
      this.pieTanggunganBelanja = JSON.parse(stringData);

      let chart = am4core.create("tanggunganPerbelanjaan", am4charts.PieChart);

      chart.data = this.pieTanggunganBelanja;

      let pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "jumlah";
      pieSeries.dataFields.category = "kategori";
      pieSeries.slices.template.stroke = am4core.color("#fff");
      pieSeries.slices.template.strokeOpacity = 1;

      chart.hiddenState.properties.radius = am4core.percent(0);

      let hs = pieSeries.slices.template.states.getKey("hover");
      hs.properties.scale = 1;
      hs.properties.fillOpacity = 0.5;
    })
  }

  skbGraph() {
    if(this.tarikhMula){
      this.filterFromSkb = this.toModelSKB(this.tarikhMula);
      console.log(this.filterFromSkb);
    }

    if(this.tarikhTamat){
      this.filterToSkb = this.toModelSKB(this.tarikhTamat);
      console.log(this.filterToSkb);
    }

    this._dashboardTabungServiceProxy.getTotalSkbByMonth(
      this.filterTabung ?? undefined,
      this.filterYear ?? undefined,
      this.filterFromSkb ?? undefined,
      this.filterToSkb ?? undefined
    ).subscribe((result) => {
      let stringData = JSON.stringify(result.items);
      this.graphBayaranSkb = JSON.parse(stringData);

      let chart = am4core.create("bayaranSkb", am4charts.XYChart);

      chart.data = this.graphBayaranSkb;

      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "bulan";
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.minGridDistance = 30;

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.min = 0;
      valueAxis.numberFormatter = new am4core.NumberFormatter();
      valueAxis.numberFormatter.numberFormat = "#";

      // Create series
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = "bayaran_skb";
      series.dataFields.categoryX = "bulan";
      series.name = "bayaran_skb";
      series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
      series.columns.template.fillOpacity = .8;

      let columnTemplate = series.columns.template;
      columnTemplate.strokeWidth = 2;
      columnTemplate.strokeOpacity = 1;
    })
  }

  terusGraph() {
    if(this.tarikhMula){
      this.filterFromDate = this.toModel(this.tarikhMula);
    }

    if(this.tarikhTamat){
      this.filterToDate = this.toModel(this.tarikhTamat);
    }

    this._dashboardTabungServiceProxy.getTotalBayaranTerusByMonth(
      this.filterTabung ?? undefined,
      this.filterYear ?? undefined
    ).subscribe((result) => {
      let stringData = JSON.stringify(result.items);
      this.graphBayaranTerus = JSON.parse(stringData);

      let chart = am4core.create("bayaranTerus", am4charts.XYChart);

      chart.data = this.graphBayaranTerus;

      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "month";
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.minGridDistance = 30;

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.min = 0;
      valueAxis.numberFormatter = new am4core.NumberFormatter();
      valueAxis.numberFormatter.numberFormat = "#";

      // Create series
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = "bayaran_terus";
      series.dataFields.categoryX = "month";
      series.name = "bayaran_terus";
      series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
      series.columns.template.fillOpacity = .8;

      let columnTemplate = series.columns.template;
      columnTemplate.strokeWidth = 2;
      columnTemplate.strokeOpacity = 1;
    })
  }

  getTabung(filter?) {
		this._tabungServiceProxy.getTabungForDropdown(filter).subscribe((result) => {
			this.funds = result.items;
		});
	}

  generateArrayOfYears() {
    let max = new Date().getFullYear();
    let min = max - 9;
    let years = [];

    for (let i = max; i >= min; i--) {
      years.push(i)
    }
    this.arrayYear = years;
  }

  getFilter() {
    this.tabungCard();
    this.pieTanggungan();
    this.skbGraph();
    this.terusGraph();
  }

  resetFilter() {
    this.filterTabung = undefined;
    this.filterYear = undefined;
    this.filterFromDate = undefined;
    this.filterToDate = undefined;
    this.filterFromSkb = undefined;
    this.filterToSkb = undefined;
    this.tarikhMula = undefined;
    this.tarikhTamat = undefined;
    this.getFilter();
  }
}
