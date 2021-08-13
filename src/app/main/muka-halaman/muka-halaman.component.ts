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
      let stringJumlah = JSON.stringify(result.jumlahMangsa);
      this.jumlahMangsa = JSON.parse(stringJumlah);

      let stringIhsan = JSON.stringify(result.bantuanBwi);
      this.jumlahIhsan = JSON.parse(stringIhsan);

      let stringPinjaman = JSON.stringify(result.bantuanPinjaman);
      this.jumlahPinjaman = JSON.parse(stringPinjaman);

      let stringAntarabangsa = JSON.stringify(result.bantuanAntarabangsa);
      this.jumlahAntarabangsa = JSON.parse(stringAntarabangsa);

      let stringRumahBaikPulih = JSON.stringify(result.bantuanRumahBaikPulih);
      this.jumlahRumahBaikPulih = JSON.parse(stringRumahBaikPulih);

      let stringRumahKekal = JSON.stringify(result.bantuanRumahKekal);
      this.jumlahRumahKekal = JSON.parse(stringRumahKekal);

      let stringPertanian = JSON.stringify(result.bantuanPertanian);
      this.jumlahPertanian = JSON.parse(stringPertanian);

      let stringLain = JSON.stringify(result.bantuanLain);
      this.jumlahLain = JSON.parse(stringLain);

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

		this.chartDashboard();
	}

	chartDashboard(){

    this._dashboardServiceProxy.getJumlahBantuanByNegeri(
      this.year
    ).subscribe((result) => {
        let stringData = JSON.stringify(result.items);
        this.chartData = JSON.parse(stringData);

      const chart2 = am4core.create('chartdiv2', am4charts.XYChart);
      chart2.colors.step = 2;

      chart2.legend = new am4charts.Legend();
      chart2.legend.position = 'top';
      chart2.legend.paddingBottom = 20;
      chart2.legend.labels.template.maxWidth = 95;

      const xAxis = chart2.xAxes.push(new am4charts.CategoryAxis());
      xAxis.dataFields.category = 'nama_negeri';
      xAxis.renderer.cellStartLocation = 0.1;
      xAxis.renderer.cellEndLocation = 0.9;
      xAxis.renderer.grid.template.location = 0;
      xAxis.renderer.minGridDistance = 30;

      // Setting up label rotation
      // xAxis.renderer.labels.template.rotation = 60;
      // xAxis.renderer.labels.template.verticalCenter = "middle";
      // xAxis.renderer.labels.template.horizontalCenter = "left";

      const yAxis = chart2.yAxes.push(new am4charts.ValueAxis());
      yAxis.min = 0;

      function createSeries(value, name) {
        const series = chart2.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = value;
        series.dataFields.categoryX = 'nama_negeri';
        series.dataFields.categoryX.fontsize('5');
        series.name = name;

        series.columns.template.tooltipText = "{nama_negeri}\n Bil. Mangsa: [bold]{bilMangsa} Orang[/]\n Kos Bantuan: [bold]RM {jumlahBantuan}[/]";

        series.events.on('hidden', arrangeColumns);
        series.events.on('shown', arrangeColumns);

        const bullet = series.bullets.push(new am4charts.LabelBullet());
        bullet.interactionsEnabled = false;
        bullet.dy = 30;
        bullet.label.text = '{valueY}';
        bullet.label.fill = am4core.color('#ffffff');

        return series;
      }

      chart2.data = this.chartData;

      createSeries('bilMangsa', 'Bilangan Mangsa');

      function arrangeColumns() {
        const series = chart2.series.getIndex(0);

        const w = 1 - xAxis.renderer.cellStartLocation - (1 - xAxis.renderer.cellEndLocation);
        if (series.dataItems.length > 1) {
          const x0 = xAxis.getX(series.dataItems.getIndex(0), 'categoryX');
          const x1 = xAxis.getX(series.dataItems.getIndex(1), 'categoryX');
          const delta = ((x1 - x0) / chart2.series.length) * w;
          if (am4core.isNumber(delta)) {
            const middle = chart2.series.length / 2;

            let newIndex = 0;
            chart2.series.each(function (series) {
              if (!series.isHidden && !series.isHiding) {
                series.dummyData = newIndex;
                newIndex++;
              } else {
                series.dummyData = chart2.series.indexOf(series);
              }
            });
            const visibleCount = newIndex;
            const newMiddle = visibleCount / 2;

            chart2.series.each(function (series) {
              const trueIndex = chart2.series.indexOf(series);
              const newIndex = series.dummyData;

              const dx = (newIndex - trueIndex + middle - newMiddle) * delta;

              series.animate(
                { property: 'dx', to: dx },
                series.interpolationDuration,
                series.interpolationEasing
              );
              series.bulletsContainer.animate(
                { property: 'dx', to: dx },
                series.interpolationDuration,
                series.interpolationEasing
              );
            });
          }
        }
      }
    });
  }
}
