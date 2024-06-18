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
  border: ${({ theme }) => `2px solid ${theme.fourthColor}`};
  transition: border 0.3s, border-color 0.3s, width 0.3s ease-in-out, height 0.3s ease-in-out;
  background-color: ${({ theme }) => theme.backgroundColor};
  width: 440px;
  max-width: 600px;
  position: relative;
  z-index: 11; // Ensure the search container is above the blurred overlay
`;

const SearchInputContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
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

const SearchResultContainer = styled.div<{ isFocused: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 40vh; // Limit the height of the search results container
  overflow-y: auto; // Make it scrollable if the content overflows
  margin-top: 0.3rem; // Add some space between the input and results
  border-radius: 4px;
  border-left: ${({ theme }) => `2px solid ${theme.fourthColor}`};
  border-right: ${({ theme }) => `2px solid ${theme.fourthColor}`};
  border-bottom: ${({ theme }) => `2px solid ${theme.fourthColor}`};
  background-color: ${({ theme }) => theme.backgroundColor};
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
  opacity: ${({ isFocused }) => (isFocused ? 1 : 0)};
  pointer-events: ${({ isFocused }) => (isFocused ? "auto" : "none")};
  z-index: 10;
  padding: 0.3rem;
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
        <SearchInputContainer>
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
        </SearchInputContainer>
        {isFocused && search && (
          <SearchResultContainer theme={theme} ref={searchResultRef} isFocused={isFocused}>
            {/* Render search results here */}
            <p>Search results show below</p>
            <p>Search results show below</p>
            <p>Search results show below</p>
            <p>Search results show below</p>
            <p>Search results show below</p>
            <p>Search results show below</p>
            <p>Search results show below</p>
            <p>Search results show below</p>
            <p>Search results show below</p>
          </SearchResultContainer>
        )}
      </SearchContainer>
      {isFocused && search && <BlurredOverlay />}
    </div>
  );
};

export default SearchBar;
