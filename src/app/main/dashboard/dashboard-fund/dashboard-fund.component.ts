import { Component, OnInit } from '@angular/core';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-dashboard-fund',
  templateUrl: './dashboard-fund.component.html'
})
export class DashboardFundComponent implements OnInit {

  public isCollapsed = false;
  modelFooter: NgbDateStruct;
  today = this.calendar.getToday();

  report = [
    { "title": "Jumlah Keseluruhan Baki Tabung", "total_kos": "400,000.00" },
    { "title": "Jumlah Baki Tabung KWABBN", "total_kos": "120,000.00" },
    { "title": "Jumlah Baki Tabung Covid", "total_kos": "40,000.00" },
    { "title": "Jumlah Pembelanjaan", "total_kos": "300,000.00" },
    { "title": "Jumlah Tanggungan", "total_kos": "50,000.00" },
    { "title": "Jumlah Komitmen SKB", "total_kos": "70,000.00" },
    { "title": "Jumlah Komitmen Pukal", "total_kos": "90,000.00" },
    { "title": "Komitmen Perolehan Secara Terus", "total_kos": "10,000.00" },
    { "title": "Komitmen Perolehan Secara Darurat", "total_kos": "20,000.00" },

  ]

  constructor(private calendar: NgbCalendar) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    let chart = am4core.create("chartdivTabung", am4charts.XYChart);
    chart.padding(40, 40, 40, 40);

    let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = "fund";
    categoryAxis.renderer.minGridDistance = 1;
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.grid.template.disabled = true;

    let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;

    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryY = "fund";
    series.dataFields.valueX = "total";
    series.tooltipText = "{valueX.value}"
    series.columns.template.strokeOpacity = 0;
    series.columns.template.column.cornerRadiusBottomRight = 5;
    series.columns.template.column.cornerRadiusTopRight = 5;

    let labelBullet = series.bullets.push(new am4charts.LabelBullet())
    labelBullet.label.horizontalCenter = "left";
    labelBullet.label.dx = 10;
    labelBullet.label.text = "{values.valueX.workingValue.formatNumber('#.0as')}";
    labelBullet.locationX = 1;

    // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
    series.columns.template.adapter.add("fill", function (fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    });

    categoryAxis.sortBySeries = series;
    chart.data = [
      {
        "fund": "KWABBN",
        "total": 120000
      },
      {
        "fund": "Covid",
        "total": 40000
      },
    ]


    let chart2 = am4core.create("chartdivPerbelanjaan", am4charts.PieChart);

    // Add data
    chart2.data = [{
      "country": "Perbelanjaan",
      "litres": 501.9
    }, {
      "country": "Tanggungan",
      "litres": 301.9
    },
    ];

    // Add and configure Series
    let pieSeries = chart2.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "litres";
    pieSeries.dataFields.category = "country";
    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeOpacity = 1;

    // This creates initial animation
    pieSeries.hiddenState.properties.opacity = 1;
    pieSeries.hiddenState.properties.endAngle = -90;
    pieSeries.hiddenState.properties.startAngle = -90;

    chart2.hiddenState.properties.radius = am4core.percent(0);


    let chart3 = am4core.create('chartdivBelanja', am4charts.XYChart)
    chart3.colors.step = 2;

    chart3.legend = new am4charts.Legend()
    chart3.legend.position = 'top'
    chart3.legend.paddingBottom = 20
    chart3.legend.labels.template.maxWidth = 95

    let xAxis = chart3.xAxes.push(new am4charts.CategoryAxis())
    xAxis.dataFields.category = 'category'
    xAxis.renderer.cellStartLocation = 0.1
    xAxis.renderer.cellEndLocation = 0.9
    xAxis.renderer.grid.template.location = 0;

    let yAxis = chart3.yAxes.push(new am4charts.ValueAxis());
    yAxis.min = 0;

    function createSeries(value, name) {
      let series = chart3.series.push(new am4charts.ColumnSeries())
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

    chart3.data = [
      {
        category: 'Januari',
        kwabbn: 40000,
        covid: 55000,
      },
      {
        category: 'Februari',
        kwabbn: 30000,
        covid: 78000,
      },
    ]


    createSeries('kwabbn', 'KWABBN');
    createSeries('covid', 'Covid-19');

    function arrangeColumns() {

      let series = chart3.series.getIndex(0);

      let w = 1 - xAxis.renderer.cellStartLocation - (1 - xAxis.renderer.cellEndLocation);
      if (series.dataItems.length > 1) {
        let x0 = xAxis.getX(series.dataItems.getIndex(0), "categoryX");
        let x1 = xAxis.getX(series.dataItems.getIndex(1), "categoryX");
        let delta = ((x1 - x0) / chart3.series.length) * w;
        if (am4core.isNumber(delta)) {
          let middle = chart3.series.length / 2;

          let newIndex = 0;
          chart3.series.each(function (series) {
            if (!series.isHidden && !series.isHiding) {
              series.dummyData = newIndex;
              newIndex++;
            }
            else {
              series.dummyData = chart3.series.indexOf(series);
            }
          })
          let visibleCount = newIndex;
          let newMiddle = visibleCount / 2;

          chart3.series.each(function (series) {
            let trueIndex = chart3.series.indexOf(series);
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
