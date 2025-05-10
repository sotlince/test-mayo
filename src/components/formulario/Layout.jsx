import React, { Component } from "react";
import Header from "./Header";
import VideoPlayer from "./VideoPlayer";
import { Outlet, useLocation } from "react-router-dom";

const Layout = ({ children, video }) => {
  return (
    <>
      <Header />
      {video && (
        <div className="cont-player">
          <VideoPlayer name={video} />
        </div>
      )}
      <main className="main">{children}</main>
    </>
  );
};

export default Layout;
