import { act, renderHook } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe } from "vitest";
import useBulkUrlParams from "./useBulkUrlParams";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter initialEntries={["/"]}>{children}</MemoryRouter>
);

describe("useBulkUrlParams", () => {
  it("initiate hook with all needed params", () => {
    const { result } = renderHook(
      () =>
        useBulkUrlParams({
          filter: ["active", "inactive"],
          sort: ["asc", "desc"],
        }),
      { wrapper },
    );

    expect(result.current.isFilterActive).toBe(false);
    expect(result.current.isFilterInactive).toBe(false);
    expect(result.current.isSortAsc).toBe(false);
    expect(result.current.isSortDesc).toBe(false);
    expect(result.current.set).toBeTypeOf("function");
  });

  it("set correct batch data", () => {
    const { result } = renderHook(
      () =>
        useBulkUrlParams({
          filter: ["active", "inactive"],
          sort: ["asc", "desc"],
        }),
      { wrapper },
    );

    expect(result.current.isFilterActive).toBe(false);
    expect(result.current.isSortAsc).toBe(false);

    act(() => result.current.set({ filter: "active", sort: "asc" }));

    expect(result.current.isFilterActive).toBe(true);
    expect(result.current.isSortAsc).toBe(true);
  });

  it("set correct batch data and not override old one", () => {
    const { result } = renderHook(
      () =>
        useBulkUrlParams({
          filter: ["active", "inactive"],
          sort: ["asc", "desc"],
        }),
      { wrapper },
    );

    act(() => result.current.set({ sort: "asc" }));
    expect(result.current.isSortAsc).toBe(true);

    act(() => result.current.set({ filter: "active" }));
    expect(result.current.isFilterActive).toBe(true);
    expect(result.current.isSortAsc).toBe(true);
  });

  it("should clear params", () => {
    const { result } = renderHook(
      () =>
        useBulkUrlParams({
          filter: ["active", "inactive"],
          sort: ["asc", "desc"],
        }),
      { wrapper },
    );

    act(() => result.current.set({ filter: "inactive", sort: "desc" }));

    expect(result.current.isSortDesc).toBe(true);
    expect(result.current.isFilterInactive).toBe(true);

    act(() => result.current.clearParams());

    expect(result.current.isSortDesc).toBe(false);
    expect(result.current.isFilterInactive).toBe(false);
  });
});
