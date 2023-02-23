import { useState, ChangeEvent } from "react";
import { useAutoFocus } from "../../hooks/useAutoFocus";
import {
  Wrapper,
  RoundedInput,
  RoundedButton,
  LinkButton,
  Row,
} from "../Components";
import { ScreenNames, ScreenProps } from "../../types/ScreenTypes";

function LoginScreen({ cti, handleNextScreen }: ScreenProps) {
  const usernameInput = useAutoFocus();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    cti.userLoggedIn();
    handleNextScreen();
  };

  const handleUsername = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => setUsername(value);
  const handlePassword = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => setPassword(value);

  return (
    <Wrapper data-testid="login">
      <h4 style={{ textAlign: "center" }}>Log into your calling account</h4>
      <div style={{ marginBottom: "5px", fontSize: "14px" }}>User Name</div>
      <RoundedInput
        value={username}
        onChange={handleUsername}
        ref={usernameInput}
      />
      <div style={{ marginBottom: "5px", fontSize: "14px" }}>Password</div>
      <RoundedInput
        type="password"
        value={password}
        onChange={handlePassword}
      />
      <br />
      <Row>
        <RoundedButton use="primary" onClick={handleLogin}>
          Log in
        </RoundedButton>
      </Row>
      <br />
      <Row>
        <LinkButton use="transparent-on-primary" onClick={handleLogin}>
          Sign in with SSO
        </LinkButton>
      </Row>
    </Wrapper>
  );
}

export default LoginScreen;
