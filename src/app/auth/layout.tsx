const Layout = ({ children }: { children: React.ReactNode }) => {
  return <div className="h-screen w-full overflow-hidden bg-[#fefefe]">{children}</div>;
};

export default Layout;
