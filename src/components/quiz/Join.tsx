import React, { useEffect } from "react";
import { Container, Typography } from "@mui/material";
import JoinButton from "./uiComponent/JoinButton";
import { fatchUserFromCollection } from "../../services/authService";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../../atom/authAtom/userAtom";
import userFromCollectionAtom from "../../atom/authAtom/userFromCollectionAtom";

const Join: React.FC = () => {
  const user = useRecoilValue(userAtom);
  const [userFromCollection, setUserFromCollection] = useRecoilState(userFromCollectionAtom);

  const setUp = async () => {
    if (userFromCollection === null) {
      setUserFromCollection(await fatchUserFromCollection(user.email));
    }
  };

  useEffect(() => {
    setUp();
  }, []);

  return (
    <div>
      <Container
        maxWidth={"sm"}
        style={{
          margin: "auto",
          height: "92vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#121212",
        }}
      >
        <Container
          style={{
            border: "2px solid",
            borderColor: "#333",
            backgroundColor: "black",
            padding: "30px",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Typography variant="h4" gutterBottom align="center" style={{ color: "#fff" }}>
            Quick Join
          </Typography>
          <JoinButton />
        </Container>
      </Container>
    </div>
  );
};

export default Join;
