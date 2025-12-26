import { act, renderHook } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import useUrlParams from "./useUrlParams";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter initialEntries={["/?view=grid"]}>{children}</MemoryRouter>
);

describe("useUrlParams", () => {
  it("initiate with all provided params following correct interface", () => {
    const { result } = renderHook(
      () => useUrlParams({ keyName: "view", options: ["grid", "table"] }),
      { wrapper },
    );
    expect(result.current.view).toBe("grid");
    expect(result.current.isViewGrid).toBe(true);
    expect(result.current.isViewTable).toBe(false);
    expect(result.current.setView).toBeTypeOf("function");
    expect(result.current.toggleView).toBeTypeOf("function");
    expect(result.current.clearView).toBeTypeOf("function");
  });

  it("reads current value and produced field is<Key><Option>", () => {
    const { result } = renderHook(
      () => useUrlParams({ keyName: "view", options: ["grid", "table"] }),
      { wrapper },
    );
    expect(result.current.view).toBe("grid");
    expect(result.current.isViewGrid).toBe(true);
    expect(result.current.isViewTable).toBe(false);
  });

  it("should clear clear params ", () => {
    const { result } = renderHook(
      () => useUrlParams({ keyName: "view", options: ["grid", "table"] }),
      { wrapper },
    );

    expect(result.current.view).toBe("grid");
    act(() => result.current.clearView());
    expect(result.current.view).toBeNull();
  });

  it("set<Key> updates value", () => {
    const { result } = renderHook(
      () => useUrlParams({ keyName: "view", options: ["grid", "table"] }),
      { wrapper },
    );
    act(() => result.current.setView("table"));
    expect(result.current.view).toBe("table");
    expect(result.current.isViewTable).toBe(true);
  });

  it("toggle<Key> toggle value btw two options", () => {
    const { result } = renderHook(
      () => useUrlParams({ keyName: "view", options: ["grid", "table"] }),
      { wrapper },
    );

    act(() => result.current.toggleView());
    expect(result.current.view).toBe("table");
    act(() => result.current.toggleView());
    expect(result.current.view).toBe("grid");
    act(() => result.current.toggleView());
    expect(result.current.view).toBe("table");
  });

  it("toggle<Key> not possible for more than two options", () => {
    const { result } = renderHook(
      () => useUrlParams({ keyName: "view", options: ["grid", "table", "dashboard"] }),
      { wrapper },
    );
    expect(result.current.view).toBe("grid");
    act(() => result.current.toggleView());
    expect(result.current.view).toBe("grid");
    act(() => result.current.toggleView());
    expect(result.current.view).toBe("grid");
  });
});
