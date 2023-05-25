import { ReactElement, MouseEventHandler } from "react";
import { BATTLESHIP, OLAF } from "../utils/colors";
import { LinkButton } from "./Components";

function Alert({
  title,
  onConfirm,
}: {
  title: string | ReactElement;
  onConfirm: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <div
      style={{
        backgroundColor: OLAF,
        border: `2px solid ${BATTLESHIP}`,
        padding: "10px",
        display: "flex",
        fontSize: "13px",
      }}
    >
      {title}
      <LinkButton use="transparent-on-primary" onClick={onConfirm}>
        &times;
      </LinkButton>
    </div>
  );
}

export default Alert;
