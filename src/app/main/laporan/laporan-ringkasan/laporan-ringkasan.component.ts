import { AfterViewInit, Component } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-laporan-ringkasan',
  templateUrl: './laporan-ringkasan.component.html'
})
export class LaporanRingkasanComponent implements AfterViewInit {
	private chart: am4charts.XYChart;

	constructor( ) { }

	ngAfterViewInit() {
    am4core.useTheme(am4themes_animated);
    am4core.addLicense('CH265473272');
    am4core.addLicense('MP265473272');

    this.pieBantuan();
    this.pieSumberDana();
    this.mangsaNegeriGraph();
    this.statusBinaGraph();
    this.statusBaikiGraph();
	}

  pieBantuan() {
    let chart = am4core.create("bantuanKeseluruhan", am4charts.PieChart);

    chart.data = [
      {
        "bantuan": "Wang Ihsan",
        "jumlah": 2500
      },
      {
        "bantuan": "Bina Rumah",
        "jumlah": 1200
      },
      {
        "bantuan": "Baik Pulih",
        "jumlah": 1500
      },
      {
        "bantuan": "Pinjaman Khas",
        "jumlah": 1300
      },
      {
        "bantuan": "Bantuan Pertanian",
        "jumlah": 3100
      },
      {
        "bantuan": "Bantuan Antarabangsa",
        "jumlah": 800
      },
      {
        "bantuan": "Bantuan Lain",
        "jumlah": 3300
      }
    ];

    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "jumlah";
    pieSeries.dataFields.category = "bantuan";
    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeOpacity = 1;

    chart.hiddenState.properties.radius = am4core.percent(0);

    let hs = pieSeries.slices.template.states.getKey("hover");
    hs.properties.scale = 1;
    hs.properties.fillOpacity = 0.5;
  }

  pieSumberDana() {
    let chart = am4core.create("sumberDanaRumah", am4charts.PieChart);

    chart.data = [
      {
        "sumber": "Kerajaan Persekutuan",
        "jumlah": 750000.00
      },
      {
        "sumber": "Sumber Antarabangsa",
        "jumlah": 0.00
      },
      {
        "sumber": "Kerajaan Negeri",
        "jumlah": 280000.00
      },
      {
        "sumber": "NGO",
        "jumlah": 105000
      },
      {
        "sumber": "Lain-lain",
        "jumlah": 0.00
      }
    ];

    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "jumlah";
    pieSeries.dataFields.category = "sumber";
    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeOpacity = 1;

    chart.hiddenState.properties.radius = am4core.percent(0);

    let hs = pieSeries.slices.template.states.getKey("hover");
    hs.properties.scale = 1;
    hs.properties.fillOpacity = 0.5;
  }

  mangsaNegeriGraph() {
    let chart = am4core.create("jumlahMangsa", am4charts.XYChart);
    chart.padding(40, 40, 40, 40);

    let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = "nama_negeri";
    categoryAxis.renderer.minGridDistance = 1;
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.grid.template.disabled = true;

    let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.numberFormatter = new am4core.NumberFormatter();
    valueAxis.numberFormatter.numberFormat = "#";

    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryY = "nama_negeri";
    series.dataFields.valueX = "jumlah";
    series.tooltipText = "{valueX}";
    series.columns.template.strokeOpacity = 0;
    series.columns.template.column.cornerRadiusBottomRight = 5;
    series.columns.template.column.cornerRadiusTopRight = 5;

    let labelBullet = series.bullets.push(new am4charts.LabelBullet())
    labelBullet.label.horizontalCenter = "left";
    labelBullet.label.dx = 10;
    labelBullet.label.text = "{values.valueX.workingValue.formatNumber('#')}";
    labelBullet.locationX = 1;

    // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
    series.columns.template.adapter.add("fill", function(fill, target){
      return chart.colors.getIndex(target.dataItem.index);
    });

    categoryAxis.sortBySeries = series;

    chart.numberFormatter.numberFormat = "#";
    chart.data = [
      {
        "nama_negeri": "Wilayah Persekutuan",
        "jumlah": 1500
      },
      {
        "nama_negeri": "Johor",
        "jumlah": 970
      },
      {
        "nama_negeri": "Kedah",
        "jumlah": 1050
      },
      {
        "nama_negeri": "Kelantan",
        "jumlah": 3700
      }
    ];
  }

