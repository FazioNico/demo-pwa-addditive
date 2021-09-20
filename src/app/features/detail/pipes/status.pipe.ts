import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {

  transform(value: string): string {

    switch (true) {
      case value === '0':
        return 'OK';
      case value === '1':
        return 'à éviter';
      case value === '2':
        return 'controversé';
      case value === '3':
        return 'danger';
      default: 
        return 'danger';
    }
  }

}
