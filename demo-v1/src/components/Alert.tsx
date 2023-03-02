import { ReactElement, MouseEventHandler } from "react";
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
        backgroundColor: "white",
        border: "2px solid #CBD6E2",
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