  statusBinaGraph() {
    let chart = am4core.create("bilBinaRumah", am4charts.XYChart3D);

    // Add data
    chart.data = [
      {
        "nama_negeri": "Kelantan",
        "belum_mula": 150,
        "pra_bina": 75,
        "bina": 38,
        "siap_sepenuhnya": 50
      },
      {
        "nama_negeri": "Kedah",
        "belum_mula": 76,
        "pra_bina": 50,
        "bina": 28,
        "siap_sepenuhnya": 33
      },
      {
        "nama_negeri": "Selangor",
        "belum_mula": 42,
        "pra_bina": 12,
        "bina": 19,
        "siap_sepenuhnya": 9
      },
      {
        "nama_negeri": "Wilayah Persekutuan",
        "belum_mula": 10,
        "pra_bina": 6,
        "bina": 1,
        "siap_sepenuhnya": 0
      }
    ];

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "nama_negeri";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Bilangan Rumah";
    valueAxis.renderer.labels.template.adapter.add("text", function(text) {
      return text + "";
    });

    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries3D());
    series.dataFields.valueY = "siap_sepenuhnya";
    series.dataFields.categoryX = "nama_negeri";
    series.name = "Siap Sepenuhnya";
    series.clustered = false;
    series.columns.template.tooltipText = "Bilangan Rumah {category} (Siap Sepenuhnya): [bold]{valueY}[/]";
    series.columns.template.fillOpacity = 0.9;

    let series2 = chart.series.push(new am4charts.ColumnSeries3D());
    series2.dataFields.valueY = "bina";
    series2.dataFields.categoryX = "nama_negeri";
    series2.name = "Bina";
    series2.clustered = false;
    series2.columns.template.tooltipText = "Bilangan Rumah {category} (Bina): [bold]{valueY}[/]";

    let series3 = chart.series.push(new am4charts.ColumnSeries3D());
    series3.dataFields.valueY = "pra_bina";
    series3.dataFields.categoryX = "nama_negeri";
    series3.name = "Pra Bina";
    series3.clustered = false;
    series3.columns.template.tooltipText = "Bilangan Rumah {category} (Pra Bina): [bold]{valueY}[/]";

    let series4 = chart.series.push(new am4charts.ColumnSeries3D());
    series4.dataFields.valueY = "belum_mula";
    series4.dataFields.categoryX = "nama_negeri";
    series4.name = "Belum Mula";
    series4.clustered = false;
    series4.columns.template.tooltipText = "Bilangan Rumah {category} (Belum Mula) : [bold]{valueY}[/]";
  }

  statusBaikiGraph() {
    let chart = am4core.create("bilBaikiRumah", am4charts.XYChart3D);

    // Add data
    chart.data = [
      {
        "nama_negeri": "Kelantan",
        "belum_mula": 50,
        "pra_bina": 35,
        "bina": 18,
        "siap_sepenuhnya": 10
      },
      {
        "nama_negeri": "Kedah",
        "belum_mula": 46,
        "pra_bina": 40,
        "bina": 28,
        "siap_sepenuhnya": 13
      },
      {
        "nama_negeri": "Selangor",
        "belum_mula": 42,
        "pra_bina": 12,
        "bina": 19,
        "siap_sepenuhnya": 9
      },
      {
        "nama_negeri": "Wilayah Persekutuan",
        "belum_mula": 10,
        "pra_bina": 6,
        "bina": 1,
        "siap_sepenuhnya": 0
      }
    ];

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "nama_negeri";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Bilangan Rumah";
    valueAxis.renderer.labels.template.adapter.add("text", function(text) {
      return text + "";
    });

    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries3D());
    series.dataFields.valueY = "siap_sepenuhnya";
    series.dataFields.categoryX = "nama_negeri";
    series.name = "Siap Sepenuhnya";
    series.clustered = false;
    series.columns.template.tooltipText = "Bilangan Rumah {category} (Siap Sepenuhnya): [bold]{valueY}[/]";
    series.columns.template.fillOpacity = 0.9;

    let series2 = chart.series.push(new am4charts.ColumnSeries3D());
    series2.dataFields.valueY = "bina";
    series2.dataFields.categoryX = "nama_negeri";
    series2.name = "Bina";
    series2.clustered = false;
    series2.columns.template.tooltipText = "Bilangan Rumah {category} (Bina): [bold]{valueY}[/]";

    let series3 = chart.series.push(new am4charts.ColumnSeries3D());
    series3.dataFields.valueY = "pra_bina";
    series3.dataFields.categoryX = "nama_negeri";
    series3.name = "Pra Bina";
    series3.clustered = false;
    series3.columns.template.tooltipText = "Bilangan Rumah {category} (Pra Bina): [bold]{valueY}[/]";

    let series4 = chart.series.push(new am4charts.ColumnSeries3D());
    series4.dataFields.valueY = "belum_mula";
    series4.dataFields.categoryX = "nama_negeri";
    series4.name = "Belum Mula";
    series4.clustered = false;
    series4.columns.template.tooltipText = "Bilangan Rumah {category} (Belum Mula) : [bold]{valueY}[/]";
  }
}
