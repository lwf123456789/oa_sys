"use client";
import React from "react";
import { BreadcrumbProvider } from '@/contexts/breadcrumbContext';
import { MenuProvider } from '@/contexts/menuContext';
import { LayoutProvider } from '@/contexts/layoutContext';
import '@/styles/globals.css'
import { SessionProvider } from "next-auth/react"
import { ConfigProvider } from 'antd';
import 'dayjs/locale/zh-cn';
import Metadata from "@/components/Metadata";
import { ReactFlowProvider } from 'reactflow';
import { AuthRoute } from "@/components/AuthRoute";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <Metadata seoTitle="大数据平台" seoDescription="后台系统" icon="/favicon.ico" />

      <body suppressHydrationWarning={true}>
        <ConfigProvider>
          <SessionProvider refetchInterval={10 * 60}>
            <ReactFlowProvider>
              <MenuProvider>
                <AuthRoute>
                  <BreadcrumbProvider>
                    <LayoutProvider>
                      <div>
                        {children}
                      </div>
                    </LayoutProvider>
                  </BreadcrumbProvider>
                </AuthRoute>
              </MenuProvider>
            </ReactFlowProvider>
          </SessionProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}