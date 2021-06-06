import { Component, Input } from '@angular/core';
import { Layer } from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {
  @Input() mergedLayers: Layer[] = [];
  @Input() layersControl: any;
  @Input() leafletOptions: any;

  constructor() {  }
}
