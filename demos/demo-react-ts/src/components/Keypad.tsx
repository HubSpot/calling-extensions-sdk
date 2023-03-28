import { Key, Row } from "./Components";

export function Keypad({ addToDialNumber }: { addToDialNumber: Function }) {
  return (
    <div>
      <Row>
        <Key onClick={() => addToDialNumber("1")}>1</Key>
        <Key onClick={() => addToDialNumber("2")}>2</Key>
        <Key onClick={() => addToDialNumber("3")}>3</Key>
      </Row>
      <Row>
        <Key onClick={() => addToDialNumber("4")}>4</Key>
        <Key onClick={() => addToDialNumber("5")}>5</Key>
        <Key onClick={() => addToDialNumber("6")}>6</Key>
      </Row>
      <Row>
        <Key onClick={() => addToDialNumber("7")}>7</Key>
        <Key onClick={() => addToDialNumber("8")}>8</Key>
        <Key onClick={() => addToDialNumber("9")}>9</Key>
      </Row>
      <Row>
        <Key onClick={() => addToDialNumber("*")}>*</Key>
        <Key onClick={() => addToDialNumber("0")}>0</Key>
        <Key onClick={() => addToDialNumber("#")}>#</Key>
      </Row>
    </div>
  );
}

export function KeypadPopover() {
  return (
    <div>
      <Row>
        <Key>1</Key>
        <Key>2</Key>
        <Key>3</Key>
      </Row>
      <Row>
        <Key>4</Key>
        <Key>5</Key>
        <Key>6</Key>
      </Row>
      <Row>
        <Key>7</Key>
        <Key>8</Key>
        <Key>9</Key>
      </Row>
      <Row>
        <Key>*</Key>
        <Key>0</Key>
        <Key>#</Key>
      </Row>
    </div>
  );
}
