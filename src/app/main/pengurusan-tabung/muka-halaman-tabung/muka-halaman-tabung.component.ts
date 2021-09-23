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

  funds: any;
  year: string;
  filterTabung: number;
  overallTotal: number;
  expendTotal: number;
  dependTotal: number;
  netTotal: number;
  arrayYear:any[];

  pieTanggunganBelanja: any[];
  graphBayaranSkb: any[];
  graphBayaranTerus: any[];

	constructor(
    private calendar: NgbCalendar,
    private _tabungServiceProxy: TabungServiceProxy,
    private _dashboardTabungServiceProxy: DashboardTabungServiceProxy
  ) { }

	ngOnInit(): void {
    this.getTabung();
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

  tabungCard() {
    this._dashboardTabungServiceProxy.getTotalTabungCard(this.filterTabung).subscribe((result)=>{
      this.overallTotal = result.jumlah_keseluruhan;
      this.expendTotal = result.jumlah_perbelanjaan_semasa;
      this.dependTotal = result.jumlah_tanggungan;
      this.netTotal = result.jumlah_bersih;
    });
  }

  pieTanggungan() {
    this._dashboardTabungServiceProxy.getBelanjaTanggunganByTabung(this.filterTabung)
    .subscribe((result) => {
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
    this._dashboardTabungServiceProxy.getTotalSkbByMonth(this.filterTabung)
    .subscribe((result) => {
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
    this._dashboardTabungServiceProxy.getTotalBayaranTerusByMonth(this.filterTabung)
    .subscribe((result) => {
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

  pilihTarikhMula(){
    this.chooseFromDate = true;
    if(this.tarikhMula == null){
      this.chooseFromDate = false;
      this.tarikhTamat = null;
    }
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
    this.getFilter();
  }
}
