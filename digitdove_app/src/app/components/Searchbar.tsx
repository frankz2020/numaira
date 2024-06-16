import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useFormat } from "../providers/FormatContext";
import { useTheme } from "../providers/ThemeContext";
import SearchSVG from "../assets/search.svg";

const SearchContainer = styled.div<{ isFocused: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.3rem;
  border-radius: 4px;
  box-shadow: ${({ isFocused }) =>
    isFocused
      ? "0 6px 10px rgba(0, 0, 0, 0.3)"
      : "0 2px 4px rgba(0, 0, 0, 0.2)"};
  transition: box-shadow 0.3s, border-color 0.3s;
  background-color: ${({ theme }) => theme.backgroundColor};
  min-width: 30%;
  width: 440px;
  z-index: 11; // Ensure the search container is above the blurred overlay
`;

const SearchInput = styled.input<{ isFocused: boolean }>`
  flex: 1;
  padding: 0.5rem;
  border: none;
  outline: none;
  background-color: transparent;
  color: ${({ theme }) => theme.textColor};
  &::placeholder {
    color: ${({ theme }) => theme.textColor};
  }
`;

const SearchResultContainer = styled.div`
  position: absolute;
  top: 10vh;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: 600px;
  padding: 1rem;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background-color: ${({ theme }) => theme.backgroundColor};
  z-index: 10;
`;

const BlurredOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(5px);
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 5;
`;

export const SearchBar: React.FC = () => {
  const { format } = useFormat();
  const { theme } = useTheme();
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const searchResultRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchResultRef.current &&
      !searchResultRef.current.contains(event.target as Node)
    ) {
      setIsFocused(false);
      setSearch("");
    }
  };

  useEffect(() => {
    if (isFocused) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFocused]);

  return (
    <div className="relative">
      <SearchContainer theme={theme} isFocused={isFocused}>
        <SearchSVG
          width={24}
          height={24}
          className="ms-2"
          stroke={theme.textColor}
        />
        <SearchInput
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e: any) => setSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          theme={theme}
          isFocused={isFocused}
        />
      </SearchContainer>
      {isFocused && search && (
        <>
          <BlurredOverlay />
          <SearchResultContainer theme={theme} ref={searchResultRef}>
            {/* Render search results here */}
            <div className="text-xl py-2">{search}</div>

            <hr className="p-2" />
            <p>Search results shows below</p>
          </SearchResultContainer>
        </>
      )}
    </div>
  );
};

export default SearchBar;
