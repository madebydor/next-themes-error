const AuthenticationLayout = ({ children }: { children: React.ReactNode }) => {
    return (
      <div className="relative">
        {/* <div className="absolute left-1/2 top-4 -translate-x-1/2">
          <Logo />
        </div> */}
        <div className="flex min-h-screen justify-center">
          {/* <div className="flex w-full max-w-md flex-col gap-2 rounded-xl bg-background p-8 shadow-epic"> */}
          <div className="container mt-16 flex w-full max-w-sm flex-col gap-3 px-4">{children}</div>
          {/* </div> */}
        </div>
        {/* <Image
          className="fixed left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2"
          src="/ambient.svg"
          width={730}
          height={454}
          alt=""
        /> */}
      </div>
    );
  };
  
  export default AuthenticationLayout;
  