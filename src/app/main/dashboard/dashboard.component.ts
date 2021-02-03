import { Component, OnInit } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_data_countries2 from "@amcharts/amcharts4-geodata/data/countries2";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4charts from "@amcharts/amcharts4/charts";
am4core.useTheme(am4themes_animated);
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  report = [
    { "title": "Jumlah Keseluruhan Mangsa", "total": "1202", "title2": "Kos Bantuan Keseluruhan", "total_kos": "20,000,000.00" },
    { "title": "Jumlah Penerima Wang Ihsan", "total": "82,528 orang", "title2": "Jumlah Bantuan Wang Ihsan", "total_kos": "15,000,000.00" },
    { "title": "Jumlah Pinjaman Khas", "total": "314 orang", "title2": "Jumlah Bantuan Pinjaman Khas", "total_kos": "15,000,000.00" },
    { "title": "Jumlah Bantuan Antarabangsa", "total": "479 orang", "title2": "Kos Bantuan", "total_kos": "400,000.00" },
    { "title": "Jumlah Rumah Dibaik Pulih", "total": "5,840 buah", "title2": "Kos Baik Pulih Rumah", "total_kos": "55,000,000.00" },
    { "title": "Jumlah Bina Rumah Kekal", "total": "1,734 buah", "title2": "Kos Bina Rumah Kekal", "total_kos": "95,000,000.00" },
    { "title": "Jumlah Bantuan Pertanian", "total": "6,116 bantuan", "title2": "Kos Bantuan", "total_kos": "7,000,000.00" },
    { "title": "Jumlah Lain-Lain Bantuan", "total": "3,116 bantuan", "title2": "Kos Bantuan", "total_kos": "31,000,000.00" },

  ]

  modelFooter: NgbDateStruct;
  today = this.calendar.getToday();

  public isCollapsed = false;

  constructor(private calendar: NgbCalendar) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {


    window.onload = function () {

      // Default map
      let defaultMap = "usaAlbersLow";

      // calculate which map to be used
      let currentMap = defaultMap;
      let title = "";
      if (am4geodata_data_countries2["MY"] !== undefined) {
        currentMap = am4geodata_data_countries2["MY"]["maps"][0];

        // add country title
        if (am4geodata_data_countries2["MY"]["country"]) {
          title = am4geodata_data_countries2["MY"]["country"];
        }

      }

      // Create map instance
      let chart = am4core.create("chartdiv", am4maps.MapChart);

      chart.titles.create().text = title;

      // Set map definition
      chart.geodataSource.url = "https://www.amcharts.com/lib/4/geodata/json/" + currentMap + ".json";
      chart.geodataSource.events.on("parseended", function (ev) {
        let data = [];
        for (var i = 0; i < ev.target.data.features.length; i++) {
          data.push({
            id: ev.target.data.features[i].id,
            value: Math.round(Math.random() * 10000)
          })
        }
        polygonSeries.data = data;
      })

      // Set projection
      chart.projection = new am4maps.projections.Mercator();

      // Create map polygon series
      let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

      //Set min/max fill color for each area
      polygonSeries.heatRules.push({
        property: "fill",
        target: polygonSeries.mapPolygons.template,
        min: chart.colors.getIndex(1).brighten(1),
        max: chart.colors.getIndex(1).brighten(-0.3)
      });

      // Make map load polygon data (state shapes and names) from GeoJSON
      polygonSeries.useGeodata = true;

      // Set up heat legend
      let heatLegend = chart.createChild(am4maps.HeatLegend);
      heatLegend.series = polygonSeries;
      heatLegend.align = "right";
      heatLegend.width = am4core.percent(25);
      heatLegend.marginRight = am4core.percent(4);
      heatLegend.minValue = 0;
      heatLegend.maxValue = 40000000;
      heatLegend.valign = "bottom";

      // Set up custom heat map legend labels using axis ranges
      let minRange = heatLegend.valueAxis.axisRanges.create();
      minRange.value = heatLegend.minValue;
      minRange.label.text = "Rendah";
      let maxRange = heatLegend.valueAxis.axisRanges.create();
      maxRange.value = heatLegend.maxValue;
      maxRange.label.text = "Tinggi";

      // Blank out internal heat legend value axis labels
      heatLegend.valueAxis.renderer.labels.template.adapter.add("text", function (labelText) {
        return "";
      });

      // Configure series tooltip
      let polygonTemplate = polygonSeries.mapPolygons.template;
      polygonTemplate.tooltipText = "{name}: {value}";
      polygonTemplate.nonScalingStroke = true;
      polygonTemplate.strokeWidth = 0.5;

      // Create hover state and set alternative fill color
      let hs = polygonTemplate.states.create("hover");
      hs.properties.fill = chart.colors.getIndex(1).brighten(-0.5);


    };

    let chart = am4core.create('chartdiv2', am4charts.XYChart)
    chart.colors.step = 2;

    chart.legend = new am4charts.Legend()
    chart.legend.position = 'top'
    chart.legend.paddingBottom = 20
    chart.legend.labels.template.maxWidth = 95

    let xAxis = chart.xAxes.push(new am4charts.CategoryAxis())
    xAxis.dataFields.category = 'category'
    xAxis.renderer.cellStartLocation = 0.1
    xAxis.renderer.cellEndLocation = 0.9
    xAxis.renderer.grid.template.location = 0;

    let yAxis = chart.yAxes.push(new am4charts.ValueAxis());
    yAxis.min = 0;

    function createSeries(value, name) {
      let series = chart.series.push(new am4charts.ColumnSeries())
      series.dataFields.valueY = value
      series.dataFields.categoryX = 'category'
      series.name = name

      series.events.on("hidden", arrangeColumns);
      series.events.on("shown", arrangeColumns);

      let bullet = series.bullets.push(new am4charts.LabelBullet())
      bullet.interactionsEnabled = false
      bullet.dy = 30;
      bullet.label.text = '{valueY}'
      bullet.label.fill = am4core.color('#ffffff')

      return series;
    }

    chart.data = [
      {
        category: 'Kelantan',
        banjir: 40,
        covid: 55,
      },
      {
        category: 'Pahang',
        banjir: 30,
        covid: 78,
      },
    ]


    createSeries('banjir', 'Banjir');
    createSeries('covid', 'Covid-19');

    function arrangeColumns() {

      let series = chart.series.getIndex(0);

      let w = 1 - xAxis.renderer.cellStartLocation - (1 - xAxis.renderer.cellEndLocation);
      if (series.dataItems.length > 1) {
        let x0 = xAxis.getX(series.dataItems.getIndex(0), "categoryX");
        let x1 = xAxis.getX(series.dataItems.getIndex(1), "categoryX");
        let delta = ((x1 - x0) / chart.series.length) * w;
        if (am4core.isNumber(delta)) {
          let middle = chart.series.length / 2;

          let newIndex = 0;
          chart.series.each(function (series) {
            if (!series.isHidden && !series.isHiding) {
              series.dummyData = newIndex;
              newIndex++;
            }
            else {
              series.dummyData = chart.series.indexOf(series);
            }
          })
          let visibleCount = newIndex;
          let newMiddle = visibleCount / 2;

          chart.series.each(function (series) {
            let trueIndex = chart.series.indexOf(series);
            let newIndex = series.dummyData;

            let dx = (newIndex - trueIndex + middle - newMiddle) * delta

            series.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
            series.bulletsContainer.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
          })
        }
      }
    }

  }

}
