"use client";
import AuthContext from "@/utils/context/auth-context";
import UserContext from "@/utils/context/user-context";
import { Button, Modal, Spin } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Main({ children }) {
  const [isAuthorised, setIsAuthorised] = useState(false);
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [modalIsOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setModalOpen(true);
    const authorised = async () => {
      setLoading(true);
      try {
        const response = await fetch("api/authorization", {
          method: "POST",
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data)
          setIsAuthorised(data?.message?.access_token);
          setUser(data?.message?.email);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    authorised();
  }, []);

  return (
    <div>
      {loading && (
        <Spin
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            height: "100vh",
            background: "rgb(30 58 138)",
          }}
          spinning={loading}
        />
      )}
      {!loading && !isAuthorised && (
        <Modal
          open={modalIsOpen}
          closeIcon={null}
          footer={[
            <div
              key="sign-in"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <p>
                You are not authorised to access this page Click button below to
                log in
              </p>
              <br />
              <Button
                key="submit"
                type="primary"
                onClick={() => {
                  router.push("/sign-in");
                }}
                style={{
                  width: "50%",
                  borderRadius: "0.2em",
                  marginBottom: "0.5em",
                }}
              >
                Login
              </Button>
            </div>,
          ]}
        />
      )}

      {!loading && isAuthorised && (
        <AuthContext.Provider value={isAuthorised}>
          <UserContext.Provider value={user}>{children}</UserContext.Provider>
        </AuthContext.Provider>
      )}
    </div>
  );
}
