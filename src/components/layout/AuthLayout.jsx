import Footer from "./Footer";
function AuthLayout({ children }) {
    return (
      <div className="min-h-screen flex flex-col ">
        <main className="flex-1">
          <div className="min-h-[calc(100vh-64px)] ">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    );
  };
  
export default AuthLayout;