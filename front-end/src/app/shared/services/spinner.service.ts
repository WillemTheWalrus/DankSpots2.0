import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SpinnerService {
spinning: BehaviorSubject<number> = new BehaviorSubject(0);

    start() {
        this.spinning.next(1);
    }

	stop() {
	    this.spinning.next(-1);
	}
}
