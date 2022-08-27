import {BehaviorSubject, Observable} from 'rxjs';

export type DigDataContainer = {[key: string]: BehaviorSubject<any>};

export interface DigDataSource {
  /**
   * Fetches an Observable that watches the specified registry node
   *
   * @example
   * ```typescript
   * const aboutRef: Observable<AboutPage> = dataSource.getData('about-page');
   * dataSource.subscribe(aboutData => ...do something with the about page data)
   * ```
   *
   * todo pass an optional <type> reference
   */
  getData(key: string): Observable<any | undefined>

  /**
   * Load the persisted data from the data source
   *
   * @example
   * ```typescript
   * dataSource.load();
   * ```
   */
  load(): void

  /**
   * Sets a registry node
   *
   * @example
   * ```typescript
   * dataSource.setData('about-page', {
   *   headline: 'About Us',
   *   content: 'Our team is...'
   * });
   * ```
   */
  setData(key: string, data: any): void;

  /**
   * Fetches the entire state object
   *
   * @example
   * ```typescript
   * const state: Observable<AppState> = dataSource.state()
   * ```
   *
   * You can optionally pass this a filter function
   *
   * > Note that this can also be done with the RXJS `pipe()` but our filter function is
   * > called prior to building the data object, so it is slightly more efficient
   *
   * @example
   * ```typescript
   * const teamMembers: Observable<TeamMember> = dataSource.state((node) => node.pageType === 'team-member')
   * ```
   *
   */
  state(filterFn?: (i: any) => boolean): Observable<any>
}
