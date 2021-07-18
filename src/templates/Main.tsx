import { ReactNode, useState } from 'react';
import DashboardTopbar from 'src/templates/topbar';
import { experimentalStyled } from '@material-ui/core';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const DashboardLayoutRoot = experimentalStyled('div')(({ theme }) => ({
  display: 'flex',
  height: '100%',
  overflow: 'hidden',
  width: '100%'
}));

const Main = (props: IMainProps) => {
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="">
      {props.meta}
      <DashboardLayoutRoot>
        <DashboardTopbar onMobileNavOpen={() => setMobileNavOpen(true)} />
        <div
          className="py-5 text-xl content"
          style={{ marginTop: '70px', width: '100%', height: '100%' }}
        >
          {props.children}
        </div>
      </DashboardLayoutRoot>
    </div>
  );
};

export { Main };
