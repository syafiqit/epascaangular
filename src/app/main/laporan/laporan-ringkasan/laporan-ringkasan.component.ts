import { AfterViewInit, Component } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { LaporanServiceProxy } from '@app/shared/proxy/service-proxies';
am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-laporan-ringkasan',
  templateUrl: './laporan-ringkasan.component.html'
})
export class LaporanRingkasanComponent implements AfterViewInit {
	private chart: am4charts.XYChart;

  pieBantuanMangsa: any[];
  pieDanaRumah: any[];
  pieBwiBayaran: any[];
  graphNegeriBwi: any[];
  id_jenis_bantuan: number;
  filterYear: number;
  arrayYear:any[];

  jenisBantuan = [
    { id: 2, nama_bantuan: "BINA RUMAH KEKAL" },
    { id: 3, nama_bantuan: "BAIK PULIH RUMAH" }
  ];

	constructor(
    private _laporanServiceProxy: LaporanServiceProxy
  ) { }

	ngAfterViewInit() {
    am4core.useTheme(am4themes_animated);
    am4core.addLicense('CH265473272');
    am4core.addLicense('MP265473272');

    this.pieBantuan();
    this.pieSumberDana();
    this.pieJenisBayaran();
    this.graphBwiNegeri();
    this.generateArrayOfYears();
	}

  pieBantuan() {
    this._laporanServiceProxy.getKosBantuanByJenisBantuan()
    .subscribe((result) => {
      let stringData = JSON.stringify(result.bantuan);
      this.pieBantuanMangsa = JSON.parse(stringData);

      let chart = am4core.create("jenisBantuan", am4charts.PieChart);

      chart.data = this.pieBantuanMangsa;

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

  pieSumberDana() {
    this._laporanServiceProxy.getSumberDanaRumah(this.id_jenis_bantuan)
    .subscribe((result) => {
      let stringData = JSON.stringify(result.sumber_dana);
      this.pieDanaRumah = JSON.parse(stringData);

      let chart = am4core.create("sumberDanaRumah", am4charts.PieChart);

      chart.data = this.pieDanaRumah;

      let pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "jumlah";
      pieSeries.dataFields.category = "nama_sumber_dana";
      pieSeries.slices.template.stroke = am4core.color("#fff");
      pieSeries.slices.template.strokeOpacity = 1;

      chart.hiddenState.properties.radius = am4core.percent(0);

      let hs = pieSeries.slices.template.states.getKey("hover");
      hs.properties.scale = 1;
      hs.properties.fillOpacity = 0.5;
    })
  }

  pieJenisBayaran() {
    this._laporanServiceProxy.getBilBwiKirByJenisBayaran()
    .subscribe((result) => {
      let stringData = JSON.stringify(result.items);
      this.pieBwiBayaran = JSON.parse(stringData);

      let chart = am4core.create("JenisBayaranBwi", am4charts.PieChart);

      chart.data = this.pieBwiBayaran;

      let pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "bil";
      pieSeries.dataFields.category = "kategori";
      pieSeries.slices.template.stroke = am4core.color("#fff");
      pieSeries.slices.template.strokeOpacity = 1;

      chart.hiddenState.properties.radius = am4core.percent(0);

      let hs = pieSeries.slices.template.states.getKey("hover");
      hs.properties.scale = 1;
      hs.properties.fillOpacity = 0.5;
    })
  }

  graphBwiNegeri() {
    this._laporanServiceProxy.getAllRingkasanLaporanBwiByNegeri(this.filterYear)
    .subscribe((result) => {
      let stringData = JSON.stringify(result.items);
      this.graphNegeriBwi = JSON.parse(stringData);

      let chart = am4core.create('chartdiv', am4charts.XYChart)
      chart.colors.step = 2;

      chart.legend = new am4charts.Legend()
      chart.legend.position = 'top'
      chart.legend.paddingBottom = 20
      chart.legend.labels.template.maxWidth = 95

      let xAxis = chart.xAxes.push(new am4charts.ValueAxis())
      xAxis.min = 0;

      let yAxis = chart.yAxes.push(new am4charts.CategoryAxis());
      yAxis.dataFields.category = 'kategori'
      yAxis.renderer.cellStartLocation = 0.1
      yAxis.renderer.cellEndLocation = 0.9
      yAxis.renderer.grid.template.location = 0;

      function createSeries(value, name) {
        let series = chart.series.push(new am4charts.ColumnSeries())
        series.dataFields.valueX = value
        series.dataFields.categoryY = 'kategori'
        series.name = name

        series.events.on("hidden", arrangeColumns);
        series.events.on("shown", arrangeColumns);

        let bullet = series.bullets.push(new am4charts.LabelBullet())
        bullet.interactionsEnabled = false
        bullet.dx = 30;
        bullet.label.text = '{valueX}'
        bullet.label.fill = am4core.color('#ffffff')

        return series;
      }

      chart.data = this.graphNegeriBwi;

      createSeries('jumlah_diagihkan', 'Jumlah Diagihkan');
      createSeries('jumlah_dipulangkan', 'Jumlah Dipulangkan');

      function arrangeColumns() {

        let series = chart.series.getIndex(0);

        let w = 1 - yAxis.renderer.cellStartLocation - (1 - yAxis.renderer.cellEndLocation);
        if (series.dataItems.length > 1) {
          let y0 = yAxis.getY(series.dataItems.getIndex(0), "categoryY");
          let y1 = yAxis.getY(series.dataItems.getIndex(1), "categoryY");
          let delta = ((y1 - y0) / chart.series.length) * w;
          if (am4core.isNumber(delta)) {
            let middle = chart.series.length / 2;

            let newIndex = 0;
            chart.series.each(function(series) {
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

            chart.series.each(function(series) {
              let trueIndex = chart.series.indexOf(series);
              let newIndex = series.dummyData;

              let dy = (newIndex - trueIndex + middle - newMiddle) * delta

              series.animate({ property: "dy", to: dy }, series.interpolationDuration, series.interpolationEasing);
              series.bulletsContainer.animate({ property: "dy", to: dy }, series.interpolationDuration, series.interpolationEasing);
            })
          }
        }
      }
    })
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
}
