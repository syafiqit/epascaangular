import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4geodata_data_countries2 from '@amcharts/amcharts4-geodata/data/countries2';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import * as am4charts from '@amcharts/amcharts4/charts';
am4core.useTheme(am4themes_animated);
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import {DashboardServiceProxy, RefBencanaServiceProxy, RefNegeriServiceProxy} from "../../shared/proxy/service-proxies";

@Component({
	selector: 'app-muka-halaman',
	templateUrl: './muka-halaman.component.html',
	styleUrls: ['./muka-halaman.component.scss'],
  providers: [DashboardServiceProxy]
})
export class MukaHalamanComponent implements OnInit, AfterViewInit {

  filter:string;
  year:string;
  arrayYear:any[];
  filterIdNegeri:number;
  filterIdBencana:number;
  filterYear:number;
  filterFromDate:any;
  fromDate:any;
  filterToDate:any;
  toDate:any;
  chooseFromDate = false;
  chartData: any[];
  mapData: any[];
  jumlahMangsa: any;
  jumlahIhsan: any;
  jumlahPinjaman: any;
  jumlahAntarabangsa: any;
  jumlahRumahBaikPulih: any;
  jumlahRumahKekal: any;
  jumlahPertanian: any;
  jumlahLain: any;
  states: any;
  bencanaList: any;
  readonly DELIMITER = '-';

	modelFooter: NgbDateStruct;
	today = this.calendar.getToday();

	public isCollapsed = false;
	public isCollapsedChart = false;

	constructor(
	  private calendar: NgbCalendar,
	  private _dashboardServiceProxy: DashboardServiceProxy,
	  private _refBencanaServiceProxy: RefBencanaServiceProxy,
	  private _refNegeriServiceProxy: RefNegeriServiceProxy
    ) {}

	ngOnInit(): void {
    this._dashboardServiceProxy.getJumlahBantuan(
      this.filter
    ).subscribe((result) => {
      this.jumlahMangsa = result.jumlahMangsa;

      this.jumlahIhsan = result.bantuanBwi;

      this.jumlahPinjaman = result.bantuanPinjaman;

      this.jumlahAntarabangsa = result.bantuanAntarabangsa;

      this.jumlahRumahBaikPulih = result.bantuanRumahBaikPulih;

      this.jumlahRumahKekal = result.bantuanRumahKekal;

      this.jumlahPertanian = result.bantuanPertanian;

      this.jumlahLain = result.bantuanLain;

	  this.generateArrayOfYears();
	  this.getNegeri();
	  this.getBencana();

    });
  }

	ngAfterViewInit() {
		this.mapDashboard();
		this.chartDashboard();
	}

	mapDashboard(){

		if(this.toDate){
			this.changeDateToString();
		}

		this._dashboardServiceProxy.getJumlahMangsaBencanaByNegeri(this.filterIdNegeri,this.filterIdBencana, this.filterYear, this.filterFromDate, this.filterToDate)
		.subscribe((result)=>{
			let stringData = JSON.stringify(result.items);
      		this.mapData = JSON.parse(stringData);

			am4core.addLicense('CH265473272');
			am4core.addLicense('MP265473272');
		  
			// Default map
			const defaultMap = 'usaAlbersLow';
	
			// calculate which map to be used
			let currentMap = defaultMap;
			let title = '';
			if (am4geodata_data_countries2['MY'] !== undefined) {
				currentMap = am4geodata_data_countries2['MY']['maps'][0];
	
				// add country title
				if (am4geodata_data_countries2['MY']['country']) {
					title = am4geodata_data_countries2['MY']['country'];
				}
			}
	
			// Create map instance
			const chart = am4core.create('chartdiv', am4maps.MapChart);
	
			chart.titles.create().text = title;
	
			// Set map definition
			chart.geodataSource.url = 'https://www.amcharts.com/lib/4/geodata/json/' + currentMap + '.json';
	
			// Set projection
			chart.projection = new am4maps.projections.Mercator();
	
			// Create map polygon series
			const polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
			chart.geodataSource.data = this.mapData;
			polygonSeries.data = chart.geodataSource.data;
	
			//Set min/max fill color for each area
			polygonSeries.heatRules.push({
				property: 'fill',
				target: polygonSeries.mapPolygons.template,
				min: chart.colors.getIndex(1).brighten(1),
				max: chart.colors.getIndex(1).brighten(-0.3)
			});
	
			// Make map load polygon data (state shapes and names) from GeoJSON
			polygonSeries.useGeodata = true;
	
			// Set up heat legend
			const heatLegend = chart.createChild(am4maps.HeatLegend);
			heatLegend.series = polygonSeries;
			heatLegend.align = 'right';
			heatLegend.width = am4core.percent(25);
			heatLegend.marginRight = am4core.percent(4);
			heatLegend.minValue = 0;
			heatLegend.maxValue = 40000000;
			heatLegend.valign = 'bottom';
	
			// Set up custom heat map legend labels using axis ranges
			const minRange = heatLegend.valueAxis.axisRanges.create();
			minRange.value = heatLegend.minValue;
			minRange.label.text = 'Rendah';
			const maxRange = heatLegend.valueAxis.axisRanges.create();
			maxRange.value = heatLegend.maxValue;
			maxRange.label.text = 'Tinggi';
	
			// Blank out internal heat legend value axis labels
			heatLegend.valueAxis.renderer.labels.template.adapter.add('text', function (labelText) {
				return '';
			});
	
			// Configure series tooltip
			const polygonTemplate = polygonSeries.mapPolygons.template;
			polygonTemplate.tooltipText = '{nama_negeri}\n Bilangan Mangsa: {value} \n Bilangan Bencana: {bilBencana}';
			polygonTemplate.nonScalingStroke = true;
			polygonTemplate.strokeWidth = 0.5;
	
			// Create hover state and set alternative fill color
			const hs = polygonTemplate.states.create('hover');
			hs.properties.fill = chart.colors.getIndex(1).brighten(-0.5);
			
		})
	}

