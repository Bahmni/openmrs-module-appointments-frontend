import {renderHook, act} from "@testing-library/react-hooks";
import useListViewAction from "./useListViewAction";

it('show is set to false on close', () => {
  const {result} = renderHook(() => useListViewAction());

  expect(result.current.show).toBeTruthy();
  act(() => result.current.handleClose());
  expect(result.current.show).toBeFalsy();
});
