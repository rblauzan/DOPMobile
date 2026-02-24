

export function Grid({ children } : {children : React.ReactNode}) {
  return <div className="px-4 mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
}
