import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4geodata_data_countries2 from '@amcharts/amcharts4-geodata/data/countries2';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import * as am4charts from '@amcharts/amcharts4/charts';
am4core.useTheme(am4themes_animated);
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import {DashboardServiceProxy, GetJumlahBantuanDto} from "../../shared/proxy/service-proxies";

@Component({
	selector: 'app-muka-halaman',
	templateUrl: './muka-halaman.component.html',
  providers: [DashboardServiceProxy]
})
export class MukaHalamanComponent implements OnInit, AfterViewInit {

  filter:string;
  year:string;
  chartData: any[];
  jumlahMangsa: any;
  jumlahIhsan: any;
  jumlahPinjaman: any;
  jumlahAntarabangsa: any;
  jumlahRumahBaikPulih: any;
  jumlahRumahKekal: any;
  jumlahPertanian: any;
  jumlahLain: any;

	modelFooter: NgbDateStruct;
	today = this.calendar.getToday();

	public isCollapsed = false;

	constructor(
	  private calendar: NgbCalendar,
    private _dashboardServiceProxy: DashboardServiceProxy
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

    });
  }

	ngAfterViewInit() {

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
		chart.geodataSource.events.on('parseended', function (ev) {
			const data = [];
			for (let i = 0; i < ev.target.data.features.length; i++) {
				data.push({
					id: ev.target.data.features[i].id,
					value: Math.round(Math.random() * 10000)
				});
			}
			polygonSeries.data = data;
		});

		// Set projection
		chart.projection = new am4maps.projections.Mercator();

		// Create map polygon series
		const polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

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
		polygonTemplate.tooltipText = '{name}: {value}';
		polygonTemplate.nonScalingStroke = true;
		polygonTemplate.strokeWidth = 0.5;

		// Create hover state and set alternative fill color
		const hs = polygonTemplate.states.create('hover');
		hs.properties.fill = chart.colors.getIndex(1).brighten(-0.5);

		//chart
		this.chartDashboard();
		// this.tests();
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
      // categoryAxis.renderer.grid.template.location = 1;
      // categoryAxis.renderer.labels.template.horizontalCenter = "right";
      // categoryAxis.renderer.labels.template.verticalCenter = "middle";
      // categoryAxis.renderer.labels.template.rotation = 25;

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

  chartTest(){
    this._dashboardServiceProxy.getJumlahBantuanByNegeri(
      this.year
    ).subscribe((result) => {
      let stringData = JSON.stringify(result.items);
      this.chartData = JSON.parse(stringData);

      // am4core.useTheme(am4themes_animated);

      // Create chart instance
      let chart = am4core.create("chartdivTest", am4charts.XYChart);

      // Export
      chart.exporting.menu = new am4core.ExportMenu();

      // Data for both series
      let data = [ {
        "nama_negeri": "2009",
        "bilMangsa": 23.5,
        "jumlahBantuan": 54651
      }, {
        "nama_negeri": "2010",
        "bilMangsa": 26.2,
        "jumlahBantuan": 12098
      }, {
        "nama_negeri": "2011",
        "bilMangsa": 30.1,
        "jumlahBantuan": 6541
      }, {
        "nama_negeri": "2012",
        "bilMangsa": 29.5,
        "jumlahBantuan": 28100
      }, {
        "nama_negeri": "2013",
        "bilMangsa": 30.6,
        "jumlahBantuan": 23100
      }];

      /* Create axes */
      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "nama_negeri";
      categoryAxis.renderer.minGridDistance = 30;

      /* Create value axis */
      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

      /* Create series */
      let columnSeries = chart.series.push(new am4charts.ColumnSeries());
      columnSeries.name = "bil Mangsa";
      columnSeries.dataFields.valueY = "bilMangsa";
      columnSeries.dataFields.categoryX = "nama_negeri";

      columnSeries.columns.template.tooltipText = "[#fff font-size: 15px]{name} in {categoryX}:\n[/][#fff font-size: 20px]{valueY}[/] [#fff]{additional}[/]";
      columnSeries.tooltip.label.textAlign = "middle";

      let lineSeries = chart.series.push(new am4charts.LineSeries());
      lineSeries.name = "jumlah Bantuan";
      lineSeries.dataFields.valueY = "jumlahBantuan";
      lineSeries.dataFields.categoryX = "nama_negeri";

      lineSeries.stroke = am4core.color("#fdd400");
      lineSeries.strokeWidth = 3;
      lineSeries.tooltip.label.textAlign = "middle";

      let bullet = lineSeries.bullets.push(new am4charts.Bullet());
      bullet.fill = am4core.color("#fdd400"); // tooltips grab fill from parent by default
      bullet.tooltipText = "[#fff font-size: 15px]{name} in {categoryX}:\n[/][#fff font-size: 20px]{valueY}[/] [#fff]{additional}[/]"
      let circle = bullet.createChild(am4core.Circle);
      circle.radius = 4;
      circle.fill = am4core.color("#fff");
      circle.strokeWidth = 3;

      chart.data = data;
    });
  }

  tests(){


    //---------------------------------------------------------------------------------------

//     // First value axis
//     let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
//     valueAxis.title.text = "Litres sold (M)";
//
// // Second value axis
//     let valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
//     valueAxis2.title.text = "Units sold";
//     valueAxis2.renderer.opposite = true;
//
// // First series
//     let series = chart.series.push(new am4charts.ColumnSeries());
//     series.dataFields.valueY = "litres";
//     series.dataFields.categoryX = "country";
//     series.name = "Sales";
//     series.tooltipText = "{name}: [bold]{valueY}[/]";
//
// // Second series
//     let series2 = chart.series.push(new am4charts.LineSeries());
//     series2.dataFields.valueY = "units";
//     series2.dataFields.categoryX = "country";
//     series2.name = "Units";
//     series2.tooltipText = "{name}: [bold]{valueY}[/]";
//     series2.strokeWidth = 3;
//     series2.yAxis = valueAxis2;

  }
}

