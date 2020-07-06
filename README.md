# React Hook for Managing Async State

![npm](https://img.shields.io/npm/v/@alifaishol/use-async)

## Usage

```javascript
const options = {
  initialData: undefined,
  onError: (error: Error) => undefined,
  onSuccess: (data: Profile) => undefined,
  initialLoadingState: false,
}

const {
  exec,
  setData,
  state: {loading, data, error},
} = useAsync(Api.profile.getProfile, options);

useEffect(() => {
  exec('params for the original function (getProfile)');
}, [exec]);

const logout = useCallback((): void => {
  setData(undefined);
}, [setData]);
```
