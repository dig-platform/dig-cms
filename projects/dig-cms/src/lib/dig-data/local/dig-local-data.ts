import {DigDataContainer, DigDataSource, DigIdentity} from '../dig-data';
import {BehaviorSubject, combineLatest, map, Observable, of} from 'rxjs';

/**
 * Connects Dig to localStorage
 */
export class DigLocalData implements DigDataSource{
  private registry: DigDataContainer = {};
  private prefix = `digcms`;

  /**
   * Fetches an Observable that watches the specified registry key
   *
   * @example
   * ```typescript
   * const aboutRef: Observable<AboutPage> = digLocalData.getData('about-page');
   * aboutRef.subscribe(aboutData => ...do something with the about page data)
   * ```
   *
   * todo pass an optional <type> reference
   */
  getData(key: string): Observable<any | undefined> {
    const json = localStorage.getItem(this.getStorageKey(key));
    const data: any = json ? JSON.parse(json) : null;
    if (! this.keyExists(key)) {
      this.createRegistryEntry(key, data);
    } else {
      this.registry[key].next(data);
    }
    return this.registry[key].asObservable();
  }

  /**
   * Determines if a key exists in the registry
   *
   * @example
   * ```typescript
   * const hasHeadline: boolean = digLocalData.keyExists('headline')
   * ```
   */
  keyExists(key: string): boolean {
    return this.registry.hasOwnProperty(key);
  }

  /**
   * Load the persisted data from local storage
   * > Note that this does not happen automatically
   *
   * @example
   * ```typescript
   * digLocalData.load();
   * ```
   */
  load(): void {
    for (let i = 0; i < localStorage.length; i++) {
      const key: string | null = localStorage.key(i);
      if (! key || ! this.isDig(key)) {
        return;
      }
      const json = localStorage.getItem(key);
      const data = json ? JSON.parse(json) : null;
      this.setData(this.getBaseKey(key), data);
    }
  }

  /**
   * Sets a registry node
   *
   * @example
   * ```typescript
   * digLocalData.setData('about-page', {
   *   headline: 'About Us',
   *   content: 'Our team is...'
   * });
   * ```
   */
  setData(key: string, data: any): void {
    localStorage.setItem(this.getStorageKey(key), JSON.stringify(data));
    if (! this.keyExists(key)) {
      this.createRegistryEntry(key, data);
    } else {
      this.registry[key].next(data);
    }
  }

  /**
   * Fetches the entire state object
   *
   * @example
   * ```typescript
   * const state: Observable<AppState> = digLocalData.state()
   * ```
   *
   * You can optionally pass this a filter function
   *
   * > Note that this can also be done with the RXJS `pipe()` but our filter function is
   * > called prior to building the data object, so it is slightly more efficient
   *
   * @example
   * ```typescript
   * const teamMembers: Observable<TeamMember> = digLocalData.state((node) => node.pageType === 'team-member')
   * ```
   *
   */
  state(filterFn: (i: any) => boolean = (i: any) => true): Observable<any> {
    const keys: string[] = Object.keys(this.registry);
    return combineLatest(Object.values(this.registry)).pipe(
      map((data: any[]) => {
        let state: any;
        return data
          .map((value: any, i: number) => ({key: keys[i], value}))
          .filter(node => filterFn(node.value))
          .reduce((dataMap, node) => {
            return {...dataMap, [node.key]: node.value}
          }, state);
      })
    )
  }

  /**
   * Completes the BehaviorSubject to notify any subscribers before removing it
   * then deletes an the from the registry and local storage
   *
   * @example
   * ```typescript
   * digLocalData.delete('old-page')
   * ```
   */
  delete(key: string) {
    const subject = this.registry[key];
    subject.complete();
    delete this.registry[key];
    localStorage.removeItem(this.getStorageKey(key));
  }

  /**
   * Resets the entire state object and clears all dig entries from local storage
   *
   * @example
   * ```typescript
   * digLocalData.reset();
   * ```
   */
  reset() {
    // clear local storage
    for (let i = 0; i < localStorage.length; i++) {
      const key: string | null = localStorage.key(i);
      if (! key || ! this.isDig(key)) {
        return;
      }
      this.delete(this.getBaseKey(key));
    }
  }

  /**
   * get the dig storage key
   */
  getStorageKey(key: string): string {
    return this.prefix + '-' + key;;
  }

  /**
   * get the base key from a storage key
   */
  getBaseKey(storagekey: string): string {
    return storagekey.replace(this.prefix + '-', '').trim();
  }

  /**
   * determine if a key is a dig storage key
   */
  isDig(key: string): boolean {
    return key.includes(this.prefix, 0);
  }

  /**
   *
   * internal function to register an entry
   */
  private createRegistryEntry(key: string, data: any): void {
    if (this.keyExists(key)) {
      throw new Error(`Unable to create registry entry "${key}". Key already exists.`);
    }
    this.registry[key] = new BehaviorSubject<any>(data);
  }
}
