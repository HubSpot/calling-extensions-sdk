import FromNumbersDropdown from "../../../src/components/FromNumbersDropdown";
import { renderWithContext } from "../../render";

const noop = (..._args: any[]) => {};

const props = {
  fromNumber: "",
  setFromNumber: noop,
  setToggleFromNumbers: noop,
  toggleFromNumbers: false,
};

describe("FromNumbersDropdown", () => {
  beforeEach(() => {
    props.setToggleFromNumbers = jasmine.createSpy("setToggleFromNumbers");
  });
  it("Sets aria label of numbers dropdown correctly using toggleFromNumbers", () => {
    const { getByLabelText } = renderWithContext(
      <FromNumbersDropdown {...props} />
    );
    expect(getByLabelText(/from-number-close/)).toBeInTheDocument();
  });
  it("Shows US and UK numbers", () => {
    const { getByRole } = renderWithContext(
      <FromNumbersDropdown {...props} toggleFromNumbers={true} />
    );
    expect(getByRole("button", { name: "us-number" })).toBeInTheDocument();
    expect(getByRole("button", { name: "uk-number" })).toBeInTheDocument();
  });
  it("Hides numbers dropdown when a number is clicked", async () => {
    const { getByLabelText, getByRole } = renderWithContext(
      <FromNumbersDropdown {...props} toggleFromNumbers={true} />
    );
    expect(getByLabelText(/from-number-open/)).toBeInTheDocument();
    const button = getByRole("button", { name: "uk-number" });
    button.click();
    expect(props.setToggleFromNumbers).toHaveBeenCalledWith(false);
  });
});
