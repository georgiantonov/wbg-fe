import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LayerDescriptor } from '../types/layer-descriptor';
import { OverlayListResponse } from '../types/overlay-list-response';

const baseUrl = 'http://localhost:8000';
const layersRoute = 'map-layers';
const overlaysRoute = 'overlays';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient ) { }

  public getLayerData(endpoint: string): Observable<LayerDescriptor> {
    return this.http.get<LayerDescriptor>(`${baseUrl}/${layersRoute}/${endpoint}`);
  }
  
  public getOverlays(endpoint: string): Observable<OverlayListResponse> {
    return this.http.get<OverlayListResponse>(`${baseUrl}/${overlaysRoute}/${endpoint}`);
  }

}
