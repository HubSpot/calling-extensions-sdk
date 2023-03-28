import {
  fireEvent,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import FromNumberPopover from "../../../src/components/FromNumberPopover";
import { renderWithContext } from "../../render";

const noop = (..._args: any[]) => {};

const props = {
  fromNumber: "",
  setFromNumber: noop,
  setToggleFromNumbers: noop,
  toggleFromNumbers: false,
};

describe("FromNumberPopover", () => {
  beforeEach(() => {
    props.setToggleFromNumbers = jasmine.createSpy("setToggleFromNumbers");
  });
  it("Sets aria label of fromNumber popover correctly using toggleFromNumbers", () => {
    const { getByLabelText } = renderWithContext(
      <FromNumberPopover {...props} />
    );
    expect(getByLabelText(/from-number-close/)).toBeInTheDocument();
  });
  it("Shows US and UK numbers", () => {
    const { getByRole } = renderWithContext(
      <FromNumberPopover {...props} toggleFromNumbers={true} />
    );
    expect(getByRole("button", { name: "us-number" })).toBeInTheDocument();
    expect(getByRole("button", { name: "uk-number" })).toBeInTheDocument();
  });
  it("Hides numbers popover when a number is clicked", async () => {
    const { getByLabelText, getByRole } = renderWithContext(
      <FromNumberPopover {...props} toggleFromNumbers={true} />
    );
    expect(getByLabelText(/from-number-open/)).toBeInTheDocument();
    const button = getByRole("button", { name: "uk-number" });
    button.click();
    expect(props.setToggleFromNumbers).toHaveBeenCalledWith(false);
  });
});
