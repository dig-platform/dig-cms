import { DigLocalData } from './dig-local-data';
import {finalize, firstValueFrom, lastValueFrom, map, take} from 'rxjs';

fdescribe('DigLocalData', () => {
  const tester = 'tester';
  const testData = [
    {
      key: 'test1',
      value: {test: true}
    },
    {
      key: 'test2',
      value: {testObj: {test: true}}
    },
    {
      key: 'test3',
      value: {testObj: {test: true}}
    },
  ];
  let digLocalData: DigLocalData;
  beforeEach(async () => {
    digLocalData = new DigLocalData();
    testData.map(node => digLocalData.setData(node.key, node.value));
  })
  afterEach(async () => {
    localStorage.removeItem(digLocalData.getStorageKey(tester));
  });
  it('should create an instance', () => {
    expect(new DigLocalData()).toBeTruthy();
  });
  it('should determine if a key is in the Dig namespace', () => {
    expect(digLocalData.isDig('digcms-' + tester)).toBeTrue();
    expect(digLocalData.isDig('junk-' + tester)).toBeFalse();
  });
  it('should generate a key in the Dig namespace', () => {
    const key = digLocalData.getStorageKey(tester)
    expect(key).toEqual('digcms-' + tester);
  });
  it('should return the base key', () => {
    const key = digLocalData.getBaseKey('digcms-' + tester)
    expect(key).toEqual(tester);
  });
  it('should set data', () => {
    digLocalData.setData(tester, {test: true});
    const key = digLocalData.getStorageKey(tester);
    expect(localStorage.getItem(key)).toBeTruthy();
  });
  it('should get data', async () => {
    digLocalData.setData(tester, {test: true});
    const data = await firstValueFrom(digLocalData.getData(tester));
    expect(data.test).toBeTrue();
  });
  it('should get data ref if it has not been set previously', async () => {
    const before = await firstValueFrom(digLocalData.getData(tester));
    expect(before).toBeNull();
  });
  it('should update data', async () => {
    const ref = digLocalData.getData(tester);
    digLocalData.setData(tester, {name: 'forrest'});
    const data = await firstValueFrom(ref);
    expect(data.name).toEqual('forrest');
  });


  it('should allow you to delete an entry from registry', async () => {
    digLocalData.setData(tester, {test: true});
    digLocalData.delete(tester);
    const data = await firstValueFrom(digLocalData.getData(tester));
    expect(data).toBeFalsy();
  });

  it('should clean up the local storage entry when you delete an entry from registry', async () => {
    digLocalData.setData(tester, {test: true});
    digLocalData.delete(tester);
    const key = digLocalData.getStorageKey(tester);
    expect(localStorage.getItem(key)).toBeFalsy();
  });

  it('should complete the observable when you delete an entry from registry', async () => {
    digLocalData.setData(tester, {test: true});
    const ref = digLocalData.getData(tester);
    let completed = lastValueFrom(ref);
    digLocalData.delete(tester);
    expect(await completed).toBeTruthy();
  });

  it('should allow you to clear the registry', async () => {
    digLocalData.reset();
    const data = await firstValueFrom(digLocalData.getData(tester));
    expect(data).toBeFalsy();
  });

  it('should load the complete data from local storage', async () => {
    testData.forEach(test => {
      localStorage.setItem(digLocalData.getStorageKey(test.key), JSON.stringify(test.value));
    });

    digLocalData.load();

    const first: any = await firstValueFrom(digLocalData.getData(testData[0].key));
    expect(first?.test).toBeTrue();
    const second: any = await firstValueFrom(digLocalData.getData(testData[1].key));
    expect(second?.testObj?.test).toBeTrue();

    testData.forEach(test => {
      localStorage.removeItem(digLocalData.getStorageKey(test.key));
    })
  });
  it('should allow you to get the entire state object', async () => {
    const state = await firstValueFrom(digLocalData.state());
    expect(state?.test1?.test).toBeTrue();
    expect(state?.test2?.testObj?.test).toBeTrue();
  });

  it('should allow you to filter the data you load from state', async () => {
    const testObjs: any = await firstValueFrom(digLocalData.state(value => value.hasOwnProperty('testObj')));
    expect(testObjs?.test1).toBeFalsy();
    expect(testObjs?.test2).toBeTruthy();
    expect(testObjs?.test3).toBeTruthy();
  });
});
