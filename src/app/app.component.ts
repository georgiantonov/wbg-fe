import { Component, OnInit } from '@angular/core';
import { circle, latLng, Layer, tileLayer } from 'leaflet';
import { merge, Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { LayerDescriptor } from './types/layer-descriptor';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  populationDensity$:         Observable<LayerDescriptor>    = new Observable<LayerDescriptor>();
  urbanExpansionProbability$: Observable<LayerDescriptor>    = new Observable<LayerDescriptor>();
  overlays$:                  Observable<object>             = new Observable<object>();
  mergedLayers$:              Observable<Layer[]>            = new Observable<Layer[]>();
  layersControl$:             Observable<object>             = new Observable<object>();
  
  populationDensity: Layer;
  urbanExpansionProbability: Layer;
  overlaysList: Layer[] = [];
  leafletOptions = { zoom: 6, center: latLng([ 42.879966, 23.726909 ]) };
  
  constructor(private apiService: ApiService) {  }

  ngOnInit() {
    this.urbanExpansionProbability$ = this.apiService.getLayerData('urban-expansion-probabilities-2030');
    this.populationDensity$         = this.apiService.getLayerData('population-density-2015');
    this.overlays$                  = this.apiService.getOverlays('wbg-test');

    // The following configuration could be coming from options set only on the frontend
    const localConfiguration = {
      wmsServiceURL: 'http://sedac.ciesin.columbia.edu/geoserver/wms',
      isTransparent: true,
      opacity: .6
    };

    this.apiService.getOverlays('wbg-test').subscribe((res) => {
      res.overlays.forEach((overlay: any) => {
        this.overlaysList.push(circle(overlay.coords, overlay.style));
      });
    });

    this.apiService.getLayerData('population-density-2015').subscribe((res) => {
      this.populationDensity = tileLayer.wms(localConfiguration.wmsServiceURL, { 
       attribution: res.attribution,
       layers: res.layers,
       format: res.format,
       transparent: localConfiguration.isTransparent,
       opacity: localConfiguration.opacity,
     });
    });

    this.apiService.getLayerData('urban-expansion-probabilities-2030').subscribe((res) => {
      this.urbanExpansionProbability = tileLayer.wms(localConfiguration.wmsServiceURL, { 
       attribution: res.attribution,
       layers: res.layers,
       format: res.format,
       transparent: localConfiguration.isTransparent,
       opacity: localConfiguration.opacity,
      });
    });

    merge(this.populationDensity$, this.urbanExpansionProbability$, this.overlays$).subscribe(() => {
      this.mergedLayers$ = of([this.populationDensity, this.urbanExpansionProbability, ...this.overlaysList]);
      this.layersControl$ = of({
        baseLayers: {
          'Population Density 2015': this.populationDensity,
          'Probability for Urban Expansion 2030': this.urbanExpansionProbability,
        },
        overlays: {
          'Circle Blue': this.overlaysList[0],
          'Circle Red': this.overlaysList[1],
          'Circle Green': this.overlaysList[2],
        }
      });
    });
  }
}