	chartDashboard(){

    this._dashboardServiceProxy.getJumlahBantuanByNegeri(
      this.year
    ).subscribe((result) => {
        let stringData = JSON.stringify(result.items);
        this.chartData = JSON.parse(stringData);

      // Create chart instance
      var chart = am4core.create("chartdiv2", am4charts.XYChart);

// Add data
      chart.data = this.chartData;

// Create axes
      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "nama_negeri";
      categoryAxis.renderer.minGridDistance = 30;
      categoryAxis.renderer.grid.template.disabled = true;

      let label = categoryAxis.renderer.labels.template;
      label.truncate = true;
      label.maxWidth = 120;

// First value axis
      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.title.text = "Bilangan Mangsa";
      valueAxis.renderer.grid.template.disabled = true;

// Second value axis
      let valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis2.title.text = "Jumlah Bantuan";
      valueAxis2.renderer.opposite = true;
      valueAxis2.renderer.grid.template.disabled = true;

// First series
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = "bilMangsa";
      series.dataFields.categoryX = "nama_negeri";
      series.name = "Bilangan";
      series.tooltipText = "{name}: [bold]{valueY}[/]";

// Second series
      let series2 = chart.series.push(new am4charts.LineSeries());
      series2.dataFields.valueY = "jumlahBantuan";
      series2.dataFields.categoryX = "nama_negeri";
      series2.name = "Jumlah Bantuan (RM)";
      series2.tooltipText = "{name}: [bold]{valueY}[/]";
      series2.strokeWidth = 3;
      series2.yAxis = valueAxis2;

// Add legend
      chart.legend = new am4charts.Legend();

      // Add cursor
      chart.cursor = new am4charts.XYCursor();
    });
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day : null;
  }

  getNegeri(filter?) {
	this._refNegeriServiceProxy.getRefNegeriForDropdown(filter).subscribe((result) => {
		this.states = result.items;
	});
  }

  getBencana(filter?) {
	this._refBencanaServiceProxy.getRefBencanaForDropdown(filter).subscribe((result) => {
	  this.bencanaList = result.items;
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

  pilihTarikhMula(){
    this.chooseFromDate = true;
    if(this.fromDate == null){
      this.chooseFromDate = false;
      this.toDate = null;
    }
  }

  changeDateToString(){
	this.filterFromDate = this.toModel(this.fromDate);
	this.filterToDate = this.toModel(this.toDate);
  }

  resetMap() {
    this.filterIdBencana = undefined;
	this.filterIdNegeri = undefined;
	this.fromDate = undefined;
	this.toDate = undefined;
	this.filterYear = undefined;

    this.mapDashboard();
  }

  resetGraph() {
    this.year = undefined;

    this.chartDashboard();
  }

}

