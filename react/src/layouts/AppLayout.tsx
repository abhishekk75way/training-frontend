import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const AppLayout = ({ children }: Props) => {
  return (
    <div>
      <main style={{ padding: 20 }}>{children}</main>
    </div>
  );
};

export default AppLayout;
