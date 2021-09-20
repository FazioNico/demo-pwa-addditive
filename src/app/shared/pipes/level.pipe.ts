import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'level'
})
export class LevelPipe implements PipeTransform {

  transform(value: string): string {
    switch (true) {
      case value === '3':
        return 'red';
      case value === '2':
        return 'orange';
      case value === '1':
        return 'gold';
      case value === '0':
        return 'green';
      default: 
        return 'blue';
    }
  }

}
