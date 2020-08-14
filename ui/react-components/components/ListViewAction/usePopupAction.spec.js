import {renderHook, act} from "@testing-library/react-hooks";
import usePopupAction from "./usePopupAction";

it('show is set to false on close', () => {
  const {result} = renderHook(() => usePopupAction());

  expect(result.current.show).toBeTruthy();
  act(() => result.current.handleClose());
  expect(result.current.show).toBeFalsy();
});
