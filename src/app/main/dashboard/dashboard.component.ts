import { Component, OnInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4geodata_data_countries2 from '@amcharts/amcharts4-geodata/data/countries2';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import * as am4charts from '@amcharts/amcharts4/charts';
am4core.useTheme(am4themes_animated);
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
	report = [
		{
			title: 'Jumlah Keseluruhan Mangsa',
			total: '1202',
			title2: 'Kos Bantuan Keseluruhan',
			total_kos: '20,000,000.00'
		},
		{
			title: 'Jumlah Penerima Wang Ihsan',
			total: '82,528 orang',
			title2: 'Jumlah Bantuan Wang Ihsan',
			total_kos: '15,000,000.00'
		},
		{
			title: 'Jumlah Pinjaman Khas',
			total: '314 orang',
			title2: 'Jumlah Bantuan Pinjaman Khas',
			total_kos: '15,000,000.00'
		},
		{ title: 'Jumlah Bantuan Antarabangsa', total: '479 orang', title2: 'Kos Bantuan', total_kos: '400,000.00' },
		{
			title: 'Jumlah Rumah Dibaik Pulih',
			total: '5,840 buah',
			title2: 'Kos Baik Pulih Rumah',
			total_kos: '55,000,000.00'
		},
		{
			title: 'Jumlah Bina Rumah Kekal',
			total: '1,734 buah',
			title2: 'Kos Bina Rumah Kekal',
			total_kos: '95,000,000.00'
		},
		{ title: 'Jumlah Bantuan Pertanian', total: '6,116 bantuan', title2: 'Kos Bantuan', total_kos: '7,000,000.00' },
		{ title: 'Jumlah Lain-Lain Bantuan', total: '3,116 bantuan', title2: 'Kos Bantuan', total_kos: '31,000,000.00' }
	];

	modelFooter: NgbDateStruct;
	today = this.calendar.getToday();

	public isCollapsed = false;

	constructor(private calendar: NgbCalendar) {}

	ngOnInit(): void {}

	ngAfterViewInit() {
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

		const chart2 = am4core.create('chartdiv2', am4charts.XYChart);
		chart2.colors.step = 2;

		chart2.legend = new am4charts.Legend();
		chart2.legend.position = 'top';
		chart2.legend.paddingBottom = 20;
		chart2.legend.labels.template.maxWidth = 95;

		const xAxis = chart2.xAxes.push(new am4charts.CategoryAxis());
		xAxis.dataFields.category = 'category';
		xAxis.renderer.cellStartLocation = 0.1;
		xAxis.renderer.cellEndLocation = 0.9;
		xAxis.renderer.grid.template.location = 0;

		const yAxis = chart2.yAxes.push(new am4charts.ValueAxis());
		yAxis.min = 0;

		function createSeries(value, name) {
			const series = chart2.series.push(new am4charts.ColumnSeries());
			series.dataFields.valueY = value;
			series.dataFields.categoryX = 'category';
			series.name = name;

			series.events.on('hidden', arrangeColumns);
			series.events.on('shown', arrangeColumns);

			const bullet = series.bullets.push(new am4charts.LabelBullet());
			bullet.interactionsEnabled = false;
			bullet.dy = 30;
			bullet.label.text = '{valueY}';
			bullet.label.fill = am4core.color('#ffffff');

			return series;
		}

		chart2.data = [
			{
				category: 'Kelantan',
				banjir: 40,
				covid: 55
			},
			{
				category: 'Pahang',
				banjir: 30,
				covid: 78
			}
		];

		createSeries('banjir', 'Banjir');
		createSeries('covid', 'Covid-19');

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
	}
}
