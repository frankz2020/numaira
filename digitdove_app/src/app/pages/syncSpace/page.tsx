"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/app/providers/ThemeContext";
import { useFormat } from "@/app/providers/FormatContext";
import { useGlobalContext } from "@/app/providers/GlobalContext";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import PlusSVG from "./asset/plus.svg";
const Page = () => {
  const { theme } = useTheme();
  const { format } = useFormat();
  const { backendUrl, user } = useGlobalContext();
  const router = useRouter();
  const SyncSpaceCard = styled.div`
    background-color: ${theme.neutral};
    border-radius: ${format.roundmd};
    border-color: ${theme.neutral200};
    border-width: 2px;
    padding: 1rem;
    margin: 1rem;
    width: 230px;
    height: 270px;
    cursor: pointer;
  `;

  // State for managing syncspaces, loading and error states
  const [syncspaces, setSyncspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch syncspaces from backend
  useEffect(() => {
    // Async function inside the useEffect
    const fetchSyncspaces = async () => {
      setLoading(true); // Start loading
      setError(null); // Clear previous errors

      try {
        // Make the API call
        const response = await fetch(
          `${backendUrl}/user/${user.id}/syncspaces`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`Error fetching syncspaces: ${response.statusText}`);
        }

        const data = await response.json();
        setSyncspaces(data); // Store fetched data in state
      } catch (error: any) {
        setError(error.message); // Handle error
      } finally {
        setLoading(false); // Always set loading to false when done
      }
    };

    // Fetch syncspaces when backendUrl and user.id are available
    if (backendUrl && user?.id) {
      fetchSyncspaces();
    }
  }, [backendUrl, user?.id]); // Effect depends on backendUrl and user.id

  return (
    <div className="p-10">
      <div
        style={{
          color: theme.neutral1000,
          fontWeight: 600,
          fontSize: format.textXL,
        }}
      >
        SyncSpace
      </div>
      {loading && <p>Loading...</p>} {/* Show loading state */}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}{" "}
      {/* Show error message */}
      {!loading && !error && (
        <div className="flex">
          {syncspaces.length > 0 && (
            syncspaces.map((syncspace: any) => (
              <SyncSpaceCard key={syncspace.id}>
                {syncspace.name} - Last edited:{" "}
                {new Date(syncspace.last_edit).toLocaleString()}
              </SyncSpaceCard>
            ))
          )}
          <SyncSpaceCard onClick={() => {router.push("/syncSpace/space")}}>
            <div className="w-100 flex-col flex items-center justify-center" style={{height: '100%'}}>
              <PlusSVG />
              <div style={{ fontWeight: 600, fontSize: format.textLG }}> New Space</div>
            </div>
          </SyncSpaceCard>
        </div>
      )}
    </div>
  );
};

export default Page;
