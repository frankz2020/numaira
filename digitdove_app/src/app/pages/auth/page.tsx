"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { useGlobalContext } from "@/app/providers/GlobalContext";
import { useFormat } from "@/app/providers/FormatContext";
import { useTheme } from "@/app/providers/ThemeContext";
import LogoSVG from "../../assets/Logo.svg";

import nextCookie from 'next-cookies';
const GreyText = styled.div`
  color: ${(props) => props.theme.neutral700};
`;

const ErrorText = styled.div`
  color: red;
  font-size: 0.875rem;
`;

const Login = () => {
  const router = useRouter();
  const { setLoggedIn } = useGlobalContext();
  const { format } = useFormat();
  const { theme } = useTheme();
  const { backendUrl } = useGlobalContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");

  const validateForm = () => {
    let valid = true;
    setEmailError("");
    setPasswordError("");
    setLoginError("");

    if (!email) {
      setEmailError("Email is required");
      valid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
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
        console.log("data:", data)
        setLoggedIn(true);
        router.push("/home");

        const aliveResponse = await fetch(backendUrl + "/user/current_user", {
          method: "GET",
          credentials: "include",
        });

        aliveResponse.json().then((data: any) => {
          console.log("alive:", data);
        });

      } catch (error) {
        console.log(error);
        setLoginError("Incorrect email and password combination");
      }
    }
  };

  return (
    <div className="flex justify-center w-100 h-100">
      <div
        className="flex justify-center flex-col p-4 h-100"
        style={{ maxWidth: "500px", height: "100vh" }}
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
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
