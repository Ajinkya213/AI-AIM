// pages/Userboard.tsx
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/userboard/Sidebar";
import { MainContent } from "@/components/userboard/MainContent";
import { v4 as uuidv4 } from 'uuid';

export function Userboard() {
  const [pastQueries, setPastQueries] = React.useState([
    { id: "query-1", name: "Query about React Hooks", href: "/userboard?query=query-1" },
    { id: "query-2", name: "Vite Project Setup", href: "/userboard?query=query-2" },
    { id: "query-3", name: "Tailwind CSS Basics", href: "/userboard?query=query-3" },
  ]);

  const location = useLocation();
  const navigate = useNavigate();

  const currentQueryId = new URLSearchParams(location.search).get("query");

  const handleNewQuery = () => {
    const newId = uuidv4();
    const newName = `New Query ${pastQueries.length + 1}`;
    const newQuery = { id: newId, name: newName, href: `/userboard?query=${newId}` };
    setPastQueries((prev) => [newQuery, ...prev]);
    navigate(`/userboard?query=${newId}`);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        pastQueries={pastQueries}
        onNewQuery={handleNewQuery}
      />
      {/*
        Removed queryContent prop as MainContent now manages its own
        chat and file states internally and bases them on currentQueryId.
      */}
      <MainContent
        currentQueryId={currentQueryId || undefined}
      />
    </div>
  );
}