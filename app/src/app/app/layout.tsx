import React from "react";
import { AppSidebar } from "../../components/AppSidebar";
import { Footer } from "../../components/Footer";
import { EligibilityBanner } from "../../components/EligibilityBanner";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-white dark:bg-[#060919] text-[#050B24] dark:text-[#F8FAFC] transition-colors duration-200">
      {/* Left Sidebar */}
      <AppSidebar />

      {/* Main Content Pane */}
      <div className="app-main-content flex min-w-0 max-w-full flex-1 flex-col min-h-screen overflow-x-clip">
        {/* Dynamic Page Content */}
        <div className="mx-auto w-full max-w-7xl min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-5"><EligibilityBanner /></div>
          {children}
        </div>

        {/* Footer */}
        <Footer isApp />
      </div>
    </div>
  );
}
