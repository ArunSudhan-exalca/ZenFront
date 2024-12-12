import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterpipesPipe implements PipeTransform {

  
  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;

    searchText = searchText.toLowerCase();

    return items.filter(item => {
      return item.property.toLowerCase().includes(searchText); // Adjust 'property' to the property you want to filter by
    });
    // transform(value: unknown, ...args: unknown[]): unknown {
    //   return null;
    // }

  }
}
