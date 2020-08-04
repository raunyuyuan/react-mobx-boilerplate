// 缓存请求函数
export function initCatchFetch(failed?: number) {
  let data = null;
  let promise: Promise<any> | null = null;
  if (failed === undefined) failed = 3;

  return function fetch<T>(api: (a?: any) => Promise<T>, ...params: undefined | any) {
    function check(a: any, resolve: any, reject: any) {
      if ((failed as number) >= 3) {
        reject(a);
      } else {
        (failed as number)++;
        fetchData(resolve, reject);
      }
    }

    function fetchData(prevRes?: any, prevRej?: any) {
      return new Promise((resolve, reject) => {
        api(...params)
          .then((res: any) => {
            if (res && res.status === 200) {
              data = res.data;
              prevRes ? prevRes(data) : resolve(data);
            } else {
              check(res, prevRes || resolve, prevRej || reject);
            }
          })
          .catch((e) => {
            check(e, prevRes || resolve, prevRej || reject);
          });
      });
    }
    if (!promise) {
      promise = fetchData();
      return promise;
    }
    return promise;
  };
}
