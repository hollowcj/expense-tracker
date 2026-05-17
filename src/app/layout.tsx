"use client" 
import React, { useState } from "react";
import "./globals.css";
import { Menu, X } from "lucide-react";
import Sidebar from "./components/Sidebar"; 

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: "sans-serif" }}>
        
        
        <div style={{ display: "flex", minHeight: "100vh", width: "100vw", overflow: "hidden" }}>
          
          
          <div style={{
            width: isSidebarOpen ? "260px" : "0px",
            transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)", 
            overflow: "hidden", 
            height: "100vh",
            backgroundColor: "#062A2A" 
          }}>
            
            <div style={{ width: "260px" }}> 
              <Sidebar />
            </div>
          </div>

          
          <div style={{ 
            flex: 1, 
            display: "flex", 
            flexDirection: "column", 
            backgroundColor: "#f9fbfd",
            height: "100vh",
            overflowY: "auto"
          }}>
            
            
            <div style={{
              width: "100%",
              height: "40px", // 1. Dropped from 60px to 40px to pull the page up
              display: "flex",
              alignItems: "center",
              padding: "0 40px", 
              boxSizing: "border-box",
              marginTop: "16px" // Gives the hamburger button a clean margin from the very top screen edge
            }}>
              
              
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "8px",
                  borderRadius: "8px",
                  backgroundColor: "#ffffff",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  transition: "background-color 0.2s"
                }}
              >
                
                {isSidebarOpen ? <X size={20} color="#374151" /> : <Menu size={20} color="#374151" />}
              </button>

            </div>

            
            {/* 2. Changed top padding from 0 to 12px to tuck the content up perfectly */}
            <main style={{ flex: 1, padding: "12px 40px 40px 40px" }}>
              {children}
            </main>

          </div>

        </div>

      </body>
    </html>
  );
}