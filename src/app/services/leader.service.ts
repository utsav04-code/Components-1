import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor() { }

  getLeader() : Promise<Leader[]>
  {
    return new Promise(resolve => {
      //Simulate server latency with 2 sec delay
      setTimeout(() => resolve(LEADERS), 2000);
    });
  }

  getFeaturedLeader(): Promise<Leader> {
    return new Promise(resolve => {
      //Simulate server latency with 2 sec delay
      setTimeout(() => resolve(LEADERS. filter((lead) => (lead.featured))[0]), 2000);
  });
}
}
