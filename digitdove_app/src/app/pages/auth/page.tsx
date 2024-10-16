"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { useGlobalContext } from "@/app/providers/GlobalContext";
import { useFormat } from "@/app/providers/FormatContext";
import { useTheme } from "@/app/providers/ThemeContext";
import LogoSVG from "../../assets/Logo.svg";

const GreyText = styled.div`
  color: ${(props) => props.theme.neutral700};
`;

const BrightText = styled.div`
  color: ${(props) => props.theme.neutral1000};
`;

const ErrorText = styled.div`
  color: red;
  font-size: 0.875rem;
`;

const Login = () => {
  const router = useRouter();
  const { setLoggedIn, setUser } = useGlobalContext();
  const { format } = useFormat();
  const { theme } = useTheme();
  const { backendUrl } = useGlobalContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [loginError, setLoginError] = useState("");

  const [loginView, setLoginView] = useState(true);

  const validateForm = () => {
    let valid = true;
    setEmailError("");
    setPasswordError("");
    setUsernameError("");
    setLoginError("");

    if (!email) {
      setEmailError("Email is required");
      valid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    }

    if (!username && !loginView) {
      setUsernameError("Username is required");
      valid = false;
    }

    return valid;
  };

  const handleLogin = async () => {
    if (validateForm()) {
      try {
        const response = await fetch(backendUrl + "/user/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          throw new Error("Invalid email or password");
        }

        const data = await response.json();
        console.log("data:", data);
        setLoggedIn(true);
        router.push("/home");

        const aliveResponse = await fetch(backendUrl + "/user/current_user", {
          method: "GET",
          credentials: "include",
        });

        aliveResponse.json().then((data: any) => {
          console.log("alive:", data);
          setUser(data.user)
        });
      } catch (error) {
        console.log(error);
        setLoginError("Incorrect email and password combination");
      }
    }
  };

  const handleSignup = async () => {
    console.log("sign up")
    if (validateForm()) {
      try {
        const response = await fetch(backendUrl + "/user/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, username }),
        });

        if (!response.ok) {
          throw new Error("Signup failed");
        } else {
          handleLogin();
        }

        const data = await response.json();
        console.log("data:", data);
        setLoggedIn(true);
        router.push("/home");
      } catch (error) {
        console.log(error);
        setLoginError("Signup failed. Please try again.");
      }
    }
  };

  return (
    <div className="flex justify-center w-100 h-100">
      <div
        className="flex justify-center flex-col"
        style={{
          transform: loginView ? "translateY(0)" : "translateY(-100vh)",
          transition: "transform 0.5s ease-in-out",
        }}
      >
        {/* sign in form  */}
        <div
          className="flex justify-center flex-col p-4 h-100"
          style={{
            maxWidth: "500px",
            height: "100vh",
            minWidth: "300px",
          }}
        >
          <div className="flex justify-center">
            <LogoSVG />
          </div>

          <div
            className="text-xl text-center p-5"
            style={{ fontSize: format.displayMD }}
          >
            Sign in
          </div>
          <GreyText className="text-sm text-center pt-1 pb-10">
            Welcome back! Please enter your credentials
          </GreyText>
          <GreyText>Email:</GreyText>
          <input
            className={`w-full px-4 py-2  border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              emailError ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Your email..."
            type="email"
            value={email}
            onChange={(e) => {
              setEmailError("");
              setEmail(e.target.value);
            }}
          />
          {emailError && <ErrorText>{emailError}</ErrorText>}
          <GreyText className="mt-3">Password:</GreyText>
          <input
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              passwordError ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Password..."
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError("");
            }}
          />
          {passwordError && <ErrorText>{passwordError}</ErrorText>}
          {loginError && <ErrorText>{loginError}</ErrorText>}
          <div className="flex justify-end">
            <button
              className="ms-3 font-semibold mt-3"
              style={{ color: theme.brand500 }}
            >
              Forgot Password
            </button>
          </div>

          <button
            className="w-full px-4 py-1 mt-10 text-white focus:outline-none mb-3"
            style={{
              backgroundColor: theme.brand500,
              borderRadius: format.roundmd,
            }}
            onClick={handleLogin}
          >
            Log in
          </button>

          <div className="flex">
            <GreyText>{"Don't have an account?"}</GreyText>
            <button
              className="ms-3 font-semibold"
              style={{ color: theme.brand500 }}
              onClick={() => setLoginView(false)}
            >
              Sign up
            </button>
          </div>
        </div>

        {/* sign up form  */}
        <div
          className="flex justify-center flex-col p-4 h-100"
          style={{
            maxWidth: "500px",
            height: "100vh",
            minWidth: "300px",
          }}
        >
          <div className="flex justify-center">
            <LogoSVG />
          </div>

          <div
            className="text-xl text-center p-5"
            style={{ fontSize: format.displayMD }}
          >
            Sign up
          </div>
          <GreyText className="text-sm text-center pt-1 pb-10">
            Welcome To Numaira!
          </GreyText>

          <GreyText className="mt-3">Username:</GreyText>
          <input
            className={`w-full px-4 py-2  border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              usernameError ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Username..."
            type="text"
            value={username}
            onChange={(e) => {
              setUsernameError("");
              setUsername(e.target.value);
            }}
          />
          {usernameError && <ErrorText>{usernameError}</ErrorText>}

          <GreyText className="mt-3">Email:</GreyText>
          <input
            className={`w-full px-4 py-2  border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              emailError ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Your email..."
            type="email"
            value={email}
            onChange={(e) => {
              setEmailError("");
              setEmail(e.target.value);
            }}
          />
          {emailError && <ErrorText>{emailError}</ErrorText>}
          <GreyText className="mt-3">Password:</GreyText>
          <input
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              passwordError ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Password..."
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError("");
            }}
          />
          {passwordError && <ErrorText>{passwordError}</ErrorText>}
          {loginError && <ErrorText>{loginError}</ErrorText>}

          <button
            className="w-full px-4 py-1 mt-10 text-white focus:outline-none mb-3"
            style={{
              backgroundColor: theme.brand500,
              borderRadius: format.roundmd,
            }}
            onClick={handleSignup}
          >
            Sign Up
          </button>

          <div className="flex">
            <GreyText>{"Have an account?"}</GreyText>
            <button
              className="ms-3 font-semibold"
              style={{ color: theme.brand500 }}
              onClick={() => setLoginView(true)}
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
