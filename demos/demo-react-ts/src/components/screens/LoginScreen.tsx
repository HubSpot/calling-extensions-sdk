import { useState, ChangeEvent } from "react";
import { useAutoFocus } from "../../hooks/useAutoFocus";
import {
  Wrapper,
  RoundedInput,
  RoundedButton,
  LinkButton,
  Row,
} from "../Components";
import { ScreenProps } from "../../types/ScreenTypes";
import { PANTERA } from "../../utils/colors";
import { LOG_IN } from "../../constants/buttonIds";

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

  const handleOpenWindow = () => {
    const hostUrl = "https://app.hubspotqa.com/";
    const url = `${hostUrl}/calling-integration-popup-ui/${cti.portalId}?usesCallingWindow=false`;
    window.open(url, "_blank");
  };

  return (
    <Wrapper style={{ color: PANTERA }}>
      <form>
        <h4 style={{ textAlign: "center" }}>Log into your calling account</h4>
        <div style={{ marginBottom: "5px", fontSize: "14px" }}>User Name</div>
        <RoundedInput
          value={username}
          onChange={handleUsername}
          ref={usernameInput}
          autoComplete="username"
        />
        <div style={{ marginBottom: "5px", fontSize: "14px" }}>Password</div>
        <RoundedInput
          type="password"
          value={password}
          onChange={handlePassword}
          autoComplete="current-password"
        />
        <br />
        <Row>
          <RoundedButton
            use="primary"
            onClick={handleLogin}
            type="button"
            data-test-id={LOG_IN}
          >
            Log in
          </RoundedButton>
        </Row>
        <br />
        <Row>
          <LinkButton
            use="transparent-on-primary"
            onClick={handleLogin}
            type="button"
          >
            Sign in with SSO
          </LinkButton>
        </Row>
        <br />
        {!cti.usesCallingWindow && (
          <Row>
            <LinkButton
              use="transparent-on-primary"
              onClick={handleOpenWindow}
              type="button"
            >
              Open calling window
            </LinkButton>
          </Row>
        )}
      </form>
    </Wrapper>
  );
}

export default LoginScreen;
