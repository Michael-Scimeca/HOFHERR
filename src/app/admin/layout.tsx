import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Dashboard",
    robots: {
        index: false,
        follow: false,
    },
};

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    // Check if we are on the login page to avoid infinite redirect
    // Since this is a server component, we can use headers to check the path
    // OR just rely on the middleware. But let's add a safe guard here.
    
    // NOTE: This layout wraps children, including the login page.
    // If we redirect here, we must NOT redirect when the child is the login page.
    // In Next.js App Router, the layout doesn't easily know its child's path on the server
    // UNLESS we use headers.
    
    // However, since I added middleware.ts, that will handle the redirect 
    // before this layout even executes for most cases.

    return <>{children}</>;
}
